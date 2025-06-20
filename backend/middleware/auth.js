const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectRoute = async (req, res, next) => {
    try{
        const token = req.headers.token;
        
        // FIX 1: Check if token exists
        if(!token) {
            return res.status(401).json({success: false, message: "No token provided"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            // FIX 2: Fixed typo - "sucess" should be "success"
            return res.status(401).json({success: false, message: "User not found"});
        }

        req.user = user;
        next();

    } catch(error) {
        console.log("Auth middleware error:", error);
        
        // FIX 3: Handle different JWT errors more specifically
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({success: false, message: "Invalid token"});
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({success: false, message: "Token expired"});
        } else {
            return res.status(401).json({success: false, message: "Unauthorized access"});
        }
    }
}

module.exports = {
    protectRoute
};