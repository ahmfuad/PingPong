const express = require("express");
const router = express.Router();
const pool = require('../db');
const {userAuth} = require("../middleware/auth");

router.get('/files/:id', userAuth, async (req, res)=>{
    const file = await pool.query("SELECT * FROM fileproject WHERE id=$1", [req.params.id]);
    if(file.rows.length === 0) {
        res.status(200).json({success: "No such Folder!"})
    }
    else if(file.rows.length > 1) {
        res.status(400).json({success: "Folder Error!"})
    }
    else {
        res.status(200).json({file: file.rows});
    }
})


module.exports = router;