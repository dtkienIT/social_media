const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Nếu có file gửi lên, lấy URL từ Cloudinary, nếu không dùng ảnh mặc định
    const avatarUrl = req.file ? req.file.path : 'https://bit.ly/default-avatar';

    const newUser = await User.create({
      fullName,
      email,
      password,
      avatar: avatarUrl // Lưu link ảnh vào Postgres
    });

    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, fullName: user.fullName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};