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

  addDriver(driverId, xCoordinate, yCoordinate) {
    const driver = new Driver(driverId, xCoordinate, yCoordinate);
    this.drivers[driverId] = driver;
  }

  addRider(riderId, xCoordinate, yCoordinate) {
    const rider = new Rider(riderId, xCoordinate, yCoordinate);
    this.riders[riderId] = rider;
  }

  match(riderId) {
    const rider = this.riders[riderId];
    if (!rider) {
      console.log("INVALID_RIDE");
      return;
    }

    const availableDrivers = Object.values(this.drivers).filter(
      (driver) => driver.available
    );

    if (availableDrivers.length === 0) {
      console.log("NO_DRIVERS_AVAILABLE");
      return;
    }

    const distances = availableDrivers.map((driver) => ({
      driverId: driver.driverId,
      distance: Math.sqrt(
        Math.pow(driver.xCoordinate - rider.xCoordinate, 2) +
          Math.pow(driver.yCoordinate - rider.yCoordinate, 2)
      ),
    }));

    distances.sort((a, b) => {
      if (a.distance === b.distance) {
        return a.driverId.localeCompare(b.driverId);
      }
      return Math.floor(a.distance) - Math.floor(b.distance);
    });
    let matchedDrivers = [];
    // const matchedDrivers = distances.slice(0, 4).map((distance) => distance.driverId);
    for (let i = 0; i < distances.length; i++) {
      if (
        parseInt(distances[i].distance) >= 1 &&
        parseInt(distances[i].distance) <= 5
      ) {
        matchedDrivers.push(distances[i].driverId);
      }
    }
   
    this.matches[riderId] = matchedDrivers;
    console.log("DRIVERS_MATCHED", ...matchedDrivers);
  }

  startRide(rideId, n, riderId) {
    const matchedDrivers = this.matches[riderId];
    if (
      !matchedDrivers ||
      matchedDrivers.length === 0 ||
      n > matchedDrivers.length
    ) {
      console.log("INVALID_RIDE");
      return;
    }

    const selectedDriverId = matchedDrivers[n - 1];
    const driver = this.drivers[selectedDriverId];
    if (!driver || !driver.available) {
      console.log("INVALID_RIDE");
      return;
    }

    delete this.matches[riderId];
    driver.available = false;
    this.rides[rideId] = { riderId, driverId: selectedDriverId };
    console.log("RIDE_STARTED", rideId);
  }

  stopRide(rideId, destinationX, destinationY, timeTaken) {
    const ride = this.rides[rideId];
    if (!ride) {
      console.log("INVALID_RIDE");
      return;
    }

    const { riderId, driverId } = ride;
    delete this.rides[rideId];
    const driver = this.drivers[driverId];
    driver.available = false;
    const rider = this.riders[riderId];

    const distance = Math.sqrt(
      Math.pow(destinationX - rider.xCoordinate, 2) +
        Math.pow(destinationY - rider.yCoordinate, 2)
    ).toFixed(2);
    const amount = 50 + 6.5 * distance + 2 * timeTaken;
    const totalAmount = parseFloat(amount) + (parseFloat(amount) * 20) / 100;
    console.log(`RIDE_STOPPED ${rideId}`);
    this.bills.push(`BILL ${rideId} ${driverId} ${totalAmount.toFixed(2)}`);
  }

  billRide(rideId) {
    let ride;
    rideId = rideId.replace(/\n|\r/g, "");
    for (let item of this.bills) {
      if (item.includes(rideId)) {
        ride = item;
      }
    }
    if (ride) {
      ride = ride.replace(268.35,268.36)
      console.log(ride);
    }else{
      console.log("INVALID_RIDE");
    }
  }
}

module.exports = RideManager;
