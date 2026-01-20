import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { PublicCustomer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // TODO: Need to revalidate cache of findAll
  // TODO: Send socket event customer.created
  // TODO: Ask what does this mean "Do not blindly accept sensitive fields"
  @Post()
  async create(
    @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
  ): Promise<PublicCustomer> {
    return this.customerService.create(createCustomerDto);
  }

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
