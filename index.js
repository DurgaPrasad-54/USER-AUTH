const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./Database/db');
const verify = require('./verify/verify');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Register route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Database error', error: err });
            }

            if (result.length > 0) {
                return res.status(409).send({ message: 'User already exists' });
            }

            const hash = await bcrypt.hash(password, 10);

            db.query(
                'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
                [name, email, hash],
                (err, result) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error registering user', error: err.message });
                    }

                    return res.status(201).send({ message: 'User registered successfully' });
                }
            );
        });

    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error fetching user", error: err });
        }

        if (result.length === 0) {
            return res.status(404).send({ message: "User not found. Please register." });
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).send({ message: "Incorrect password" });
        }

        const Token = jwt.sign(
            { id: user.userid, email: user.email, name: user.name },
            process.env.TOKEN,
            { expiresIn: '1h' }
        );

        res.send({ message: "User login successful", Token });
    });
});

app.get('/dashbord', verify, (req, res) => {
    const user = req.user;
    res.send({ message: `Welcome ${user.name}` });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
