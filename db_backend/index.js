const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isLoggedIn = require('./middleware/auth.js');
const userModel = require('./models/userModel.js');
const dbConnect = require('./config/db.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true
}))
dotenv.config();

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(500).send("Account Already Exists");
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    email, password: hash
                })
                let token = jwt.sign({ email, userid: user._id }, process.env.JWT_SECRET_KEY);
                res.cookie("token", token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).send("Registration Successful");
            })
        })
    };
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).send("User not found. Register first")
    }
    else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send("Error Comparing Passwords");
            }
            if (!result) {
                return res.status(401).send("Invalid Credentials");
            }
            let token = jwt.sign({ email, userid: user._id }, process.env.JWT_SECRET_KEY);
            res.cookie("token", token, { httpOnly: true, sameSite: 'lax', expires: new Date(Date.now()+ 7 * 24 * 60 * 60 * 1000) });
            return res.status(200).send("Login Successful");
        });
    };
});

app.post('/generate', isLoggedIn, async (req, res) => {

    const { group_type, budget_in_rupees, no_of_people, location, no_of_days } = req.body;
    try {
        const response = await axios.post(process.env.AI_BACKEND_URL, {
            group_type,
            budget_in_rupees,
            no_of_people,
            location,
            no_of_days,
        },
            {
                headers: { 'api-key': process.env.API_KEY }
            }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send("Error generating plan");
    }
});

app.listen(process.env.PORT || 3000, async () => {
    try {
        await dbConnect();
    } catch {
        return res.send("database error");
    }
});