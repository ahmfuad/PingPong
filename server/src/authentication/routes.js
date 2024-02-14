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

router.post('/createproject', async (req, res) => {
    console.log(req.query);
    try {
        user_id = [];
        user_id = req.query.userID;
        nam = req.query.name;
        //name = req.query.name;
        date_of_creation = req.query.doc;
        visibility = req.query.visibility;
        //let { user_id, name, date_of_creation, visibility } = req.query;
        pool.query("INSERT INTO PROJECT (USER_ID, NAME, DATE_OF_CREATION, VISIBILITY) VALUES (($1), $2, $3, $4)", [user_id, nam, date_of_creation, visibility], (err, row) => {
            if (err) throw err;
            res.status(200).json({ status: 200, message: "Successfully Registered!" });
        });
    } catch (err) {
        if (err) throw err;
    }
});

router.put('/addauthor', async (req, res) => {
    try {
        const { user_id, project_id } = req.query; // Assuming you also have project_id
        
        // Check if project_id and user_id are provided
        if (!project_id || !user_id) {
            return res.status(400).json({ status: 400, message: 'Both project_id and user_id are required' });
        }
        // Update the user_id array in the Project table
        pool.query(
            "UPDATE Project SET user_id = array_append(user_id, $1) WHERE ID = $2",
            [user_id, project_id],
            (err, result) => {
                if (err) throw err;
                res.status(200).json({ status: 200, message: 'User added to project successfully' });
            }
        );
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});

router.post('/chat/send', (req , res) => {
    let {idFrom, idTo, message} = req.query;
    //let datetime = Date.now();
    //console.log(datetime);

    pool.query("INSERT INTO CHATUSER (message, datetime, sender, receiver) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)", [message, idFrom, idTo], (err, row) =>{
        if(err) throw err;
        res.status(200).json({success: "Message Sent Successfully!"});
    });
    
})

module.exports = router;
