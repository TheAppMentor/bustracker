var axios = require('axios');


const locSansar = {x: 12.967538632157412, y: 77.71408096545004}
const locGopalan = {x: 12.967713847714254, y: 77.710898}
const locHanumanTemple = {x: 12.971884, y:77.71184554809889}
const locAkmeEncore = {x:12.972023, y:77.713419}
const locSJRbrooklyn = {x:12.97171564160796, y:77.71203399299321}
const locSherlocksPub = {x: 12.97091981448039, y: 77.71233234169756}
const locSterlingShalom = {x: 12.970926, y: 77.71441868316718}


exports.doSomething = () => {
   console.log("Location Manager: Do Something") 
}

const axiosFetchData = async (currentDate) => {
    //var data = 'iEtTPee=2022-07-18+02%3A35%3A37';
    var data = 'iEtTPee=2022-07-18+02%3A01%3A16';
    var data = 'iEtTPee=' + currentDate + "+02%3A01%3A16"
    //var data = 'iEtTPee=2022-07-18';
    console.log("Axios : Date : ", data) 
    //2022-07-18+02%3A01%3A16
    
    var config = {
        method: 'post',
        url: 'https://track.neotrackweb.com/getRTData.php',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 
            'Accept': '*/*', 
            'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8', 
            'Accept-Encoding': 'gzip, deflate, br', 
            'Host': 'track.neotrackweb.com', 
            'Origin': 'https://track.neotrackweb.com', 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15', 
            'Connection': 'keep-alive', 
            'Referer': 'https://track.neotrackweb.com/index.php', 
            'Content-Length': '31', 
            'Cookie': '_ga=GA1.2.1445954763.1657784238; _gid=GA1.2.1175967402.1657784238; _ga=GA1.3.1445954763.1657784238; _gid=GA1.3.1175967402.1657784238; PHPSESSID=kg1nvl4140h2s36b0spiaga534; NTTimeZone={"offset":-330,"dst":0}; PHPSESSID=bgbc1qqslpb36je91e3986e7t7', 
            'X-Requested-With': 'XMLHttpRequest'
        },
        data : data
    };

    try {
        const fetchedData = await axios(config)
        return fetchedData.data
    } catch (err) {
        console.error("Axios Error :", err);
        throw(err)
    }
}

exports.fetchLatestBusLocation = async (currentDate) => {
    try {
        let busLocationData = await axiosFetchData(currentDate)
        if (busLocationData.status === "ok") {
            let locations = busLocationData.data[0].locations
            
            if ( locations.length === 0) {
                throw 'Network Request OK. No Location array is empty.'
            } 

            if (locations.length > 0) {
                return locations[0]
            } 
        }

        // Unexpected error.
        throw "Fetch Bus Status Network Status Error.. Expected Status===OK but got " + busLocationData.status 

    } catch (err) {
        console.log("error Fetching Bus Data ", err)
        throw err
    }
}

const isBusInRangeof = (targetLocation, tolerance = 0.08) => {
    let busLoc = getBusLocation()
    console.log(busLoc)


    let dist = distance(
        { x: busLoc.la , y: busLoc.lo },
        hanumanTemple
    )

    if (dist < tolerance) {
        console.log("We are near Target Location : Lat : ", targetLocation.x, "Long : ", targetLocation.y, dist)
        return true
    }

    return false;
}
