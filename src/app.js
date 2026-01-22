require('dotenv').config(); // LUÔN Ở DÒNG 1
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import cấu hình DB và các Models đã thiết lập quan hệ
const { sequelize } = require('./config/db'); // Đảm bảo đường dẫn này đúng với file chứa sequelize.define
const { User, Post, Comment } = require('./models/index');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes'); 

const app = express();

// 1. Cấu hình Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Định nghĩa Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes); // Đăng ký route bình luận mới

// 3. Xử lý lỗi 404 cho Route không tồn tại
app.use((req, res) => {
    res.status(404).json({ message: "Route không tồn tại" });
});

// 4. Đồng bộ Database và Khởi động Server
// Sử dụng alter: true để Sequelize tự động tạo bảng Comments mới mà không mất dữ liệu cũ
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('✅ Database đã được đồng bộ kèm quan hệ mới (Comment, User, Post)');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Lỗi đồng bộ Database:', err);
  });