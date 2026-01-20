import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerSortField, QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { SortOrder } from '../../common/dto/sorting.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(
    queryDto: QueryCustomerDto,
  ): Promise<PaginatedResponse<Customer>> {
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
}
