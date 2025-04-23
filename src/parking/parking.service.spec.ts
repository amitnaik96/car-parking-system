import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

    describe('initializeParkingLot', () => {
      it('should initialize the parking lot with no_of_slots', () => {
        const result = service.initializeParkingLot(5);
        expect(result).toEqual({ total_slot: 5 });
      });

      it('should throw Parking lot is already initialized', () => {
        service.initializeParkingLot(3);
        expect(() => service.initializeParkingLot(3)).toThrow('Parking lot is already initialized');
      });
    });

    describe('expandParkingLot', () => {
      it('should throw Parking lot is not initialized yet.', () => {
          expect(() => service.expandParkingLot(2)).toThrow('Parking lot is not initialized yet.');
      });

      it('should throw Cannot decrement parking slots', () => {
        service.initializeParkingLot(2);
        expect(() => service.expandParkingLot(-2)).toThrow('Cannot decrement parking slots');
      })  

      it('should expand the parking lot', () => {
        service.initializeParkingLot(2);
        const result = service.expandParkingLot(3);
        expect(result).toEqual({total_slot: 5});
      });
    });


    describe('allocateParkingSlot', () => {
      it('should allocate a parking lot for a car', () => {
        service.initializeParkingLot(2);
        const response = service.allocateParkingSlot('KA123', 'red');
        expect(response.allocated_slot_number).toBe(1);
      })

      it('should throw error when parking lot is full', () => {
        service.initializeParkingLot(1);
        service.allocateParkingSlot('KA123', 'red');
        expect(() => service.allocateParkingSlot('KA123', 'red')).toThrow('Parking lot is full. You have been added to waitlist');
      })
    });


    describe('getRegistrationNumbersByColor', () => {
      it('should throw No cars with color red found', () => {
        service.initializeParkingLot(2);
        expect(() => service.getRegistrationNumbersByColor('red')).toThrow('No cars with color red found');
      });

      it('should return registration numbers for a given color', () => {
        service.initializeParkingLot(2);
        service.allocateParkingSlot('KA122', 'red');
        service.allocateParkingSlot('KA123', 'red');
        const regNos = service.getRegistrationNumbersByColor('red');
        expect(regNos).toEqual(['KA122', 'KA123']);
      });
    });
    
    describe('getSlotNumbersByColor', () => {
      it('should throw No cars with color red found', () => {
        service.initializeParkingLot(1); 
        expect(() => service.getRegistrationNumbersByColor('red')).toThrow('No cars with color red found');
      });

      it('should return registration numbers for a given color', () => {
        service.initializeParkingLot(2);
        service.allocateParkingSlot('KA122', 'red');
        service.allocateParkingSlot('KA123', 'red');
        const regNos = service.getSlotNumbersByColor('red');
        expect(regNos).toEqual([1, 2]);
      });
    });

    describe('clearSlotBySlotNumber', () => {
      it('should free the slot and return the freed slot number', () => {
        service.initializeParkingLot(2);
        service.allocateParkingSlot('KA122', 'red');
        service.allocateParkingSlot('KA123', 'blue');
        const freedSlot = service.clearSlotBySlotNumber(1);
        expect(freedSlot).toEqual({freed_slot_number: 1});
      });

      it('should throw Slot already free', () => {
        service.initializeParkingLot(1);
        expect(() => service.clearSlotBySlotNumber(1)).toThrow('Slot already free');
      });
    });


    describe('clearSlotByRegNo', () => {
      it('should free the slot and return the freed slot number', () => {
        service.initializeParkingLot(2);
        service.allocateParkingSlot('KA122', 'red');
        service.allocateParkingSlot('KA123', 'blue');
        const freedSlot = service.clearSlotByRegNo('KA122');
        expect(freedSlot).toEqual({freed_slot_number: 1});
      });
      
      it('should throw Car not found', () => {
        service.initializeParkingLot(2);
        expect(() => service.clearSlotByRegNo('KA122')).toThrow('Car not found')
      });
    });

    describe('getParkingStatus', () => {
      it('should return parking status with slot details for occupied slots', () => {
        service.initializeParkingLot(3);
        service.allocateParkingSlot('KA122', 'red');
        service.allocateParkingSlot('KA123', 'black');
        service.allocateParkingSlot('KA124', 'white');

        service.clearSlotBySlotNumber(2);
        const status = service.getParkingStatus();

        expect(status).toEqual([
          { slot_no: 1, registration_no: 'KA122', color: 'red' },
          { slot_no: 3, registration_no: 'KA124', color: 'white' }
        ]);
      });

      it('should return an empty array when all slots are free', () => {
        const status = service.getParkingStatus();
        
        expect(status).toEqual([]);
      });
    });

    describe('getSlotNumberByRegNo', () => {
      it('should return the slot number given registration no.', () => {
        service.initializeParkingLot(1);
        service.allocateParkingSlot('KA123', 'red');
        const res = service.getSlotNumberByRegNo('KA123');
        expect(res.slot_number).toBe(1);
      })

      it('should throw Car with this registration number KA123 is not parked', () => {
        service.initializeParkingLot(1);
        expect(() => service.getSlotNumberByRegNo('KA123')).toThrow('Car with this registration number KA123 is not parked');
      })
    });


    // This test case tests most of services + waitlist logic
    describe('Waitlist', () => {
      it('should show KA33 at slot one after being at waitlist', () => {
        service.initializeParkingLot(2);
        service.allocateParkingSlot('KA11', 'grey');
        service.allocateParkingSlot('KA22', 'black');
        expect(() => service.allocateParkingSlot('KA33', 'black')).toThrow('Parking lot is full. You have been added to waitlist');

        service.clearSlotBySlotNumber(1);
        // now KA33 should have been alloted;
        const res = service.getSlotNumberByRegNo('KA33');
        expect(res.slot_number).toBe(1);
      }); 
    });
});
