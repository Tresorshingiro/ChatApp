const express = require('express');
const { getUsersForSiderbar, getMessages, markMessageAsSeen, sendMessage } = require('../controllers/messageController');
const { protectRoute } = require('../middleware/auth');

const router = express.Router();

router.get('/users', protectRoute, getUsersForSiderbar)

router.get('/:id', protectRoute, getMessages)

router.put('/mark/:id', protectRoute, markMessageAsSeen)

router.post('/:id', protectRoute, sendMessage)

module.exports = router;