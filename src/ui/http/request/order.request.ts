import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  amount: string;
}
