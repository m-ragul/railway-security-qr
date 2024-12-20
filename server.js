import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'ragul.cs22',
      database: 'auth_db',
    });
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if database connection fails
  }
})();

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await db.execute(query, [username, hashedPassword]);

    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ message: 'Username already exists' });
    } else {
      console.error('Error during registration:', err);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [results] = await db.execute(query, [username]);

    if (results.length === 0) {
      return res.status(401).send({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (isPasswordValid) {
      res.status(200).send({ message: 'Login successful' });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Book ticket route
app.post('/book-ticket', async (req, res) => {
  const { passengerName, departureStation, arrivalStation, pnr, qrCode } = req.body;

  console.log('Received Data:', { passengerName, departureStation, arrivalStation, pnr, qrCode });

  try {
    const query = `
      INSERT INTO bookings (passenger_name, departure_station, arrival_station, pnr, qr_code) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [passengerName, departureStation, arrivalStation, pnr, qrCode]);
    res.status(200).send({ message: 'Booking successful!' });
  } catch (err) {
    console.error('Error during booking:', err);
    res.status(500).send({ error: 'Booking failed. Please try again.' });
  }
});

// Validate ticket route
app.post('/validate-ticket', async (req, res) => {
  const { pnr } = req.body;

  if (!pnr) {
    return res.status(400).send({ message: 'PNR is required' });
  }

  try {
    // Query to check if the PNR exists in the bookings table
    const query = 'SELECT * FROM bookings WHERE pnr = ?';
    const [results] = await db.execute(query, [pnr]);

    if (results.length === 0) {
      return res.status(404).send({ message: 'Ticket not found' });
    }

    // If ticket is found, return success
    res.status(200).send({ message: 'Ticket is valid', ticket: results[0] });
  } catch (err) {
    console.error('Error during ticket validation:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});