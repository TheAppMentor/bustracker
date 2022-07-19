
// When running on raspi - uncomment the lines below. & remove runmode = ''
//const runmode = "";
const runmode = "raspi"
var ws281x = require('rpi-ws281x');

const greenColor = "0X00FF00";
const blueColor = "0X0000FF";
const redColor = "0XFF0000";
const yellowColor = "0XFFFF00";
const tealColor = "0X008080";

const ledStripConfig = {
    leds: 7, // Number of leds in my strip
    dma: 10, // Use DMA 10 (default 10)
    brightness: 200, // Set full brightness, a value from 0 to 255 (default 255)
    gpio: 18, // Set the GPIO number to communicate with the Neopixel strip (default 18)
    stripType: "grb",
};

// DONT FORGET !!!!!!!!!!!!>>>>> YOU NEED DO THIS STEP below for the strip to work"
/*
        // Configure ws281x
        ws281x.configure(this.config);
        */
//var ws281x = require('rpi-ws281x');

// Prash : In this class we just generate the array to be fed to the LED.
// 'rpi-ws281x' does not work on mac. We can do only that part on the pi.

let configured = false

exports.configurePixelManager = () => {
    // Configure ws281x
    if (runmode === "raspi" && configured === false) {
        configured = true;
        console.log(">>>>>>>>>>>>>>>    We are config the strip:", ledStripConfig);
        ws281x.configure(ledStripConfig);
    }
};

exports.blink = (leds, grbColor, duration = 300) => {
    // Create a pixel array matching the number of leds.
    // This must be an instance of Uint32Array.
    var pixels = new Uint32Array(ledStripConfig.leds);
    console.log(pixels);
};

exports.lightupPixels = (uiStateArr) => {
    if (runmode === "raspi") {

        var pixels = new Uint32Array(ledStripConfig.leds);

        uiStateArr.forEach((pixel,idx) => {
            pixels[idx] = tealColor;
            if (pixel === 1) { pixels[idx] = yellowColor }
            if (pixel === 2) { pixels[idx] = greenColor }
        });

        clearInterval(refreshIntervalId)
        refreshIntervalId = setInterval(blinkit,1000,pixels)

    } else {
        var pixelArr = uiStateArr.map((pixel) => {
            let returnVal = "⚪️";
            if (pixel === 1) { returnVal = "🟡" }
            if (pixel === 2) { returnVal = "🟢" }
            return returnVal 
        }) 
        console.log("Strip : ", ...pixelArr);
    }
};

let blinkOn = false
var refreshIntervalId 
const blinkit = (pixels) => {
    var blinkPixels = new Uint32Array(ledStripConfig.leds);

    pixels.forEach((pixel,idx) => {
        blinkPixels[idx] = pixel;
    
        if (pixel === 16776960 || pixel === 0) {
            if (blinkOn === true) {
                blinkPixels[idx] = "0X000000";
                blinkOn = false 
            } else {
                blinkPixels[idx] = yellowColor;
                blinkOn = true
            } 
        }
    })
    
    ws281x.render(blinkPixels);
}
