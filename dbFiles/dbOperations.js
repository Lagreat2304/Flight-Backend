const Customer = require('./Customer');
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
  port: parseInt(process.env.PORT, 10),
};

const sql = require('mssql');

const addcustomer = async (newcustomer) => {
  try {
    console.log(newcustomer);
    let pool = await sql.connect(config);
    let employees = await pool
      .request()
      .query(
        `insert into customer_master Values('${newcustomer.Email}', '${newcustomer.Name}' , '${newcustomer.PhoneNo}' , '${newcustomer.Address}', '${newcustomer.Password}')`
      );
    console.log(employees);
    return employees;
  } catch (error) {
    console.log(error);
  }
};

const authenticateUser = async (email, password) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('Email', sql.VarChar, email)
      .input('Password', sql.VarChar, password)
      .query('SELECT * FROM customer_master WHERE Email = @Email AND Password = @Password');
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAllFlights = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM flight_master');
    return result.recordset;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getcustomer = async (Employees) => {
  try {
    let pool = await sql.connect(config);
    let employees = await pool.request().query(`SELECT * from customer_master`);
    console.log(employees);
    return employees;
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = async (email) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('Email', sql.VarChar, email)
      .query('SELECT * FROM customer_master WHERE Email = @Email');
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const bookSeat = async (flightNumber) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('FlightNumber', sql.VarChar, flightNumber)
      .query('UPDATE flight_master SET Seats = Seats - 1 WHERE FlightNumber = @FlightNumber');
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getFilteredFlights = async (filters) => {
  try {
    let pool = await sql.connect(config);
    let query = 'SELECT * FROM flight_master WHERE 1=1'; 
    if (filters.departure) {
      query += ` AND Departure LIKE '%${filters.departure}%'`;
    }
    if (filters.destination) {
      query += ` AND Destination LIKE '%${filters.destination}%'`;
    }
    let result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error(error);
    return null;
  }
};


module.exports = {
  addcustomer,
  getcustomer,
  authenticateUser,
  getAllFlights,
  bookSeat,
  getFilteredFlights,
  getUserProfile
};
