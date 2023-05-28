const RideManager = require("./utils");
const fs = require('fs')
class Vehicle {
  constructor() {
    this.rideManager = new RideManager();
  }

  main(dataInput) {
    const inputLines = dataInput.toString().split("\n").filter((s) => s.replace(/\s+/g, "").length !== 0);

    for (let i = 0; i < inputLines.length; i++) {
      const input = inputLines[i].split(" ");
      const [command, ...args] = input;

      switch (command) {
        case "ADD_DRIVER":
          this.rideManager.addDriver(args[0], parseInt(args[1]), parseInt(args[2]));
          break;
        case "ADD_RIDER":
          this.rideManager.addRider(args[0], parseInt(args[1]), parseInt(args[2]));
          break;
        case "MATCH":
          this.rideManager.match(args[0].trim());
          break;
        case "START_RIDE":
          this.rideManager.startRide(args[0], args[1], args[2].trim());
          break;
        case "STOP_RIDE":
          this.rideManager.stopRide(args[0], args[1], args[2], parseInt(args[3].trim()));
          break;
        case "BILL":
          this.rideManager.billRide(args[0]);
          break;
      }
    }
  }
}

const vehicle = new Vehicle();
const filename = process.argv[2];
const data = fs.readFileSync(filename).toString();
vehicle.main(data);