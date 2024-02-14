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
        const project_id = await pool.query("INSERT INTO PROJECT (USER_ID, NAME, DATE_OF_CREATION, VISIBILITY) VALUES (($1), $2, CURRENT_DATE, $3) returning id", [user_id, nam, visibility]);
        const folder_id = await pool.query("INSERT INTO FOLDER (NAME) VALUES ($1) RETURNING ID", [nam+"-root"]);
        pool.query("update project set folder_id = $1 where id = $2", [folder_id.rows[0].id, project_id.rows[0].id]);
        console.log(folder_id.rows[0].id);
        console.log(project_id.rows[0].id);
        return res.status(200).json({success: "Project Created"});
    } catch (err) {
        if (err) throw err;
    }
});

router.post('/createfolder', async (req, res) => {
    try {
        let { name, project_id, parent_id } = req.query;
        const folder_id = await pool.query("INSERT INTO FOLDER (NAME, PROJECT_ID, prevFolderID) VALUES ($1, $2, $3) RETURNING ID", [name, project_id, parent_id]);
        pool.query("UPDATE FOLDER SET nextFolderID = ARRAY_APPEND(nextFolderID, $1) WHERE ID = $2", [folder_id.rows[0].id, parent_id]);
        return res.status(200).json({success: "Folder Created"});
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
});

router.get('/chat/get', (req, res) => {
    let {idFrom, idTo} = req.query;
    pool.query("SELECT * FROM CHATUSER WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1) ORDER BY datetime", [idFrom, idTo], (err, row) =>{
        if(err) throw err;
        res.status(200).json({messages: row.rows});
    });
});

router.post('/createfile', async (req, res) => {
    console.log(req.query);
    try {
        let { name, folder_id, file_type, blob } = req.query;
        pool.query("INSERT INTO FILEPROJECT (NAME, FOLDER_ID, EXTENSION, blob) VALUES ($1, $2, $3, $4)", [name, folder_id, file_type, blob], (err, row) => {
            if (err) return res.status(201).json({error: "File Couldn't Add"});;
        });
        return res.status(200).json({success: "File Added"});
    } catch (err) {
        if (err) throw err;
    }
});

router.get('/searchuser', async (req, res) => {
    try {
        // Add wildcard (%) to both sides of the search string to perform substring matching
        const searchName = req.query.name;

        // Modify the SQL query to perform case-insensitive and gap-insensitive searching
        const users = await pool.query(
            "SELECT * FROM APPUSER WHERE lower(trim(first_name) || trim(last_name)) LIKE lower(trim($1))::text",
            [searchName]
        );

        res.json({ users: users.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/searchproject', async (req, res) => {
    try {
        // Add wildcard (%) to both sides of the search string to perform substring matching
        const searchName = req.query.name;

        // Modify the SQL query to perform case-insensitive and gap-insensitive searching
        const users = await pool.query(
            "SELECT * FROM project WHERE lower(name) LIKE lower(trim($1))::text",
            [searchName]
        );

        res.json({ users: users.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
