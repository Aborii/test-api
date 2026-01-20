import { Controller, Get, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { PublicCustomer } from './entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // TODO: Need to be cached
  @Get()
  async findAll(
    @Query() queryDto: QueryCustomerDto,
  ): Promise<PaginatedResponse<PublicCustomer>> {
    return this.customerService.findAll(queryDto);
  }

  // TODO: Need to be cached
  @Get(':id')
  async findOne(@Query('id') id: string): Promise<PublicCustomer | null> {
    return this.customerService.findOne(id);
  }
}
