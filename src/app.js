require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const path = require('path');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Để hiển thị được ảnh trên trình duyệt
app.use('/uploads', express.static('uploads'));

// Kết nối và đồng bộ Database
connectDB();

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tables synced'))
  .catch(err => console.log('❌ Sync error:', err));

  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://render:${PORT}`);
});