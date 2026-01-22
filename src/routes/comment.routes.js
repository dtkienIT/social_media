const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const verifyToken = require('../middlewares/auth.middleware'); // Sử dụng middleware xác thực của bạn

// 1. Gửi bình luận mới
// POST /api/comments
router.post('/', verifyToken, commentController.createComment);

// 2. Lấy danh sách bình luận của một bài viết cụ thể
// GET /api/comments/:postId
router.get('/:postId', commentController.getCommentsByPost);

// 3. Xóa bình luận
// DELETE /api/comments/:id
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;