import { IsNotEmpty, IsString } from 'class-validator';

export class MidtransNotifyDto {
  @IsString()
  @IsNotEmpty()
  readonly status_code: string;

  @IsString()
  @IsNotEmpty()
  readonly gross_amount: string;

  @IsString()
  @IsNotEmpty()
  readonly signature_key: string;

  @IsString()
  @IsNotEmpty()
  readonly order_id: string;

  @IsString()
  @IsNotEmpty()
  readonly fraud_status: string;

  @IsString()
  @IsNotEmpty()
  readonly transaction_status: string;
}
