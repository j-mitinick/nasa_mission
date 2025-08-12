
const https = require('https');
const fs = require('fs');

// Load environment variables from .env file
// This allows us to use environment variables defined in the .env file,
// such as PORT and MONGO_URL, in our application.
// The dotenv package will read the .env file and make the variables available in process.env.
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const { loadPlanetsData } = require('./models/planets.model');

const app = require('./app');
const { connectToMongoDB } = require('./services/mongo');
const { loadLaunchesData } = require('./models/launches.model');

const server = https.createServer({
  key:fs.readFileSync('key.pem'),
  cert:fs.readFileSync('cert.pem')
},app);


async function startServer(){

  //Estes tipos de funcoes servem para inicializar o servidor e carregar os dados necessários antes de começar a aceitar requisições.
  //Aqui, estamos carregando os dados dos planetas antes de iniciar o servidor.

  await connectToMongoDB();

  await loadPlanetsData()
    .then(() => {
      console.log('Planets data loaded successfully');
    })
    .catch((error) => {
      console.error('Error loading planets data:', error);
      process.exit(1); // Exit the process if data loading fails
    });
    
    await loadLaunchesData();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
    });

}

startServer();