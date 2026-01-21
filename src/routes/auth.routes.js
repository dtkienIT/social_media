const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const uploadCloud = require('../middlewares/upload');

router.post('/register', uploadCloud.single('avatar'), authController.register);
router.post('/register', register);
router.post('/login', login);

module.exports = router;