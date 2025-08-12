const {getAllLaunches,isLaunchExists, abortLaunchById, sheduleNewLaunch} = require('../../models/launches.model.js');

const {
    getPagination
} = require('../../services/query.js');

async function httpGetAllLaunches (req, res) {

    const {skip,limit} = getPagination(req.query);

    const launches = await getAllLaunches(skip, limit);

    return res.status(200).json(launches);
}

// This function handles HTTP POST requests to add a new launch.
// It expects the request body to contain the launch details.
// The launch date is converted to a JavaScript Date object.
// After adding the new launch, it responds with a 201 status code and the newly created
// launch object in JSON format.
// The 201 status code indicates that the request has been fulfilled and has resulted in a new
// resource being created. This is a common practice in RESTful APIs to inform the client
// that the resource was created successfully and to provide the details of the created resource.
async function httpAddNewLaunch(req,res){
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        // HTTP status code 400 indicates a Bad Request.
        // This means that the server cannot process the request due to a client error,
        // such as missing required fields in the request body.
        // In this case, it indicates that the request body is missing required fields for a launch.
        // The response body contains an error message to inform the client about the missing fields.
        return res.status(400).json({
            error: 'Missing required launch property',  // This error message indicates that the request body is missing required fields for a launch.
        });
    }

    // Convert the launch date from a string to a Date object.
    // This is necessary because the launch date is expected to be a Date object in the model
    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        // HTTP status code 400 indicates a Bad Request.    
        // This means that the server cannot process the request due to a client error,
        // such as an invalid date format in the request body.
        // In this case, it indicates that the launch date provided is not a valid date.
        // The response body contains an error message to inform the client about the invalid date.
        return res.status(400).json({
            error: 'Invalid launch date'  // This error message indicates that the launch date provided is not a valid date.
        });
    }

    try {

        await sheduleNewLaunch(launch);
        // HTTP status code 201 indicates that a resource has been successfully created.
        // In this case, it indicates that a new launch has been successfully added.
        // The response body contains the newly created launch object.
        // This is a common practice in RESTful APIs to inform the client that the resource was
        // created successfully and to provide the details of the created resource.
        // This allows the client to immediately see the result of their request and use the new resource
        return res.status(201).json(launch);
        
    } catch (error) {
        // HTTP status code 400 indicates a Bad Request.    
        // This means that the server cannot process the request due to a client error,
        // such as an invalid target planet in the request body.                        
        // In this case, it indicates that the target planet provided does not exist in the database.
        // The response body contains an error message to inform the client about the invalid target.   
        return res.status(400).json({
            error: error.message  // This error message indicates that the target planet provided does not exist in the database.
        });
    }


    
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id); 

    if (!isLaunchExists(launchId)) {
        // HTTP status code 404 indicates that the requested resource was not found.
        // In this case, it indicates that the launch with the given ID does not exist.
        // The response body contains an error message to inform the client about the missing launch.
        return res.status(404).json({
            error: 'Launch not found'
        });
    }

    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};