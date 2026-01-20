import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, PublicCustomer } from './entities/customer.entity';
import { CustomerSortField, QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { SortOrder } from '../../common/dto/sorting.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<PublicCustomer> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
    });

    const savedCustomer = await this.customerRepository.save(customer);

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
      sortBy = CustomerSortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
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

    queryBuilder.orderBy(sortField, sortOrder);

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
