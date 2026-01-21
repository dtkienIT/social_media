const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const newPost = await Post.create({
            content,
            image: imageUrl,
            userId: req.user.id // Lấy từ Token đã verify
        });

        res.status(201).json({
            message: 'Đăng bài thành công!',
            post: newPost
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};