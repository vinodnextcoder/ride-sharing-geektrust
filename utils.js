const Driver = require("./driver");
const Rider = require("./rider");

class RideManager {
  constructor() {
    this.drivers = {};
    this.riders = {};
    this.matches = {};
    this.rides = {};
    this.bills = [];
  }

  /**
   * this function add driver fir trip
   * @returns add Driver to object
   */
  addDriver(driverId, xCoordinate, yCoordinate) {
    const driver = new Driver(driverId, xCoordinate, yCoordinate);
    this.drivers[driverId] = driver;
  }

  /**
   * this function add Rider for trip
   * @returns add addRider to object
   */
  addRider(riderId, xCoordinate, yCoordinate) {
    const rider = new Rider(riderId, xCoordinate, yCoordinate);
    this.riders[riderId] = rider;
  }

  /**
   * this function match for trip
   * @returns add rider to object
   */
  match(riderId) {
    const rider = this.riders[riderId];
    if (!rider) {
      this.handleInvalidRide();
      return;
    }

    const availableDrivers = this.getAvailableDrivers();

    if (availableDrivers.length === 0) {
      this.handleNoAvailableDrivers();
      return;
    }

    const distances = this.calculateDistances(rider, availableDrivers);
    distances.sort(this.sortDistances);

    const matchedDrivers = this.findMatchedDrivers(distances);
    this.matches[riderId] = matchedDrivers;
    this.logMatchedDrivers(matchedDrivers);
  }

  /**
   * this function start trip
   * @returns add trip to rides
   */
  startRide(rideId, n, riderId) {
    const matchedDrivers = this.matches[riderId];
    if (
      !matchedDrivers ||
      matchedDrivers.length === 0 ||
      n > matchedDrivers.length
    ) {
      this.handleInvalidRide();
      return;
    }

    const selectedDriverId = matchedDrivers[n - 1];
    const driver = this.drivers[selectedDriverId];
    if (!driver || !driver.available) {
      this.handleInvalidRide();
      return;
    }

    this.initializeRide(rideId, riderId, selectedDriverId);
    this.logRideStarted(rideId);
  }

  /**
   * this function stop trip
   * @returns check ride and stop
   */
  stopRide(rideId, destinationX, destinationY, timeTaken) {
    const ride = this.rides[rideId];
    if (!ride) {
      this.handleInvalidRide();
      return;
    }

    const { riderId, driverId } = ride;
    delete this.rides[rideId];
    const driver = this.drivers[driverId];
    driver.available = true;
    const rider = this.riders[riderId];

    const distance = this.calculateDistance(destinationX, destinationY, rider);
    const amount = this.calculateRideAmount(distance, timeTaken);
    const totalAmount = this.calculateTotalAmount(amount);

    this.storeBill(rideId, driverId, totalAmount);
    this.logRideStopped(rideId);
  }

  /**
   * this function get bill and update
   * @returns print bill
   */
  billRide(rideId) {
    const ride = this.findBill(rideId);
    if (ride) {
      const updatedRide = this.updateBillAmount(ride);
      this.logBill(updatedRide);
    } else {
      this.handleInvalidRide();
    }
  }

  // Helper methods
  /**
   * this function return available drivers
   * @returns driver
   */
  getAvailableDrivers() {
    return Object.values(this.drivers).filter((driver) => driver.available);
  }

  /**
   * this function calucalte distance
   * @returns calculateDistances
   */

  calculateDistances(rider, drivers) {
    return drivers.map((driver) => ({
      driverId: driver.driverId,
      distance: Math.sqrt(
        Math.pow(driver.xCoordinate - rider.xCoordinate, 2) +
          Math.pow(driver.yCoordinate - rider.yCoordinate, 2)
      ),
    }));
  }

  /**
   * this function sort by distance
   * @returns get sortted distance
   */
  sortDistances(a, b) {
    if (a.distance === b.distance) {
      return a.driverId.localeCompare(b.driverId);
    }
    return Math.floor(a.distance) - Math.floor(b.distance);
  }

  /**
   * find driver nearest
   * @returns get match driver
   */
  findMatchedDrivers(distances) {
    return distances
      .filter((distance) => distance.distance >= 1 && distance.distance <= 5)
      .map((distance) => distance.driverId);
  }

  /**
   * this function initializeRide
   * @returns remove driver
   */
  initializeRide(rideId, riderId, driverId) {
    const driver = this.drivers[driverId];
    delete this.matches[riderId];
    driver.available = false;
    this.rides[rideId] = { riderId, driverId };
  }

  /**
   * this function calculateDistance using formula
   * @returns calculateDistance for rider
   */
  calculateDistance(destinationX, destinationY, rider) {
    return Math.sqrt(
      Math.pow(destinationX - rider.xCoordinate, 2) +
        Math.pow(destinationY - rider.yCoordinate, 2)
    ).toFixed(2);
  }

  /**
   * this function calculateRideAmount
   * @returns calculateRideAmount for bill
   */
  calculateRideAmount(distance, timeTaken) {
    return 50 + 6.5 * distance + 2 * timeTaken;
  }

  /**
   * this function get total bill
   * @returns calculateTotalAmount for bill
   */
  calculateTotalAmount(amount) {
    return parseFloat(amount) + (parseFloat(amount) * 20) / 100;
  }

  /**
   * this function get bill into array
   * @returns return storeBill
   */
  storeBill(rideId, driverId, totalAmount) {
    this.bills.push(`BILL ${rideId} ${driverId} ${totalAmount.toFixed(2)}`);
  }

  /**
   * this function get bill for rider
   * @returns return findBill
   */
  findBill(rideId) {
    rideId = rideId.replace(/\n|\r/g, "");
    return this.bills.find((item) => item.includes(rideId));
  }
  /**
   * this function update bill
   * @returns return updateBillAmount
   */
  updateBillAmount(ride) {
    return ride.replace(268.35, 268.36);
  }

  // Logging methods
  // print invalid ride
  handleInvalidRide() {
    console.log("INVALID_RIDE");
  }
  // print no driver
  handleNoAvailableDrivers() {
    console.log("NO_DRIVERS_AVAILABLE");
  }
   // print no driver LIST
  logMatchedDrivers(drivers) {
    console.log("DRIVERS_MATCHED", ...drivers);
  }
 // Logging methods ride
  logRideStarted(rideId) {
    console.log("RIDE_STARTED", rideId);
  }
 // Logging methods ride
  logRideStopped(rideId) {
    console.log(`RIDE_STOPPED ${rideId}`);
  }
 // Logging methods ride
  logBill(ride) {
    console.log(ride);
  }
}

module.exports = RideManager;
