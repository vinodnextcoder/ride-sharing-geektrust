const fs = require("fs");
const RideManager = require('./utils');

// Defining class using es6
const rideManager = new RideManager();
class Vehicle {
  constructor(dataInput) {
    this.dataInput = dataInput;
  }
  main(dataInput) {
    var inputLines = dataInput.toString().split("\n");
    inputLines = inputLines.filter((s) => s.replace(/\s+/g, "").length !== 0);
    
    for (let i = 0; i < inputLines.length; i++) {
      if (inputLines) {
        let input = inputLines[i].split(" ");
        switch (input[0]) {
          case "ADD_DRIVER":
            rideManager.addDriver(input[1], parseInt(input[2]), parseInt(input[3]));
            break;
          case "ADD_RIDER":
            rideManager.addRider(input[1], parseInt(input[2]), parseInt(input[3]));
            break;
          case "MATCH":
            rideManager.match(input[1].trim());
            break;

          case "START_RIDE":
            rideManager.startRide(input[1], input[2],input[3].trim());
            break;
          case "STOP_RIDE":
            rideManager.stopRide(input[1], input[2], input[3], parseInt(input[4].trim()));
            break;
          case "BILL":
            rideManager.billRide(input[1])
            break;
        }
      }
    }
  }
}

const filename = process.argv[2];
data = fs.readFileSync(process.argv[2]).toString();
let train1 = new Vehicle();
train1.main(data);

module.exports = RideManager;
