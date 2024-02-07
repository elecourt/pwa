const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new Schema({
  commentContent: {
    type: String,
    required: true
  },
  commentAuthor: {
    type: String,
    required: false
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,ref:'Post',
    required: true
  },

},
{
  timestamps: true
}
);
module.exports = mongoose.model('Comment', commentSchema);