import { Controller, Body, Post, Patch, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam} from '@nestjs/swagger';

@ApiTags('Parking Lot') 
@Controller()
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

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
    @Post('parking_lot')
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


    @ApiOperation({summary: 'Increase the no of parking slots'})
    @ApiResponse({status: 201, description: 'Parking lot incremented'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                increment_slot: { type: 'number'}
            },
            required: ['increment_slot']
        }
    })
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



    @ApiOperation({summary: 'Allocating parking slot to a car'})
    @ApiResponse({status: 201, description: 'Parking slot alloted'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                car_reg_no: {type: 'string', example: 'KA123'},
                car_color: { type: 'string', example: 'red'}
            },
            required: ['car_reg_no', 'car_color']
        }
    })
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


    @ApiOperation({summary: 'Get registration number of cars by color'})
    @ApiParam({ name: 'color', type: 'string'})
    @ApiResponse({status: 200, description: "Registration numbers", type: [String]})
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

    @ApiOperation({summary: 'Get slot number of cars by color'})
    @ApiParam({ name: 'color', type: 'string'})
    @ApiResponse({status: 200, description: "Slot numbers", type: [Number]})
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

    @ApiOperation({summary: 'Clear parking slot given regisration number or slot number'})
    @ApiResponse({status:200, description: 'Slot freed'})
    @ApiBody({
        schema : {
            type: 'object',
            properties: {
                'slot_number': {type: 'number'},
                'car_registration_number': {type: 'string'}
            }
        }
    })
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

    @ApiOperation({summary: 'Get parking slot status'})
    @ApiResponse({status: 200, description: 'Array containing car details in their respective slots'})
    @Get('/status')
    getStatus() {
        return this.parkingService.getParkingStatus();
    }

    @ApiOperation({ summary: 'Get parking slot by registration number'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                registration_number: { type: 'string'}
            },
            required: ['registration_number']
        }
    })
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


