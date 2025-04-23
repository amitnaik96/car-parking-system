import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';

@Module({
  providers: [ParkingService],
  controllers: [ParkingController]
})
export class ParkingModule {}
