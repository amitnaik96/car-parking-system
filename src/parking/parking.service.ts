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

    // extra feature: waitlist of cars if all slots are occupied
    private waitlist: Car[] = [];

    //O(n)
    initializeParkingLot(noOfSlots: number): {total_slot: number} {
        if(this.slots.length > 0) {
            throw new Error('Parking lot is already initialized');
        }

        this.slots = Array(noOfSlots).fill(null);
        return { total_slot: noOfSlots}
    }

    // O(k) -> k: increment
    expandParkingLot(increment: number) : { total_slot: number} {
        if (increment < 0) {
            throw new Error('Cannot decrement parking slots');
        }
        
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }
        for (let i=0; i<increment; i++) {
            this.slots.push(null);
        }

        return { total_slot: this.slots.length}
    }

    // O(n)
    allocateParkingSlot(carRegNo: string, carColor: string): { allocated_slot_number: number} {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }

        const availableSlotIndex = this.slots.findIndex(slot => slot === null);
        if (availableSlotIndex === -1) {
            this.waitlist.push({regNo: carRegNo, color: carColor});
            throw new Error('Parking lot is full. You have been added to waitlist');
        }

        const allocatedSlotNumber = availableSlotIndex + 1;
        const newCar: Car = { regNo: carRegNo, color: carColor.toLowerCase()};
        this.slots[availableSlotIndex] = newCar;

        if(!this.colorToRegNos.has(carColor)) {
            this.colorToRegNos.set(carColor, new Set());
        }
        this.colorToRegNos.get(carColor)?.add(carRegNo);
        this.regNoToSlot.set(carRegNo, allocatedSlotNumber);

        // console.log(this.slots);
        // console.log(this.colorToRegNos);
        // console.log(this.regNoToSlot)

        return { allocated_slot_number : allocatedSlotNumber};
    }

    // O(m) m:regNos set -> array 
    getRegistrationNumbersByColor(color: string): string[] {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }

        color = color.toLowerCase();
        const regNos = this.colorToRegNos.get(color);
        if(!regNos) {
            throw new Error(`No cars with color ${color} found`);
        }

        return Array.from(regNos);
    }

    // O(m) m: regNos
    getSlotNumbersByColor(color: string): number[] {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }

        color = color.toLowerCase();
        const regNos = this.colorToRegNos.get(color);
        if (!regNos) {
            throw new Error(`No cars with color ${color} found.`);
        }
        const slotNumbers: number[] = [];

        for(const regNo of regNos) {
            const slot = this.regNoToSlot.get(regNo);
            if(slot!==undefined) slotNumbers.push(slot);
        }

        return slotNumbers;
    }

    // O(1)
    clearSlotBySlotNumber(slotNumber: number): {freed_slot_number: number} {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }

        const car = this.slots[slotNumber-1];
        if(car === null) {
            throw new Error('Slot already free');
        }
        this.slots[slotNumber-1] = null;
        const regNos = this.colorToRegNos.get(car.color);
        if(regNos) {
            regNos.delete(car.regNo);
            if(regNos.size === 0) {
                this.colorToRegNos.delete(car.color);
            }
        }
        this.regNoToSlot.delete(car.regNo);

        // console.log(this.slots);
        // console.log(this.colorToRegNos);
        // console.log(this.regNoToSlot);

        // O(k) k: no of wainting cars
        if(this.waitlist.length > 0) {
            const car = this.waitlist.shift();
            if(car) {
                this.allocateParkingSlot(car.regNo, car.color);
            }
        }

        return { freed_slot_number: slotNumber};
    }

    // O(1)
    clearSlotByRegNo(regNo: string): {freed_slot_number: number} {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }

        const slotNumber = this.regNoToSlot.get(regNo);
        if ( slotNumber === undefined) {
            throw new Error('Car not found');
        }

        const car = this.slots[slotNumber-1];
        if(!car){ 
            throw new Error('Slot is already empty!');
        }
        this.slots[slotNumber-1] = null;

        const regNos = this.colorToRegNos.get(car.color);
        if (regNos) {
            regNos.delete(car.regNo);
            if(regNos.size === 0) {
                this.colorToRegNos.delete(car.color);
            }
        }
        this.regNoToSlot.delete(regNo);

        // console.log(this.slots);
        // console.log(this.colorToRegNos);
        // console.log(this.regNoToSlot)

        // O(k) k: no of wainting cars
        if(this.waitlist.length > 0) {
            const car = this.waitlist.shift();
            if(car) {
                this.allocateParkingSlot(car.regNo, car.color);
            }
        }

        return { freed_slot_number: slotNumber};
    }   

    // O(n)
    getParkingStatus() {

        return this.slots
            .map((car, index) => {
                if(car) {
                    return {
                        slot_no: index+1,
                        registration_no: car.regNo,
                        color: car.color
                    }
                };
                return null;
            })
            .filter(status => status !==  null);
    }

    getSlotNumberByRegNo(regNo: string): {slot_number: number} {
        if (this.slots.length === 0) {
            throw new Error('Parking lot is not initialized yet.');
        }
        
        const slotNumber = this.regNoToSlot.get(regNo);
        if(slotNumber === undefined) {
            throw new Error(`Car with this registration number ${regNo} is not parked`)
        }

        return { slot_number : slotNumber};
    }
}
