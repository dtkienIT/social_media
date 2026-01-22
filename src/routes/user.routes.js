const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload'); // File này bạn đã có trong ảnh

// Định nghĩa link: PUT /api/users/update
router.put('/update', authMiddleware, upload.single('avatar'), userController.updateProfile);
router.get('/user/:userId', userController.getUserPosts);

module.exports = router;