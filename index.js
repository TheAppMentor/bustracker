var pixelManager = require('./pixelManager')
var locManager = require('./locationManager')

let currentDate = ""

// ✅ Format a date to YYYY-MM-DD (or any other format)
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

const setupDate = () => {
    const date = new Date();
    let dateStr = [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');

    currentDate = dateStr 
} 

// Call start
(async() => {
    try {
        console.log('before start');
        setupDate()
       

        locManager.doSomething()
        let someData = await locManager.fetchLatestBusLocation(currentDate)
        console.log("Some Data : ", someData) 
        
        // Parse the body JSON to get bus location.

        // Call the function to get current bus distance from a stop.

        // Light LED's accordingly.
        pixelManager.doSomething()
        pixelManager.blink()
    } catch (err) {
        console.log('Error Fetching Bus Data : ', err);
    }

    console.log('One fetch cycle completed');
})();













/*

    //let json = require('./latlong_small.json');
let json = require("./latlong.json");
//console.log(json, 'the json obj');

function distance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    function toRadians(value) {
        return (value * Math.PI) / 180;
    }

    var R = 6371.071;
    var rlat1 = toRadians(x1); // Convert degrees to radians
    var rlat2 = toRadians(x2); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = toRadians(y2 - y1); // Radian difference (longitudes)
    return (
        2 *
        R *
        Math.asin(
            Math.sqrt(
                Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                    Math.cos(rlat1) *
                        Math.cos(rlat2) *
                        Math.sin(difflon / 2) *
                        Math.sin(difflon / 2)
            )
        )
    );
}

let gopalan = { x: 12.967713847714254, y: 77.710898 };
let hanumanTemple = { x: 12.971884, y: 77.71184554809889 };
let akmeEncore = { x: 12.972023, y: 77.713419 };
let sjrbrooklyn = { x: 12.97171564160796, y: 77.71203399299321 };
let sherlocksPub = { x: 12.97091981448039, y: 77.71233234169756 };
let sterling = { x: 12.970926, y: 77.71441868316718 };

let label = "Time to calc positions : ";
console.time(label);

json.forEach((eachLoc) => {
    let dist = distance({ x: eachLoc.la, y: eachLoc.lo }, gopalan);

    if (dist < 0.05) {
        console.log(
            "We are near Gopalan : Lat : ",
            eachLoc.la,
            "Long : ",
            eachLoc.lo,
            dist
        );
    }
});

// Sterling Shalom Location

// Sansar = {x: 12.967538632157412, y: 77.71408096545004}
// gopalan = {x: 12.967713847714254, y: 77.710898}
// hanumanTemple = {x: 12.971884, y:77.71184554809889}
// akmeEncore = {x:12.972023, y:77.713419}
// sjrbrooklyn = {x:12.97171564160796, y:77.71203399299321}
// sherlocksPub = {x: 12.97091981448039, y: 77.71233234169756}
// sterling = {x: 12.970926, y: 77.71441868316718}

json.forEach((eachLoc) => {
    let dist = distance({ x: eachLoc.la, y: eachLoc.lo }, hanumanTemple);

    if (dist < 0.08) {
        console.log(
            "We are near Hanuman Temple : Lat : ",
            eachLoc.la,
            "Long : ",
            eachLoc.lo,
            dist
        );
    }
});

json.forEach((eachLoc) => {
    let dist = distance({ x: eachLoc.la, y: eachLoc.lo }, sjrbrooklyn);

    if (dist < 0.08) {
        console.log(
            "We are near SJR Brooklyn : Lat : ",
            eachLoc.la,
            "Long : ",
            eachLoc.lo,
            dist
        );
    }
});

json.forEach((eachLoc) => {
    let dist = distance({ x: eachLoc.la, y: eachLoc.lo }, sterling);

    if (dist < 0.08) {
        console.log(
            "We are near Sterling Shalom : Lat : ",
            eachLoc.la,
            "Long : ",
            eachLoc.lo,
            dist
        );
    }
});

console.timeEnd(label);
*/
