import {
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FuelType } from '../order.types';

export class CreateOrderDto {
  @IsString()
  airport!: string;

  // NOTE: aircraft tail number — see validation rules.
  @IsOptional()
  @IsString()
  aircraft?: string;

  @IsIn(['JET_A1', 'AVGAS'])
  fuelType!: FuelType;

  // NOTE: requested fuel volume in US gallons.
  @IsNumber()
  volumeGallons!: number;

  @IsISO8601()
  deliveryDate!: string;
}
