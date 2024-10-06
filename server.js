// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
dotenv.config();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if DB connection works
db.connect((err) => {
    if (err) {
        return console.error("Error connecting to the MySQL db:", err);
    }
    console.log("Connected to MySQL successfully as id:", db.threadId);

    // Question no 1: Endpoint to retrieve all patients
    app.get('/patients', (req, res) => {
        db.query('SELECT patient_id, first_name, last_name, Date_of_Birth FROM patients', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving patient data');
            }
            res.render('patients', { results: results });
        });
    });

    // Question no 2: Endpoint to retrieve all providers
    app.get('/providers', (req, res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving provider data');
            }
            res.render('providers', { results: results });
        });
    });

    // Question no 3: Endpoint to filter patients by First Name
    // Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
    const firstName = req.params.firstName; // Get the first name from URL parameters

    db.query('SELECT patient_id, first_name, last_name, Date_of_Birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving patient data');
        }

        // Render the results using an EJS template
        res.render('patients', { results: results });
    });
});


    // Question no 4: Endpoint to retrieve all providers by their specialty
   // Retrieve providers by specialty
   // http://localhost:3000/providers/specialty?specialty=Cardiology
app.get('/providers/specialty', (req, res) => {
    const specialty = req.query.specialty; // Get the specialty from query parameters

    if (!specialty) {
        return res.status(400).send('Specialty query parameter is required.');
    }

    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving provider data');
        }

        if (results.length === 0) {
            return res.status(404).send('No providers found with that specialty');
        }

        // Render the results using an EJS template
        res.render('providers', { results: results });
    });
});


    app.get('/', (req, res) => {
        res.send('Server started successfully! Wedding can go on!!!');
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Sending message to browser...');
    });
});

