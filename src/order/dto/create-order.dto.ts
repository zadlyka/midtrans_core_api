import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentType } from '../enums/payment-type.enum';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsEnum(PaymentType)
  @IsNotEmpty()
  readonly paymentType: PaymentType;
}
