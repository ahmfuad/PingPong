const express = require('express');
const pool = require('../db');

const jwt = require('jsonwebtoken');
const jwtSecret = "PingPong";


const bcrypt = require('bcryptjs');

const router = express.Router();


// function for page "api/login"
router.post("/login", async (req, res) => {
    try {
        //console.log(req.query);
        if(req.query.email === undefined || req.query.password === undefined) {
            return res.status(401).json({error: "Undefined behavior"});
        }
        const users = await pool.query("SELECT * FROM APPUSER WHERE email=$1::text", [req.query.email])
        //res.json({users: users.rows});
        if(users.rows.length!=0) {
            check = await bcrypt.compare(req.query.password, users.rows[0].password)
            if(check!=0) {
                const payload = {id: users.rows[0].id};
                const token_age = 3 * 60 * 60; // 3hrs in sec

                const token = jwt.sign(
                    payload,
                    jwtSecret,
                    {expiresIn: token_age} 
                );
                return res.status(200).json({success: "Login Successful!", user: users.rows[0].first_name, token});
            } 
            else {
                return res.status(401).json({error: "Invalid Email/Password"});
            }
        }
        else {
            return res.status(401).json({error: "Invalid Email/Password"});
        }
    }
    catch(err) {
        if(err) {
            return res.status(400).json({error: "Some Error Occurred!"});
        }
    }
});

module.exports = router;