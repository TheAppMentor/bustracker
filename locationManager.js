var axios = require("axios");
var poi = require("./pointsOfInterest.json")
var fakeJSON = require("./mock_bus_locations.json")
var pointsOfInterest = require("./pointsOfInterest.json")

async function stall(stallTime = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
}

const fakeBusDataProvider = async (currentDate) => {
    //await stall(20)
    return fakeJSON.shift() 
} 

const axiosFetchData = async (currentDate) => {
    var data = "iEtTPee=" + currentDate + "+02%3A20%3A16";
    console.log("Axios : Date : ", data);

    var config = {
        method: "post",
        url: "https://track.neotrackweb.com/getRTData.php",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "*/*",
            "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            Host: "track.neotrackweb.com",
            Origin: "https://track.neotrackweb.com",
            "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15",
            Connection: "keep-alive",
            Referer: "https://track.neotrackweb.com/index.php",
            "Content-Length": "31",
            Cookie: '_ga=GA1.2.1445954763.1657784238; _gid=GA1.2.1175967402.1657784238; _ga=GA1.3.1445954763.1657784238; _gid=GA1.3.1175967402.1657784238; PHPSESSID=kg1nvl4140h2s36b0spiaga534; NTTimeZone={"offset":-330,"dst":0}; PHPSESSID=bgbc1qqslpb36je91e3986e7t7',
            "X-Requested-With": "XMLHttpRequest",
        },
        data: data,
    };

    try {
        const fetchedData = await axios(config);
        return fetchedData.data;
    } catch (err) {
        console.error("Axios Error :", err);
        throw err;
    }
};

const distance = ({ la: x1, lo: y1 }, { la: x2, lo: y2 }) => {
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
};

// Check if bus is with in 100 mts of target
const isBusInRangeof = (busLoc, targetLocation, tolerance = 0.1) => {
    let dist = distance({ la: busLoc.la, lo: busLoc.lo }, targetLocation);
    if ( dist < tolerance ) {
        console.log("busLoc : `${busLoc}` Taget : `${targetLocation}`")
    } 
    return dist < tolerance
};

const fetchLatestBusLocation = async (currentDate) => {
    try {
        //let busLocationData = await axiosFetchData(currentDate);
        let busLocationData = await fakeBusDataProvider();

        if (busLocationData === undefined) {
            console.log(">>>>>>>>>>>>>>>>>   Exit <<<<<<<<<<<<<<<<<<<") 
            process.exit() 
        }
        if (busLocationData.status.toUpperCase() === "OK") {
            let locations = busLocationData.data[0].locations;

            if (locations.length === 0) {
                throw "!!!!! Network Request OK. No Location array is empty.";
            }

            if (locations.length > 0) {
                return locations[0];
            }
        }

        // Unexpected error.
        throw (
            "!!!!! Fetch Bus Status Network Status Error.. Expected Status===OK but got " +
            busLocationData.status
        );
    } catch (err) {
        console.log("!!!!! error Fetching Bus Data ", err);
        throw err;
    }
};

exports.getBusState = async (currentDate) => {
    let currLocation = await fetchLatestBusLocation(currentDate);
    updateTrackingStatus(currLocation);
    return pointsOfInterest.map(loc => loc.status);
};

const updateTrackingStatus = (busLoc) => {

    
    let allArrived = pointsOfInterest.filter( loc => loc.status === 2 );
    if ( allArrived.length === pointsOfInterest.length ) {
       console.log("WE are done Processing all POI") 
        //TODO: WE should not just die here.. reset LED after some time. and then die. 
        process.exit() 
    }

    // status  0 : unknown, 1: currentlyTracking, 2: arrived 

    var currLocationInProgress = ""
    // Get the point of interst we are currentlyTracking tracking
    let locInProgress = pointsOfInterest.filter( loc => loc.status === 1 );

    console.log("Current Inprogress Location is : ", locInProgress);

    if (locInProgress.length === 1) {
        currLocationInProgress = locInProgress[0]
    }
    
    if (locInProgress.length > 1) {
        throw "ERR : We have a problem.. more that one target location is in progress" 
    }

    // Nothing is being tracked. We might just be starting. Start tracking the first one. 
    if  (locInProgress.length === 0) {
        console.log("We are not in target range yet.");
        pointsOfInterest[0].status = 1;
        currLocationInProgress = pointsOfInterest[0] 
        //locInProgress.push(pointsOfInterest[0]);
    }

    // Check if bus is in range of current inProgress fellow

    let proximityCheckArr = currLocationInProgress.locations.map(loc => 
        isBusInRangeof( { la: busLoc.la, lo: busLoc.lo }, { la: loc.la, lo: loc.lo }) === true ) 

    console.log("proximityCheckArr :", proximityCheckArr)
    if (!proximityCheckArr.includes(true)) {
        return
    }

    console.log(">>>>>>>>>>>>> Awesome => We are Near a target.")

    // Mark status of location to arrived. & setup next checkpoint
    // Change status to Arrived.
    for (let i = 0; i < pointsOfInterest.length; i++) {
        if (pointsOfInterest[i].status === 1) {
            pointsOfInterest[i].status = 2;
            if (i < pointsOfInterest.length - 1) { // If we are on the last one Dont do anything 
                pointsOfInterest[i + 1].status = 1 
            }
            break;
        }
    }
}
