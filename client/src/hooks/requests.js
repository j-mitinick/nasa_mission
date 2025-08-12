async function httpGetPlanets() {
  const response = await fetch('https://localhost:5000/api/v1/planets');
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch('https://localhost:5000/api/v1/launches');
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch('https://localhost:5000/api/v1/launches', {
      method: 'POST',

      // The headers object specifies the content type of the request.
      // In this case, it is set to 'application/json', indicating that the request body
      // will contain JSON data.
      // This is important for the server to correctly parse the incoming data.
      // The server will expect the request body to be in JSON format, which is a common
      // data interchange format used in web applications.
      // The server will use this information to parse the request body correctly.
      // The server will then process the request and return a response.
      // The response will typically include the status of the request, such as whether it was successful
      // or if there were any errors.
      // The response will also typically include any data that was requested or created as a result of
      // the request.
      // In this case, the request is expected to create a new launch, and the server
      // is expected to respond with the newly created launch object.
      // The response will typically include the flight number, mission, rocket, launch date, target, customers, upcoming status, and success status of the launch.
      // The response will be in JSON format, which is a common data interchange format used in web applications.
      // The client can then use this response to update the UI or perform other actions based on the newly created launch.
      headers: {
        'Content-Type': 'application/json',
      },
      // The body of the request contains the launch data in JSON format.
      // This is the data that will be sent to the server to create a new launch.
      // The server will then process this data and create a new launch record.
      // The server is expected to respond with the newly created launch object.
      // The response will typically include the flight number, mission, rocket, launch date, target, customers, upcoming status, and success status of the launch.
      // The response will be in JSON format, which is a common data interchange format used in web applications.
      // The client can then use this response to update the UI or perform other actions based on the newly created launch.
      // The server is expected to validate the launch data and return an appropriate response.
      // If the launch data is valid, the server will create a new launch and return it.
      // If the launch data is invalid, the server will return an error response with a status code indicating the type of error (e.g., 400 Bad Request for missing or invalid fields).
      body: JSON.stringify(launch),
    });
  } catch (error) {

    return {
      ok: false
    }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`https://localhost:5000/api/v1/launches/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    return {
      ok: false
    }
  }
  // The server is expected to respond with a status code indicating the success or failure of the
  // operation. If the launch with the given ID was successfully deleted, the server will return
  // a success status code (e.g., 204 No Content). If the launch with the given ID does not exist,
  // the server will return a 404 Not Found status code
  // indicating that the launch could not be found.
  // If there was an error during the request, such as a network issue or server error,
  // the server will return an error status code (e.g., 500 Internal Server Error).
  // The client can then handle the response accordingly, such as updating the UI or displaying an
  // error message to the user.
  // The server is expected to validate the request and return an appropriate response.
  // If the request is valid, the server will delete the launch and return a success status 
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};