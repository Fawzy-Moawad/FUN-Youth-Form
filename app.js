require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded data and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Route to handle form submission
app.post('/send', (req, res) => {
    const { firstName, lastName, age, phone, email, emergencyName, emergencyNumber, address,  city, postalCode} = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // Your Hostinger email address
            pass: process.env.PASSWORD // Your Hostinger email password
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL, // Your email address from .env
        to: 'youthclub@fun-canada.com',
        subject: 'Youth Club Form',
        text: `First Name: ${firstName}\nLast Name: ${lastName}\nAge: ${age}\nPhone: ${phone}\nEmail: ${email}\nEmergency Name: ${emergencyName}\nEmergency Number: ${emergencyNumber}\nAddress: ${address}\nCity: ${city}\nPostal Code: ${postalCode}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'Form sent successfully' }); // Send JSON response
    });
});

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
