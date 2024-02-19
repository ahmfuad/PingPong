const express = require("express");
const router = express.Router();
const pool = require('../db');
const {userAuth} = require("../middleware/auth");

router.get('/chat/:from/:to',userAuth, async (req, res)=>{
    pool.query("SELECT datetime, message FROM CHATUSER WHERE sender=$1 AND receiver=$2 ORDER BY datetime ASC", [req.params.from, req.params.to], (err, row)=>{
        if(err) {
            
            res.status(400).json({error: "Something Went Wrong!"});
            throw err;
        }
        else {
            if(row.rows.length==0) {
                res.status(403).json({error: "No messagaes!"});
            }
            else {
                res.status(200).json({messages: row.rows})
            }
        }
    })
    
})


module.exports = router;