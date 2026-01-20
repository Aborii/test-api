import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SortOrder } from '../../../common/dto/sorting.dto';

export enum CustomerSortField {
  FULL_NAME = 'fullName',
  CREATED_AT = 'createdAt',
}

export class QueryCustomerDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsEnum(CustomerSortField)
  sortBy?: CustomerSortField = CustomerSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
