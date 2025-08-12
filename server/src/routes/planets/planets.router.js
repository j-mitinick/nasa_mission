const express = require('express');

const planetsRouter = express.Router();
const {
    httpGetAllHabitablePlanets,
} = require('./planets.controller');

planetsRouter.get('/', httpGetAllHabitablePlanets);

module.exports = planetsRouter;