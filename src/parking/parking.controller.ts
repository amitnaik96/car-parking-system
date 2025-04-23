import { Controller, Body, Post, Patch, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody} from '@nestjs/swagger';

@ApiTags('Parking Lot') 
@Controller()
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

    @Post('parking_lot')
    @ApiOperation({ summary: 'Initialize the parking lot'})
    @ApiResponse({status: 201, description: 'Parking lot initialized'})
    @ApiResponse({ status: 400, description: 'Parking lot is already initialized'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                no_of_slot: { type: 'number'}
            },
            required: ['no_of_slot']
        }
    })
    initialize(@Body('no_of_slot') noOfSlots: number) {
        try {
            return this.parkingService.initializeParkingLot(noOfSlots); 
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    @Patch('parking_lot')
    expand(@Body('increment_slot') increment: number) {
        try {
            return this.parkingService.expandParkingLot(increment);

        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('park') 
    park(@Body() body: { car_reg_no: string; car_color: string}) {
            
        try {
            const { car_reg_no, car_color} = body;
            return this.parkingService.allocateParkingSlot(car_reg_no, car_color);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('registration_numbers/:color')
    getRegistrationNumbers(@Param('color') color: string) {
        try {
            return this.parkingService.getRegistrationNumbersByColor(color);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('slot_numbers/:color') 
    getSlotNumbers(@Param('color') color: string) {
        try {
            return this.parkingService.getSlotNumbersByColor(color);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('clear')
    clearSlot(@Body() body: { slot_number?: number; car_registration_no?: string}) {
        try {
            if(body.slot_number) {
                return this.parkingService.clearSlotBySlotNumber(body.slot_number);
            }
            else if (body.car_registration_no) {
                return this.parkingService.clearSlotByRegNo(body.car_registration_no);
            }
            else throw new Error('Invalid request: Must provide slot_number or car_registration_no');
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('/status')
    getStatus() {
        return this.parkingService.getParkingStatus();
    }

    @Get('/slot')
    getSlot(@Body('registration_number') regNo: string) {
        try {
            return this.parkingService.getSlotNumberByRegNo(regNo);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,  
                    error: err.message, 
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}


