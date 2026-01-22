const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment'); // Model bạn vừa tạo

// --- QUAN HỆ USER - POST ---
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// --- QUAN HỆ USER - COMMENT ---
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// --- QUAN HỆ POST - COMMENT ---
// Khi xóa bài viết (Post), tất cả bình luận (Comment) liên quan sẽ bị xóa theo (CASCADE)
Post.hasMany(Comment, { foreignKey: 'postId', as: 'postComments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = {
  User,
  Post,
  Comment
};