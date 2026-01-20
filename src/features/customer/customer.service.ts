import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, PublicCustomer } from './entities/customer.entity';
import { CustomerSortField, QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AppCacheService } from '../../common/global-modules/app-cache/app-cache.service';
import { CustomerGateway } from './customer.gateway';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly appCache: AppCacheService,
    private readonly customerGateway: CustomerGateway,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<PublicCustomer> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
    });

    const savedCustomer = await this.customerRepository.save(customer);

    await this.appCache.invalidateByPrefix('customers:/customers:');
    this.customerGateway.emitCustomerCreated('customer.created');

    return this.toPublicDto(savedCustomer);
  }
  async findAll(
    queryDto: QueryCustomerDto,
  ): Promise<PaginatedResponse<PublicCustomer>> {
    const {
      page = 1,
      limit = 10,
      search,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    // I saw in the test file that customer/:id will return more details about the customer, so I select only necessary fields here
    queryBuilder.select([
      'customer.id',
      'customer.fullName',
      'customer.email',
      'customer.createdAt',
    ]);

    if (search)
      queryBuilder.andWhere('customer.fullName ILIKE :search', {
        search: `%${search}%`,
      });

    if (dateFrom && dateTo)
      queryBuilder.andWhere(
        'customer.createdAt BETWEEN :dateFrom AND :dateTo',
        {
          dateFrom: new Date(dateFrom),
          dateTo: new Date(dateTo),
        },
      );
    else if (dateFrom)
      queryBuilder.andWhere('customer.createdAt >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    else if (dateTo)
      queryBuilder.andWhere('customer.createdAt <= :dateTo', {
        dateTo: new Date(dateTo),
      });

    const sortField =
      sortBy === CustomerSortField.FULL_NAME
        ? 'customer.fullName'
        : 'customer.createdAt';

    queryBuilder.orderBy(sortField, sortOrder ?? 'ASC');

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<PublicCustomer | null> {
    return this.customerRepository.findOneBy({ id });
  }

  async findOneInternal(id: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        nationalId: true,
        internalNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<PublicCustomer> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) throw new Error('customer_not_found');

    const updatedCustomer = this.customerRepository.merge(
      customer,
      updateCustomerDto,
    );
    const savedCustomer = await this.customerRepository.save(updatedCustomer);

    await this.appCache.invalidateByPrefix('customers:/customers:');
    await this.appCache.invalidateByPrefix(`customers:/customers/${id}`);

    this.customerGateway.emitCustomerCreated('customer.updated');
    return this.toPublicDto(savedCustomer);
  }

  /* ---------------------------------- Tools --------------------------------- */
  private toPublicDto(customer: Customer): PublicCustomer {
    return {
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
