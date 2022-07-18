const redColor = "0X00FF00"
const blueColor = "0X0000FF"
const greenColor = "0XFF0000"

const ledStripConfig = {
    leds : 10, // Number of leds in my strip
    dma : 10, // Use DMA 10 (default 10)
    brightness : 200, // Set full brightness, a value from 0 to 255 (default 255)
    gpio : 18, // Set the GPIO number to communicate with the Neopixel strip (default 18)
    stripType : 'grb', 
}

// DONT FORGET !!!!!!!!!!!!>>>>> YOU NEED DO THIS STEP below for the strip to work"
    /*
        // Configure ws281x
        ws281x.configure(this.config);
        */
//var ws281x = require('rpi-ws281x');

// Prash : In this class we just generate the array to be fed to the LED.
// 'rpi-ws281x' does not work on mac. We can do only that part on the pi. 

exports.doSomething = () => {
   console.log("Do Something") 
}

exports.blink = (leds,grbColor,duration = 300) => {
    // Create a pixel array matching the number of leds.
    // This must be an instance of Uint32Array.
    var pixels = new Uint32Array(ledStripConfig.leds);  
    console.log(pixels)
}

