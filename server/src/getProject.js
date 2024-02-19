const express = require("express");
const router = express.Router();
const pool = require('../db');
const {userAuth} = require("../middleware/auth");

router.get('/getProject/:id',userAuth, async (req, res)=>{
    const project = await pool.query("SELECT id, name, date_of_creation, user_id FROM PROJECT WHERE $1 = ANY(user_id)", [req.params.id]);
    if(project.rows.length == 0) {
        res.status(403).json({success: "No Project Yet"})
    }
    else {
        res.status(200).json({projects: project.rows});
    }
})


module.exports = router;