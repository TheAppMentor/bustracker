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
const updateBusLocation = async () => {
    try {
        console.time("Time: Fetching Bus Location")
        console.log('Fetching bus Location');
        setupDate()

        let uiStateForBus = await locManager.getBusState(currentDate)

        pixelManager.configurePixelManager()
        pixelState = pixelManager.lightupPixels(uiStateForBus)

    } catch (err) {
        console.log('Error Fetching Bus Data : ', err);
    }

    console.timeEnd("Time: Fetching Bus Location")
    console.log('\n\n');
};

//TODO: Prashanth change this back to 5s or 7s
setInterval(updateBusLocation, 200)
