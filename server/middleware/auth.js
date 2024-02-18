const jwt = require('jsonwebtoken');
const jwtSecret = "PingPong";

exports.adminAuth = (req, res, next) => {
    try {
        const token = req.header('token');

        if(token){

            console.log("token: " + token);

            jwt.verify(token, jwtSecret, (err, decodedToken) => {
                if(err){
                    return res.status(401).json({message: "Not Authorized"});
                }
                else {
                    if(decodedToken.role !== "Admin") {
                        return res.status(401).json({message: "Not Authorized"});
                    }
                    else{
                    req.session.user = decodedToken;
                        next();
                    }
                }
            })
        }
        else {
            return res.status(401).json({message: "Not authorized, token not available"});
        }
    } catch (error) {
        console.log("Token not found yet");
    }
    
}


exports.userAuth = (req, res, next) => {
    try {
        console.log(req.headers['token']);
        const token = req.header('token');

        if(token){

            console.log("token: " + token);

            jwt.verify(token, jwtSecret, (err, decodedToken) => {
                if(err){
                    return res.status(401).json({message: "Not Authorized"});
                }
                else {
                    
                        req.session.user = decodedToken;
                        next();
                    
                }
            })
        }
        else {
            console.log("Empty token");
            return res.status(401).json({message: "Not authorized, token not available"});
        }

    } catch (error) {
        console.log("Token not found yet");
    }
    
}

exports.generalAuth = (req, res, next) => {
    try {
        // console.log("mytoken", req.header('token'));
        const token = req.header('token');

        if(token){

            console.log("token: " + token);
            
            jwt.verify(token, jwtSecret, (err, decodedToken) => {
                if(err){
                    return res.status(401).json({message: "Not Authorized"});
                }
                else {
                        req.session.user = decodedToken;
                        next();
                }
            })
        }
        else {
            console.log("Not authorized, token not available");
            return res.status(401).json({message: "Not authorized, token not available"});
        }
    } catch (error) {
        console.log("Token not found yet");
    }
}