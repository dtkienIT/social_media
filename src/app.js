require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
// Kết nối và đồng bộ Database
connectDB();

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tables synced'))
  .catch(err => console.log('❌ Sync error:', err));

  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});