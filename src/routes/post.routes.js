const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const verifyToken = require('../middlewares/auth.middleware');
const uploadCloud = require('../middlewares/upload');

// Route này cần Đăng nhập (verifyToken) và có thể kèm Ảnh (uploadCloud)
router.post('/create', verifyToken, uploadCloud.single('image'), postController.createPost);
router.get('/all', postController.getAllPosts);
router.put('/:id/like', verifyToken, postController.likePost);
router.get('/user/:userId', postController.getUserPosts);

module.exports = router;