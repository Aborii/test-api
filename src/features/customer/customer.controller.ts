import { Controller, Get, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(
    @Query() queryDto: QueryCustomerDto,
  ): Promise<PaginatedResponse<Customer>> {
    return this.customerService.findAll(queryDto);
  }
}
