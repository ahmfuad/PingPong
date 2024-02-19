const { Router } = require('express');

const bcrypt = require('bcrypt');
const router = Router();
const pool = require('../../db');


router.post('/register', async (req, res) => {
    try{
        let {firstName, lastName, dob, mobile, bio, password, address, email, image} = req.query;
        if(firstName === undefined || lastName === undefined || mobile === undefined || password === undefined || email===undefined) {
            return res.status(400).json({error: "Undefined behavior"});
        }
        const val = await pool.query("SELECT * FROM APPUSER WHERE email=$1::text", [email]);
        if(val.rows.length>0) {
            res.status(401).json({error: "Email is used!"});
            return;
        }
        password = await bcrypt.hash(password, 10);
        //console.log(password);
        var mob = [];
        mob[0]=mobile;
        pool.query("INSERT INTO APPUSER (first_name, last_name, date_of_birth, mobile_no, bio, password, address, email, image) VALUES ($1, $2, $3::date, $4::int[], $5, $6, $7::character(255), $8, $9::character(255))", [firstName, lastName, dob, mob, bio, password, address, email, image], ( err , row)=>{
            if(err) {
                console.log(err);
                throw err;
            }
            res.status(200).json({status: 200, message: "Successfully Registered!"});
        });
    }
    catch(err) {
        if(err) throw err;
    }
});


router.put('/update', async (req, res) => {
    //console.log(req.query);
    try {
        let {firstName, lastName, dob, mobile, image, bio, password, address, email} = req.query;
        if(firstName === undefined || lastName === undefined || mobile === undefined || password === undefined || email===undefined) {
            return res.status(400).json({error: "Undefined behavior"});
        }
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
    //console.log(req.query);
    try {
        user_id = [];
        user_id = req.query.userID;
        nam = req.query.name;
        //name = req.query.name;
        date_of_creation = req.query.doc;
        visibility = req.query.visibility;
        if(user_id === undefined || nam=== undefined || date_of_creation === undefined || visibility === undefined) {
            return res.status(403).json({error: "Undefined behavior"});
        }
        //let { user_id, name, date_of_creation, visibility } = req.query;
        const project_id = await pool.query("INSERT INTO PROJECT (USER_ID, NAME, DATE_OF_CREATION, VISIBILITY) VALUES (($1), $2, CURRENT_DATE, $3) returning id", [user_id, nam, visibility]);
        const folder_id = await pool.query("INSERT INTO FOLDER (NAME) VALUES ($1) RETURNING ID", [nam+"-root"]);
        console.log(folder_id.rows[0].id);
        console.log(project_id.rows[0].id);
        pool.query("update project set folder_id = $1 where id = $2", [folder_id.rows[0].id, project_id.rows[0].id], (err, row)=>{
            if(err) {
                console.log(err)
                res.status(400).json({error: "Something Not working"});
            }
            else {
                console.log(folder_id.rows[0].id);
                console.log(project_id.rows[0].id);
                return res.status(200).json({success: "Project Created"});
            }
        });
        
    } catch (err) {
        if (err) throw err;
    }
});

router.post('/createfolder', async (req, res) => {
    try {
        let { name, user_id, project_id, parent_id } = req.query;
        if(name === undefined || user_id === undefined || project_id === undefined) {
            return res.status(401).json({error: "Undefined behavior"});
        }
        let valid = 0;
        const allRows = await pool.query("SELECT * FROM PROJECT WHERE id=$1", [project_id]);
        if(Object.values(allRows.rows[0].user_id).indexOf((+user_id))>-1) {
            valid = 1;
        }

        if(valid !== 1) {
            return res.status(201).json({error: "Access Denied!"});
        }
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
            return res.status(403).json({ status: 400, message: 'Both project_id and user_id are required' });
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

router.post('/chat/send', async (req , res) => {
    let {idFrom, idTo, message} = req.query;
    //let datetime = Date.now();
    //console.log(datetime);
    if(idFrom === undefined || idTo === undefined || message === undefined) {
        return res.status(400).json({error: "Undefined behavior"});
    }
    pool.query("INSERT INTO CHATUSER (message, datetime, sender, receiver) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)", [message, idFrom, idTo], (err, row) =>{
        if(err) throw err;
        res.status(200).json({success: "Message Sent Successfully!"});
    });
    
})


// https://github.com/markedjs/marked will be using this to render
router.post('/blogs/create', async (req, res)=>{
    let {title, user_id, maintext} = req.query;
    if(title === undefined || user_id === undefined || maintext === undefined) {
        return res.status(400).json({error: "Undefined behavior"});
    }
    //console.log(text)
    pool.query("INSERT INTO blogs (title, user_id, maintext, posttime) VALUES ($1,$2,$3, CURRENT_TIMESTAMP)", [title, user_id, maintext], (err, row) => {
        if(err) throw err;
        res.status(200).json({success: "Blog Created Successfully!"});
    });
})

router.post('/blogs/update/:id',async (req, res) => {
    let {title, user_id, maintext} = req.query;
    //if()
    const id = req.params.id;
    //console.log(id, title, main)
    if(id === undefined || title === undefined || maintext === undefined || user_id === undefined) {
        return res.status(400).json({error: "Undefined behavior"});
    }
    pool.query("UPDATE blogs SET title=$1, maintext=$2, posttime = CURRENT_TIMESTAMP WHERE id=$3", [title, maintext, id], (err, row)=>{
        if(err) throw err;
        res.status(200).json({success: "Blog Updated Successfully!"});
    })
})

router.post('/blogreply', async (req, res) => {
    //console.log(req.query);
    try {
        blog_id = req.query.blog_id;
        user_id = req.query.user_id;
        message = req.query.message;
        try {
            reply_id = req.query.reply_id;
        }
        catch(err) {
            reply_id = null;
        }
        if(!reply_id) {
            pool.query("INSERT INTO REPLY (BLOG_ID, USER_ID, MESSAGE, COMMENT01) VALUES ($1, $2, $3, 1)", [blog_id, user_id, message]);
        }
        else
        {
            pool.query("INSERT INTO REPLY (BLOG_ID, USER_ID, MESSAGE, reply_id, COMMENT01) VALUES ($1, $2, $3, $4, 0)", [blog_id, user_id, message, reply_id]);

        }
        return res.status(200).json({success: "Reply Added"});
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;