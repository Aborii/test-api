import { Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('internal/customers')
export class InternalCustomerController {
  constructor(private readonly customerService: CustomerService) {}
}
