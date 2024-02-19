const express = require("express");
const router = express.Router();
const pool = require('../db');
const {userAuth} = require("../middleware/auth");

router.get('/blog/:id',userAuth, async (req, res)=>{
    const blog = await pool.query("SELECT * FROM BLOGS WHERE id=$1", [req.params.id]);
    if(blog.rows.length == 0) {
        res.status(403).json({error: "No SUCH BLOG!"})
    }
    else {
        res.status(200).json({Blog: blog.rows});
    }
})


module.exports = router;