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
        // Sử dụng userId để khớp với params từ Route
        const id = req.params.userId || req.params.id; 

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Post,
                include: [{ 
                    model: Comment, 
                    // Bỏ 'as' nếu bạn đã bỏ alias trong index.js như hướng dẫn trước
                    include: [{ model: User, attributes: ['fullName', 'avatar'] }] 
                }]
            }],
            // Order phải nằm ở cấp độ của Model mà bạn muốn sắp xếp
            order: [[Post, 'createdAt', 'DESC']] 
        });

        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        // Phải dùng user.Posts (viết hoa chữ P) vì Sequelize mặc định viết hoa tên Model trong mảng include
        const posts = user.Posts || [];
        const totalLikes = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);

        res.json({ 
            user: {
                id: user.id,
                fullName: user.fullName,
                avatar: user.avatar,
                // Trả về posts ở đây để Frontend dễ xử lý
                posts: posts 
            }, 
            totalLikes 
        });
    } catch (error) {
        console.error("Lỗi Controller:", error);
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