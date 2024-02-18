const express = require("express");
const router = express.Router();

// const {adminAuth} = require("../middleware/auth");

// the collection that will be needed
// const User = require("../models/user.model");

const logout = (req, res) => {
  
    console.log("in logout");
    req.session.destroy();
    res.json({message: "Logout Successful"});
}

router.get('/logout', logout);

module.exports = router;