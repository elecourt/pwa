const { timeStamp } = require("console");
const Comment  = require("../models/comment.js");
const Post = require("../models/post.js");

const resolvers = {
  Query: {
    async post(parent, args) {
      const {id} = args
      return await Post.findOne({_id: id})
    },

    getPostComments: async (_, { idPost }) => {
      const postId = idPost;
      return await Comment.find({postId: postId});
    },
    
    posts: async(parent, args) => {
      return await Post.find();
    },
    
    comments: async(parent, args) => {
      return await Comment.find();
    }
  },
  Mutation: {
     createPost: async (parent, args) => {
      const { title, link} = args;
      const post = new Post({ title, link});
      await post.save();
      return post;
    },
    deletePost: async (parent, args) => {
      const { id} = args;
      const deletePost = await Post.findByIdAndDelete({_id: id});
      return deletePost;
    },
    updatePost: async (parent, args) => {
      const { id, title, author, link} = args;
      const updatePost = Post.updateOne({ _id: id, title, author, link});
      return updatePost;
    },
    createComment: async (parent, args) => {
      const { commentContent, commentAuthor, postId} = args;
      const comment = new Comment({ commentContent, commentAuthor, postId});
      await comment.save();
      return comment;
    },
    deleteComment: async (parent, args) => {
      const { id} = args;
      const deleteComment = await Comment.findByIdAndDelete({_id: id});
      return deleteComment;
    },
    updateComment: async (parent, args) => {
      const { id, commentContent, commentAuthor} = args;
      const updateComment = Comment.updateOne({ _id: id, commentContent, commentAuthor});
      return updateComment;
    },
  },
};

module.exports = { resolvers };
