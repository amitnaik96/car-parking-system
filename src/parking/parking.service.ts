import { Injectable } from '@nestjs/common';

interface Car {
    regNo: string;
    color: string;
}

@Injectable()
export class ParkingService {
    private slots: (Car | null)[] = [];
    private regNoToSlot = new Map<string, number>();
    private colorToRegNos = new Map<string, Set<string>>();

    initializeParkingLot(noOfSlots: number) : {total_slot: number} {
        if(this.slots.length > 0) {
            throw new Error('Parking lot is already initialized');
        }

        this.slots = Array(noOfSlots).fill(null);
        return { total_slot: noOfSlots};
    }

    expandParkingLot(increment: number): {total_slot: number} {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }
        for (let i=0; i<increment; i++) {
            this.slots.push(null);
        }

        return { total_slot: this.slots.length}
    }

    allocateParkingSlot(carRegNo: string, carColor: string): { allocated_slot_number: number} {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }

        const availableSlotIndex = this.slots.findIndex(slot => slot === null);
        if (availableSlotIndex === -1) {
            throw new Error('Parking lot is full. You have been added to waitlist');
        }

        const allocatedSlotNumber = availableSlotIndex + 1;
        const newCar: Car = { regNo: carRegNo, color: carColor};
        this.slots[availableSlotIndex] = newCar;

        if(!this.colorToRegNos.has(carColor)) {
            this.colorToRegNos.set(carColor, new Set());
        }
        this.colorToRegNos.get(carColor)?.add(carRegNo);
        this.regNoToSlot.set(carRegNo, allocatedSlotNumber);

        console.log(this.slots);
        console.log(this.colorToRegNos);
        console.log(this.regNoToSlot)

        return { allocated_slot_number : allocatedSlotNumber};
    }
}
