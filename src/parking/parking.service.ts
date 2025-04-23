import { Injectable } from '@nestjs/common';

interface Car {
    regNo: string;
    color: string;
}

@Injectable()
export class ParkingService {
    private slots: (Car | null)[] = [];
    private colorToRegSlot = new Map<string, Set<{regNo: string, slot: number}>>();

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
        const availableSlotIndex = this.slots.findIndex(slot => slot === null);

        if (availableSlotIndex === -1) {
            throw new Error('Parking lot is full. You have been added to waitlist');
        }

        const allocatedSlotNumber = availableSlotIndex + 1;
        const newCar: Car = { regNo: carRegNo, color: carColor};
        this.slots[availableSlotIndex] = newCar;

        if(!this.colorToRegSlot.has(carColor)) {
            this.colorToRegSlot.set(carColor, new Set());
        }
        this.colorToRegSlot.get(carColor)?.add({regNo: carRegNo, slot: allocatedSlotNumber});

        return { allocated_slot_number : allocatedSlotNumber};
    }
}
