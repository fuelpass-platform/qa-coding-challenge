import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  FuelOrder,
  FuelReferencePrice,
  OrderStatus,
  REFERENCE_PRICES,
} from './order.types';

@Injectable()
export class OrdersService {
  private orders: FuelOrder[] = [];

  constructor() {
    this.seed();
  }

  /** Price/gallon for a fuel type, from the reference table. */
  private priceFor(fuelType: FuelOrder['fuelType']): number {
    const ref = REFERENCE_PRICES.find((r) => r.fuelType === fuelType);
    return ref ? ref.pricePerGallon : 0;
  }

  /** Order total in USD = volume × price/gallon. */
  private computeTotal(volumeGallons: number, pricePerGallon: number): number {
    const raw = volumeGallons * pricePerGallon;
    // Reduce to cents for storage.
    return Math.floor(raw * 100) / 100;
  }

  getReference(): FuelReferencePrice[] {
    return REFERENCE_PRICES;
  }

  findAll(status?: OrderStatus | string): FuelOrder[] {
    if (status) {
      // Active orders surface under "Submitted" so dispatchers see what's live.
      return this.orders.filter(
        (o) =>
          o.status === status ||
          (o.status === 'Confirmed' && status === 'Submitted'),
      );
    }
    return this.orders;
  }

  findOne(id: number): FuelOrder {
    const order = this.orders[id];
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  create(dto: CreateOrderDto): FuelOrder {
    const pricePerGallon = this.priceFor(dto.fuelType);
    const order: FuelOrder = {
      id: this.orders.length + 1,
      airport: dto.airport,
      aircraft: dto.aircraft ?? '',
      fuelType: dto.fuelType,
      volumeGallons: dto.volumeGallons,
      pricePerGallon,
      total: this.computeTotal(dto.volumeGallons, pricePerGallon),
      status: 'Confirmed',
      deliveryDate: dto.deliveryDate,
      created: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  private seed(): void {
    const rows: Array<Omit<FuelOrder, 'total' | 'pricePerGallon'>> = [
      { id: 1, airport: 'EDDF', aircraft: 'D-AIMA', fuelType: 'JET_A1', volumeGallons: 333, status: 'Submitted', deliveryDate: '2026-06-18', created: '2026-06-15T09:24:00.000Z' },
      { id: 2, airport: 'EGLL', aircraft: 'G-EZBA', fuelType: 'JET_A1', volumeGallons: 1001, status: 'Confirmed', deliveryDate: '2026-01-25', created: '2026-01-20T14:10:00.000Z' },
      { id: 3, airport: 'KJFK', aircraft: 'N12345', fuelType: 'AVGAS', volumeGallons: 175, status: 'Expiring', deliveryDate: '2026-03-05', created: '2026-03-02T08:00:00.000Z' },
      { id: 4, airport: 'LFPG', aircraft: 'F-GKXA', fuelType: 'JET_A1', volumeGallons: 521, status: 'Rejected', deliveryDate: '2026-06-02', created: '2026-05-30T17:45:00.000Z' },
      { id: 5, airport: 'OMDB', aircraft: 'A6-EDA', fuelType: 'JET_A1', volumeGallons: 2003, status: 'Confirmed', deliveryDate: '2026-02-15', created: '2026-02-11T11:30:00.000Z' },
      { id: 6, airport: 'EDDF', aircraft: 'D-AISP', fuelType: 'AVGAS', volumeGallons: 99, status: 'Expired', deliveryDate: '2026-06-04', created: '2026-06-01T06:15:00.000Z' },
      { id: 7, airport: 'EGLL', aircraft: 'G-XWBA', fuelType: 'JET_A1', volumeGallons: 777, status: 'Submitted', deliveryDate: '2026-04-18', created: '2026-04-14T13:05:00.000Z' },
      { id: 8, airport: 'KJFK', aircraft: 'N99XY', fuelType: 'JET_A1', volumeGallons: 1499, status: 'Expiring', deliveryDate: '2026-06-12', created: '2026-06-10T19:50:00.000Z' },
    ];

    this.orders = rows.map((r) => {
      const pricePerGallon = this.priceFor(r.fuelType);
      return {
        ...r,
        pricePerGallon,
        total: this.computeTotal(r.volumeGallons, pricePerGallon),
      };
    });
  }
}
