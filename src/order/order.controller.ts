import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, RequiredPermission } from '../auth/auth.guard';
import { Permission } from '../role/enums/permission.enum';
import { MidtransService } from './midtrans.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly midtransService: MidtransService,
  ) {}

  @Post()
  @RequiredPermission(Permission.CreateOrder)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @RequiredPermission(Permission.ReadOrder)
  findAll(@Paginate() query: PaginateQuery) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @RequiredPermission(Permission.ReadOrder)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermission(Permission.UpdateOrder)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @RequiredPermission(Permission.DeleteOrder)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Post('midtrans')
  @RequiredPermission(Permission.CreateOrder)
  createMidtrans(@Body() createOrderDto: CreateOrderDto) {
    return this.midtransService.create(createOrderDto);
  }

  @Post('midtrans/notify')
  @Public()
  notifyMidtrans(@Body() body) {
    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      fraud_status,
      signature_key,
    } = body;

    return this.midtransService.notify({
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      fraud_status,
      signature_key,
    });
  }
}
