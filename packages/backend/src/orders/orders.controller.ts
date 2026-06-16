import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { FuelOrder, FuelReferencePrice, OrderStatus } from './order.types';

@Controller()
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get('reference')
  getReference(): FuelReferencePrice[] {
    return this.orders.getReference();
  }

  @Get('orders')
  findAll(@Query('status') status?: OrderStatus): FuelOrder[] {
    return this.orders.findAll(status);
  }

  @Get('orders/:id')
  findOne(@Param('id', ParseIntPipe) id: number): FuelOrder {
    return this.orders.findOne(id);
  }

  @Post('orders')
  create(@Body() dto: CreateOrderDto): FuelOrder {
    return this.orders.create(dto);
  }
}
