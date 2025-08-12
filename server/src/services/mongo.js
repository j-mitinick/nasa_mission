const mongoose = require('mongoose');

// Load environment variables from .env file
// This allows us to use environment variables defined in the .env file,
// such as MONGO_URL, in our application.
// The dotenv package will read the .env file and make the variables available in process.env.
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

async function connectToMongoDB() {
  
    await mongoose.connect(MONGO_URL);
  
}

async function desconnectFromMongoDB() {
    await mongoose.disconnect();
}


mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

module.exports = {
  connectToMongoDB,
  desconnectFromMongoDB
};