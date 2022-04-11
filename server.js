//http
const { createServer } = require('http');
//express import
const express = require('express');
const app = express();

//cors import
const cors = require('cors');

//custom errror import

//routers import
const router = require('./routes/index');

//dotenv  import
const dotenv = require('dotenv');

//create server
const httpServer = createServer(app);

//dotenv config
dotenv.config({
  path: './config/env/config.env',
});

//mongodb connection import
const { mongoDbConnection } = require('./mongoDb/mongoDbConnection');

//mongodb start
mongoDbConnection();

//cors use
app.use(cors());
//express json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//v1

app.use('/api/v1', router);
//for get file route

//app start
const PORT = process.env.PORT || 3000;

// Socket setup

httpServer.listen(PORT, 'localhost', () => {
  console.log('server listening', `http://localhost:${PORT}`);
});
