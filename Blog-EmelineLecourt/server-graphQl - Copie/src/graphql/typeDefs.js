const gql = require("graphql-tag");

const typeDefs = gql`
scalar Date
  type Query {
    post(id: ID): Post
    getPostComments(idPost: ID!): [Comment!]!
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    title: String!
    author: String!
    link: String!
    createdAt: Date!
    comments: [Comment!]!
    _id: ID!
  }

  type Comment {
    commentContent: String
    commentAuthor: String
    postId: ID
    _id: ID!
    createdAt: Date!
  }

  type Mutation {
    createPost(title: String, author: String, link: String) : Post
    deletePost(id: ID) : Post
    updatePost(id: ID, title: String, author: String, link: String) : Post
    createComment(commentContent: String, commentAuthor: String, postId: ID) : Comment
    deleteComment(id: ID) : Comment
    updateComment(id: ID, commentContent: String, commentAuthor: String) : Comment
  }
`;

module.exports = { typeDefs };
