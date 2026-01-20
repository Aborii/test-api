import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { InternalEndpointGuard } from '../../guards/internal-endpoint.guard';

@Controller('internal/customers')
@UseGuards(InternalEndpointGuard)
export class InternalCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // TODO: Need to be cached
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer | null> {
    return this.customerService.findOneInternal(id);
  }
}
