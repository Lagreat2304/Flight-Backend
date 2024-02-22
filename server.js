const express = require('express');
const Customer = require("./dbFiles/Customer");
const dbOperation = require("./dbFiles/dbOperations");
const cors = require('cors');
const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
require('dotenv').config();
var config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options: {
      trustedconnection: false,
      enableArithAbort: true,
      trustServerCertificate: true,
      instancename: process.env.INSTANCE,
    },
    port: process.env.PORT
};

app.post('/customersearch', async(req,res) => {
    console.log('called');
    const result = await dbOperation.getcustomer(req.body.name);
    res.send(result.recordset);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await dbOperation.authenticateUser(email, password);
    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });

  app.get('/flights', async (req, res) => {
    try {
      const flights = await dbOperation.getAllFlights();
      res.json({ success: true, flights });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  app.post('/bookSeat', async (req, res) => {
    const { flightNumber } = req.body;
    const result = await dbOperation.bookSeat(flightNumber);
    res.send(result);
  });
  
  app.get('/filteredFlights', async (req, res) => {
    const { departure, destination } = req.query;
  
    const filters = {
      departure,
      destination,
    };
  
    const filteredFlights = await dbOperation.getFilteredFlights(filters);
  
    if (filteredFlights !== null) {
      res.json({ flights: filteredFlights });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/getProfile', async (req, res) => {
    const { email } = req.query;
    try {
      const profile = await dbOperation.getUserProfile(email);
      res.json({ profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  });
  
app.post('/customeradd', async(req,res) => {
    console.log("Operated");
    await dbOperation.addcustomer(req.body);
    const result = await dbOperation.getcustomer(req.body.Email);
    res.send(result.recordset);
});

app.listen(port, ()=> console.log("Listening"));