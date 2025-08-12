const axios = require('axios');

const launchesDatabase = require('./launches.mongoose');
const planetsDatabase = require('./planets.mongoose');




const   DEFAULT_FLIGHTNUMBER = 100;

async function getAllLaunches(skip, limit) {

    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    })
    .sort({flightNumber: 1})    
    .skip(skip)
    .limit(limit);
}


async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if (!latestLaunch) 
        return DEFAULT_FLIGHTNUMBER; 

    return latestLaunch.flightNumber;
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}


async function populateLaunches() {
    const response = await axios.post('https://api.spacexdata.com/v4/launches/query', {
        query: {},
        options:{
            pagination:false,
            populate: [
                {
                    path:'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {

        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchesDocs = response.data.docs;

    for (const launchDoc of launchesDocs) {

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            customers: launchDoc.payloads.flatMap(payload => payload.customers),
            upcoming: launchDoc.upcoming,
            success: launchDoc.success
        };



        console.log(`${launch.flightNumber} ${launch.mission}`);
        
        //TODO: save launch
        await saveLaunch(launch);
    }
}

async function loadLaunchesData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1',
    });

    if( firstLaunch) {
        console.log('Launch data already loaded');
    }else {
        await populateLaunches();
    }

    

}

async function sheduleNewLaunch(launch) {

    const planet = await planetsDatabase.findOne({
        keplerName: launch.target});

    if (!planet) 
        throw new Error(`No planet found for target ${launch.target}`);

    const flightNumber = await getLatestFlightNumber() +1;
    const newLaunch = Object.assign(launch, {
        flightNumber: flightNumber,
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true
    });

    await saveLaunch(newLaunch);
}

async function saveLaunch(launch){  

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {upsert: true});
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return aborted.modifiedCount === 1;
}

async function isLaunchExists(launchId) {
    return await findLaunch({
        flightNumber: launchId
    });
}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    abortLaunchById,
    isLaunchExists,
    sheduleNewLaunch
}