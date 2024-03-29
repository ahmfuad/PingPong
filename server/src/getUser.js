const express = require("express");
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const jwtSecret = "PingPong";
const {userAuth} = require("../middleware/auth");

router.get('/getUser/:id', userAuth, async (req, res) => {
    const id = req.params.id;
    const user = await pool.query("SELECT * FROM APPUSER WHERE id=$1", [id])
    if(user.rows[0].length==0) {
        return res.status(403).json({Error: "No Such User"})
    }
    else return res.status(200).json({user: user.rows[0]})
})


module.exports = router;