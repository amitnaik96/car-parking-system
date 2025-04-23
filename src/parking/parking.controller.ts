import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ParkingService } from './parking.service';

@Controller()
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {};

    @Post('parking_lot')
    initialize(@Body('no_of_slot') noOfSlots: number) {
        return this.parkingService.initializeParkingLot(noOfSlots);
    }

    @Patch('parking_lot')
    expand(@Body('increment_slot') increment: number) {
        return this.parkingService.expandParkingLot(increment);
    } 

    @Post('park') 
    park(@Body() body: { car_reg_no: string; car_color: string}) {
        const { car_reg_no, car_color} = body;
        return this.parkingService.allocateParkingSlot(car_reg_no, car_color);
    }
}
