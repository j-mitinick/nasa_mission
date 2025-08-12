const path = require('path');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// Helmet helps secure Express apps by setting various HTTP headers
const morgan = require('morgan');

const api = require('./routes/api');


const app = express();

app.use(cors({
  origin: 'http://localhost:5000'/*, // Adjust this to your client URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',*/
  //credentials: true, // Uncomment if you need to send cookies or HTTP authentication
}));

app.use(helmet());

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname,'..', 'public')));
//app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', api);

/*
/* This is a catch-all route that serves the index.html file for any request that doesn't match an API endpoint.
This is useful for single-page applications (SPAs) where the client-side routing is handled by the front-end framework (like React, Angular, or Vue).
*/
app.get(/^\/(?!api\/).*/,(req,res)=>{
  res.sendFile(path.join(__dirname,'..','public','index.html'));
});

module.exports = app;