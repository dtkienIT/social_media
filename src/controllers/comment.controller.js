const { Comment, User } = require('../models/index');

// 1. Tạo bình luận mới
exports.createComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user.id; // Lấy từ verifyToken middleware

        if (!content) {
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }

        // Lưu vào database
        const newComment = await Comment.create({
            content,
            postId,
            userId
        });

        // Sau khi tạo, lấy lại thông tin comment kèm User để Frontend hiển thị ngay
        const commentData = await Comment.findByPk(newComment.id, {
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['fullName', 'avatar'] // Chỉ lấy thông tin cần thiết
                }
            ]
        });

        res.status(201).json(commentData);
    } catch (error) {
        console.error("Lỗi createComment:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Lấy tất cả bình luận của một bài viết
exports.getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['fullName', 'avatar']
                }
            ],
            order: [['createdAt', 'ASC']] // Bình luận cũ trước, mới sau
        });

        res.json(comments);
    } catch (error) {
        console.error("Lỗi getCommentsByPost:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Xóa bình luận (Chỉ chủ nhân bình luận mới được xóa)
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        // Kiểm tra quyền sở hữu tương tự như xóa bài viết
        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
        }

        await comment.destroy();
        res.json({ message: "Xóa bình luận thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};