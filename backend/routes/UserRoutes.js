const express = require('express');
const { signup, login, updateProfile, checkAuth } = require('../controllers/UserController');
const { protectRoute } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.put('/update-profile', protectRoute, updateProfile)

router.get('/check', protectRoute, checkAuth)

module.exports = router;