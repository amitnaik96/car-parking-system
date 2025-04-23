import { Injectable } from '@nestjs/common';

interface Car {
    regNo: string;
    color: string;
}

@Injectable()
export class ParkingService {
    private slots: (Car | null)[] = [];
    private colorToRegSlot = new Map<string, Set<{regNo: string, slot: string}>>();

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
}
