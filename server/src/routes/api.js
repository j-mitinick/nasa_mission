const express = require('express');
const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');


const api = express.Router();
// Define the API routes
// These routes handle requests to the /api/planets and /api/launches endpoints
api.use('/planets',planetsRouter);
api.use('/launches',launchesRouter);

module.exports = api;

