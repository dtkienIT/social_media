const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const verifyToken = require('../middlewares/auth.middleware');
const uploadCloud = require('../middlewares/upload');

// Route này cần Đăng nhập (verifyToken) và có thể kèm Ảnh (uploadCloud)
router.post('/create', verifyToken, uploadCloud.single('image'), postController.createPost);
router.put('/:id/like', verifyToken, postController.likePost);
router.delete('/:id', verifyToken, postController.deletePost);
router.get('/all', postController.getAllPosts);

module.exports = router;