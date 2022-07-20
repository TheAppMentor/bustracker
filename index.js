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

const updateBusLocation = async () => {
    try {
        console.time("Time: Fetching Bus Location")
        setupDate()

        let uiStateForBus = await locManager.getBusState(currentDate)
        
        //TODO: Do this once before udpating location
        pixelManager.configurePixelManager()
        
        if (uiStateForBus.pop() === 2) { // Bus has reached a the last stop. Go to panic mode.
            clearInterval(refreshIntervalId) // Stop getting Location.
            pixelState = pixelManager.panicMode()
            setTimeout(process.exit,30000)
            return;
        }

        pixelState = pixelManager.lightupPixels(uiStateForBus)

    } catch (err) {
        console.log('Error Fetching Bus Data : ', err);
    }

    console.timeEnd("Time: Fetching Bus Location")
    console.log('\n\n');
};

var refreshIntervalId = setInterval(updateBusLocation, 5000)

