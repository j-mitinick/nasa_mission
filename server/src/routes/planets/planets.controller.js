const {
  getAllHabitablePlanets
} = require('../../models/planets.model');

async function httpGetAllHabitablePlanets(req, res) {
  res.status(200).json(await getAllHabitablePlanets());
}

module.exports = {
  httpGetAllHabitablePlanets,
};