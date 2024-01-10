import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentType } from '../enums/payment-type.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column({ type: 'varchar', length: 16, default: OrderStatus.Pending })
  status?: OrderStatus;

  @Column({ type: 'varchar', length: 16 })
  paymentType: PaymentType;
}
