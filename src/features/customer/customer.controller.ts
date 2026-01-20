import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Param,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import { PublicCustomer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

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

  // TODO: Need to revalidate cache of findAll, findById
  // TODO: Send socket event customer.updated
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCustomerDto: UpdateCustomerDto,
  ): Promise<PublicCustomer> {
    try {
      return await this.customerService.update(id, updateCustomerDto);
    } catch (error) {
      if (!(error instanceof Error)) {
        console.error('Error updating customer:', error);
        throw error;
      }
      if (error.message === 'customer_not_found')
        throw new NotFoundException('Customer not found');

      console.error('Error updating customer:', error);
      throw error;
    }
  }
}
