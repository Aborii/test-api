import { IsString, IsEmail, IsOptional } from 'class-validator';

// This could be a PartialType of CreateCustomerDto, but defined explicitly for simplicity
export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
