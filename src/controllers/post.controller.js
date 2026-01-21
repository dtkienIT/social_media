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

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['fullName', 'avatar'] // Chỉ lấy tên và ảnh, không lấy mật khẩu
                }
            ],
            order: [['createdAt', 'DESC']] // Bài mới nhất hiện lên đầu
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

        let currentLikes = post.likes || [];
        const userId = req.user.id;

        if (currentLikes.includes(userId)) {
            // Nếu đã like rồi thì Unlike (Xóa ID khỏi mảng)
            currentLikes = currentLikes.filter(id => id !== userId);
        } else {
            // Nếu chưa like thì thêm ID vào mảng
            currentLikes.push(userId);
        }

        await post.update({ likes: currentLikes });
        res.json({ message: "Thao tác thành công", totalLikes: currentLikes.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.params.userId },
            include: [{ model: User, attributes: ['fullName', 'avatar'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};