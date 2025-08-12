const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets = require('./planets.mongoose');

const habitablePlanets = [];

const isHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED' &&
             planet['koi_insol'] > 0.36 &&
             planet['koi_insol'] < 1.11 &&
             planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {

    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname,'..','data','kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            })).on('data', (row) => {

                if(isHabitable(row)) {
                    saveHabitablePlanets(row['kepler_name']);
                }
                
            }).on('error', (error) => {
                reject(error);
            }).on('end', () => {
                resolve();
            });
    });
}

async function getAllHabitablePlanets() {
    return await planets.find({});
}

async function saveHabitablePlanets(keplerName) {

    try{

        await planets.updateOne({
            keplerName
        }, {
            keplerName
        }, {upsert: true});
    }
    catch (error) {
        console.error(`Could not save planet ${keplerName}:`, error);
    }
}

module.exports = {
    loadPlanetsData,
    getAllHabitablePlanets
}