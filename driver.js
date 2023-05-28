// register driver
class Driver {
  constructor(driverId, xCoordinate, yCoordinate) {
    this.driverId = driverId;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.available = true;
  }
}

module.exports = Driver;
