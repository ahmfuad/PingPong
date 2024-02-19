const express = require("express");
const router = express.Router();
const pool = require('../db');
const {userAuth} = require("../middleware/auth");

router.get('/folders/:id', userAuth, async (req, res)=>{
    const folder = await pool.query("SELECT * FROM folder WHERE id=$1", [req.params.id]);
    if(folder.rows.length === 0) {
        res.status(403).json({success: "No such Folder!"})
    }
    else if(folder.rows.length > 1) {
        res.status(400).json({success: "Folder Error!"})
    }
    else {
        res.status(200).json({folder: folder.rows});
    }
})


module.exports = router;