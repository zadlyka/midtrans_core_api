import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.orderRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      filterableColumns: {
        name: [FilterOperator.EQ],
      },
    });
  }

  findOne(id: string) {
    return this.orderRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    this.orderRepository.update(id, {
      ...order,
      ...updateOrderDto,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    this.orderRepository.remove(order);
    return;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    this.orderRepository.update(id, {
      ...order,
      status,
    });
    return this.findOne(id);
  }
}
