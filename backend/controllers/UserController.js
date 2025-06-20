const cloudinary = require('../lib/cloudinary');
const { generateToken } = require('../lib/utils');
const User = require('../models/User');
const userModel = require('../models/User')
const bcrypt = require('bcryptjs');

const signup = async (req, res)=> {
    const {fullName, email, password, bio} = req.body;

    try{
        if(!fullName || !email || !password){
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists with this email"})
        }

        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hasedPassword,
            bio
        });

        const token = generateToken(newUser._id);
        return res.json({success: true, message: "Account created successfully", token, userData: newUser});
    } catch(error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        // Check if user exists first
        const userData = await User.findOne({email});
        if(!userData) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"});
        }
        
        const token = generateToken(userData._id);
        // FIX: Return token and userData in login response
        return res.json({success:true, message: "Login successful", token, userData});
    }catch(error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// Controller to check if the user is authenticated
const checkAuth = async (req, res) => {
    res.json({success: true, user:req.user});
}

const updateProfile = async (req, res) => {
    try{
        const {profilePic, bio, fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;

        // FIX: Correct the conditional logic - if NO profilePic, just update other fields
        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else {
            // If profilePic exists, upload to cloudinary then update
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser});
    } catch(error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

module.exports = {
    signup,
    login,
    checkAuth,
    updateProfile
}