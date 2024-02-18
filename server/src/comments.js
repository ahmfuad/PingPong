const express = require("express");
const router = express.Router();
const pool = require('../db');
const {userAuth} = require("../middleware/auth");

router.get('/comments/:blogId', userAuth, async (req, res)=>{
    const comments = await pool.query("SELECT * FROM reply WHERE blog_id=$1", [req.params.blogId]);
    if(comments.rows.length == 0) {
        res.status(200).json({success: "No comments!"})
    }
    else {
        res.status(200).json({Comment: comments.rows});
    }
})


module.exports = router;