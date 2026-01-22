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

        const userId = req.user.id; // Lấy từ token xác thực
        let currentLikes = post.likes || [];

        if (currentLikes.includes(userId)) {
            // Đã like rồi -> Unlike
            currentLikes = currentLikes.filter(id => id !== userId);
        } else {
            // Chưa like -> Thêm like
            currentLikes.push(userId);
        }

        await post.update({ likes: currentLikes });
        res.json({ message: "Thành công", likes: currentLikes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

        // Kiểm tra quyền sở hữu
        if (post.userId !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
        }

        await post.destroy();
        res.json({ message: "Xóa bài viết thành công" });
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

exports.updateProfile = async (req, res) => {
    try {
        const { fullName } = req.body;
        const userId = req.user.id; // Lấy từ middleware verifyToken
        
        let updateData = { fullName };

        // Nếu người dùng có gửi file ảnh mới
        if (req.file) {
            updateData.avatar = req.file.path; // URL ảnh từ Cloudinary hoặc đường dẫn file
        }

        const updatedUser = await User.update(updateData, { where: { id: userId } });
        res.json({ message: "Cập nhật thành công!", avatar: updateData.avatar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};