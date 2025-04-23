import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ParkingService } from './parking.service';

@Controller('parking_lot')
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {};

    @Post()
    initialize(@Body('no_of_slot') noOfSlots: number) {
        return this.parkingService.initializeParkingLot(noOfSlots);
    }

    @Patch()
    expand(@Body('increment_slot') increment: number) {
        return this.parkingService.expandParkingLot(increment);
    } 
}
