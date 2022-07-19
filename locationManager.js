var axios = require("axios");

// pending, inprogress, arrived.
const locSansar = {
    name: "Sansar",
    la: 12.967538632157412,
    lo: 77.71408096545004,
    status: "inProgress",
};
const locGopalan = {
    name: "Gopalan",
    la: 12.967713847714254,
    lo: 77.710898,
    status: "pending",
};
const locHanumanTemple = {
    name: "Hanuman Temple",
    la: 12.971884,
    lo: 77.71184554809889,
    status: "pending",
};
const locAkmeEncore = {
    name: "Akme Encore",
    la: 12.972023,
    lo: 77.713419,
    status: "pending",
};
const locSJRbrooklyn = {
    name: "SJR Brooklyn",
    la: 12.97171564160796,
    lo: 77.71203399299321,
    status: "pending",
};
const locSherlocksPub = {
    name: "Sherlocks Pub",
    la: 12.97091981448039,
    lo: 77.71233234169756,
    status: "pending",
};
const locSterlingShalom = {
    name: "Sterling Shalom",
    la: 12.970926,
    lo: 77.71441868316718,
    status: "pending",
};

let pointsOfInterest = [
    locSansar,
    locGopalan,
    locHanumanTemple,
    locAkmeEncore,
    locSJRbrooklyn,
    locSherlocksPub,
    locSterlingShalom,
];

const axiosFetchData = async (currentDate) => {
    //var data = 'iEtTPee=2022-07-18+02%3A35%3A37';
    //var data = "iEtTPee=2022-07-18+02%3A01%3A16";
    //var data = "iEtTPee=" + currentDate + "+02%3A01%3A16";
    //2022-07-19+02:36:19
    var data = "iEtTPee=" + currentDate + "+02%3A20%3A16";
    //var data = "iEtTPee=" + currentDate 
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

// Check if bus is with in 50 mts of target
const isBusInRangeof = (busLoc, targetLocation, tolerance = 0.05) => {
    let dist = distance({ la: busLoc.la, lo: busLoc.lo }, targetLocation);

    if (dist < tolerance) {
        console.log(
            "We are near Target Location : Lat : ",
            targetLocation.lo,
            "Long : ",
            targetLocation.la,
            dist
        );
        return true;
    }

    return false;
};

const fetchLatestBusLocation = async (currentDate) => {
    try {
        let busLocationData = await axiosFetchData(currentDate);
        if (busLocationData.status === "ok") {
            let locations = busLocationData.data[0].locations;

            if (locations.length === 0) {
                throw "Network Request OK. No Location array is empty.";
            }

            if (locations.length > 0) {
                return locations[0];
            }
        }

        // Unexpected error.
        throw (
            "Fetch Bus Status Network Status Error.. Expected Status===OK but got " +
            busLocationData.status
        );
    } catch (err) {
        console.log("error Fetching Bus Data ", err);
        throw err;
    }
};

exports.getBusState = async (currentDate) => {
    let currLocation = await fetchLatestBusLocation(currentDate);
    updateTrackingStatus(currLocation);
    let uiStateArr = updateUIForCurrStatus();
    return uiStateArr 
};

const updateTrackingStatus = (busLoc) => {
    //
    let locInProgress = pointsOfInterest.filter(
        (loc) => loc.status === "inProgress"
    );
    console.log("Current Inprogress Location is : ", locInProgress);

    if (locInProgress.length === 0) {
        console.log("We are not in target range yet.");
        pointsOfInterest[0].status = "inProgress";
        locInProgress.push(pointsOfInterest[0]);
    }

    console.log("!!!!!!!!  Bus Location is ", busLoc);

    // Check if bus is in range of current inProgress fellow
    if (
        isBusInRangeof(
            { la: busLoc.la, lo: busLoc.lo },
            { la: locInProgress[0].la, lo: locInProgress[0].lo }
        ) === true
    ) {
        console.log("We are in range of POI : ", locInProgress[0].name);
        // Change status to Arrived.
        for (let i = 0; i < locInProgress.length; i++) {
            if (locInProgress[i].status === "inProgress") {
                locInProgress[i].status = "arrived";
                if (i < locInProgress.length) {
                    locInProgress[i + 1].status = "inProgress"
                }
                break;
            }
        
        }
    }
};

const updateUIForCurrStatus = () => {
    let lightMap = pointsOfInterest.map((loc) => {
        if (loc.status == "pending") {
            return 0;
        }

        if (loc.status == "inProgress") {
            return 1;
        }

        if (loc.status == "arrived") {
            return 2;
        }
    });

    console.log("We will ightup the array with :", lightMap)
    return lightMap
};
