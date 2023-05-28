const { expect } = require('chai');
const RideManager = require('../utils');

describe('RideManager', () => {
  let rideManager;

  beforeEach(() => {
    rideManager = new RideManager();
  });

  describe('addDriver', () => {
    it('should add a driver to the drivers list', () => {
      rideManager.addDriver('D1', 10, 20);
    });
  });

  describe('addRider', () => {
    it('should add a rider to the riders list', () => {
      rideManager.addRider('R1', 30, 40);
      
    });
  });

  describe('match', () => {
    it('should match a rider with available drivers', () => {
      rideManager.addDriver('D1', 10, 20);
      rideManager.addDriver('D2', 30, 40);
      rideManager.addRider('R1', 50, 60);
  
      rideManager.match('R1');
    
    });

    it('should handle invalid rider id', () => {
      rideManager.match('R1');
      
    });

    it('should handle no available drivers', () => {
      rideManager.addRider('R1', 50, 60);
      rideManager.match('R1');
    });
  });

  describe('startRide', () => {
    it('should start a ride with a selected driver', () => {
      rideManager.addDriver('D1', 10, 20);
      rideManager.addRider('R1', 30, 40);
      rideManager.match('R1');
      rideManager.startRide('RIDE1', 1, 'R1');
    });

    it('should handle invalid ride or driver', () => {
      rideManager.addDriver('D1', 10, 20);
      rideManager.addRider('R1', 30, 40);
      rideManager.match('R1');
      rideManager.startRide('RIDE1', 2, 'R1');
    });
  });

  describe('stopRide', () => {
    it('should stop a ride and generate a bill', () => {
      rideManager.addDriver('D1', 10, 20);
      rideManager.addRider('R1', 30, 40);
      rideManager.match('R1');
      rideManager.startRide('RIDE1', 1, 'R1');
      rideManager.stopRide('RIDE1', 50, 60, 10);
    });

    it('should handle invalid ride or driver', () => {
      rideManager.addDriver('D1', 10, 20);
      rideManager.addRider('R1', 30, 40);
      rideManager.match('R1');
      rideManager.startRide('RIDE1', 1, 'R1');
      rideManager.stopRide('RIDE2', 50, 60, 10);
    });


    it('should start a ride with a selected driver 2', () => {
      
      rideManager.addRider('R1', 2, 7);
      rideManager.match('R1');
      rideManager.addDriver('D1', 3, 1);
      rideManager.addDriver('D2', 5, 6);
      rideManager.match('R1');
  
      rideManager.startRide('RIDE1', 1, 'R1');
      rideManager.stopRide('RIDE1', 4,15, 60);
      rideManager.billRide('RIDE1');
      expect(rideManager.riders.R1.riderId).equal('R1');
    });
  });
 

  describe('billRide', () => {
    it('should display the bill for a completed ride', () => {
      rideManager.addDriver('D1', 10, 20);
      rideManager.addRider('R1', 30, 40);
      rideManager.match('R1');
      rideManager.startRide('RIDE1', 1, 'R1');
      rideManager.stopRide('RIDE1', 50, 60, 10);
      expect(rideManager.riders.R1.riderId).equal('R1');
  
    });

    it('should handle invalid ride id', () => {
      const bill = rideManager.billRide('RIDE1');
      expect(bill).to.be.undefined;
    });

    it('should display the bill for a completed ride inv', () => {
      
      rideManager.addRider('R1', 0, 0);
      rideManager.match('R1');
      rideManager.startRide('RIDE1', 2, 'R1');
      rideManager.stopRide('RIDE1', 4, 5, 32);
      rideManager.billRide('RIDE1');
      console.log(rideManager.riders.R1.riderId)
      expect(rideManager.riders.R1.riderId).equal('R1');
    });

  });
});
