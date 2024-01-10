import * as crypto from 'crypto';
import * as midtransClient from 'midtrans-client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { MidtransNotifyDto } from './dto/midtrans-notify.dto';
import { OrderStatus } from './enums/order-status.enum';
@Injectable()
export class MidtransService {
  credentials: any;
  core: any;

  constructor(
    private orderService: OrderService,
    private configService: ConfigService,
  ) {
    this.credentials = this.configService.get('gateway.midtrans');
    this.core = new midtransClient.CoreApi({
      isProduction: this.credentials.isProduction,
      serverKey: this.credentials.serverKey,
      clientKey: this.credentials.clientKey,
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    let response = null;

    if (order) {
      try {
        const parameter = {
          payment_type: 'bank_transfer',
          transaction_details: {
            gross_amount: order.amount,
            order_id: order.id,
          },
          bank_transfer: {
            bank: order.paymentType,
          },
        };

        response = this.core
          .charge(parameter)
          .then((chargeResponse) => {
            return chargeResponse;
          })
          .catch(() => {
            throw new BadRequestException();
          });
      } catch (error) {}
    }

    return response;
  }

  notify(midtransNotifyDto: MidtransNotifyDto) {
    const { order_id, transaction_status, fraud_status } = midtransNotifyDto;

    const isVerify = this.validateSignatureKey(midtransNotifyDto);
    if (!isVerify) throw new BadRequestException();

    let status = null;

    if (transaction_status == 'capture') {
      if (fraud_status == 'accept') {
        status = OrderStatus.Successful;
      }
    } else if (transaction_status == 'settlement') {
      status = OrderStatus.Successful;
    } else if (
      transaction_status == 'cancel' ||
      transaction_status == 'deny' ||
      transaction_status == 'expire'
    ) {
      status = OrderStatus.Failed;
    } else if (transaction_status == 'pending') {
      status = OrderStatus.Pending;
    }

    return this.orderService.updateStatus(order_id, status);
  }

  private validateSignatureKey(midtransNotifyDto: MidtransNotifyDto) {
    const { order_id, status_code, gross_amount, signature_key } =
      midtransNotifyDto;
    const serverKey = this.credentials.serverKey;
    const key = order_id + status_code + gross_amount + serverKey;

    const result = crypto.createHash('sha512').update(key).digest();
    if (signature_key === result.toString('hex')) {
      return true;
    }
    return false;
  }
}
