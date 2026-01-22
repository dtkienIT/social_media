const { User, Post, Comment } = require('../models/index');

// 1. Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user.id;

    let updateData = {};
    if (fullName) updateData.fullName = fullName;
    
    // Lưu URL từ Cloudinary vào Database
    if (req.file) {
      updateData.avatar = req.file.path; 
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có thông tin nào để cập nhật" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    await user.update(updateData);

    res.json({
      message: "Cập nhật thành công!",
      user: {
        id: user.id,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Lỗi updateProfile:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật profile" });
  }
};

// 2. Lấy thông tin cơ bản của User (Để hiện tên và ảnh trên trang Profile)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Post,
                // Lấy cả bình luận của từng bài viết
                include: [{ 
                    model: Comment, 
                    include: [{ model: User, attributes: ['fullName', 'avatar'] }] 
                }],
                order: [['createdAt', 'DESC']]
            }]
        });

        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        // Tính tổng số like từ tất cả bài viết của User này
        const totalLikes = user.Posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);

        res.json({ user, totalLikes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Lấy danh sách bài viết của User
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.userId },
      include: [{ 
        model: User, 
        attributes: ['fullName', 'avatar'] 
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error("Lỗi getUserPosts:", error);
    res.status(500).json({ error: error.message });
  }
};