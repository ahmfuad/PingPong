const { Router } = require('express');

const bcrypt = require('bcrypt');
const router = Router();
const pool = require('../../db');


router.post('/register', async (req, res) => {
    try{
        let {firstName, lastName, dob, mobile, bio, password, address, email, image} = req.query;
        const val = await pool.query("SELECT * FROM APPUSER WHERE email=$1::text", [email]);
        if(val.rows.length>0) {
            res.status(401).json({error: "Email is used!"});
            return;
        }
        password = await bcrypt.hash(password, 10);
        //console.log(password);
        var mob = [];
        mob[0]=mobile;
        pool.query("INSERT INTO APPUSER (first_name, last_name, date_of_birth, mobile_no, bio, password, address, email, image) VALUES ($1, $2, $3::date, $4::int[], $5, $6, $7::character(255), $8, &9::character(255))", [firstName, lastName, dob, mob, bio, password, address, email, image], ( err , row)=>{
            if(err) throw err;
            res.status(200).json({status: 200, message: "Successfully Registered!"});
        });
    }
    catch(err) {
        if(err) throw err;
    }
});

router.post('/login', async (req, res) => {
    try {
        //console.log(req.query);
        const users = await pool.query("SELECT * FROM APPUSER WHERE email=$1::text", [req.query.email])
        //res.json({users: users.rows});
        if(users.rows.length!=0) {
            check = await bcrypt.compare(req.query.password, users.rows[0].password)
            if(check!=0) {
                return res.status(200).json({success: "Login Successful!"});
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
        if(err) throw err;
    }
    //res.send("Give Username Password!");
});

router.put('/update', async (req, res) => {
    console.log(req.query);
    try {
        let {firstName, lastName, dob, mobile, image, bio, password, address, email} = req.query;
        const val = await pool.query("SELECT * FROM APPUSER WHERE email=$1::text", [email]);
        if(val.rows.length==0) {
            res.status(401).json({error: "Email is not registered!"});
            return;
        }
        password = await bcrypt.hash(password, 10);
        var mob = [];
        mob[0]=mobile;
        pool.query("UPDATE APPUSER SET first_name=$1, last_name=$2, date_of_birth=$3::date, mobile_no=$4::int[], image=$5::character(255), bio=$6, password=$7, address=$8::character(255) WHERE email=$9", [firstName, lastName, dob, mob, image, bio, password, address, email], ( err , row)=>{
            if(err) throw err;
            res.status(200).json({status: 200, message: "Successfully Updated!"});
        });
    }
    catch(err) {
        if(err) throw err;
    }
});

module.exports = router;