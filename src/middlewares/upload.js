const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Thêm thư viện fs (File System)

const uploadDir = 'uploads/facebook_clone_uploads/';

// Kiểm tra nếu thư mục chưa tồn tại thì tạo mới
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;