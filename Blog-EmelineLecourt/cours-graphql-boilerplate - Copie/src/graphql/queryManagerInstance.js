import gql from "graphql-tag";
import graphqlClient from ".";

class QueryManager {
  async createPost(title, link) {
    const { data } = await graphqlClient.mutate({
      mutation: gql`
        mutation createPost($title: String!, $link: String!) {
          createPost(title: $title, link: $link) {
            title
            link
          }
        }
      `,
      variables: { title, link },
    });

    return data.createPost;
  }
  
  async getPosts() {
  const { data, error } = await graphqlClient.query({
    query: gql`
      query {
        posts{
          title
          link
          createdAt
          _id
        }
      }
    `,
  });

  return data.posts;
}

  async getPost(id) {
    const { data } = await graphqlClient.query({
      query: gql`
      query post{
        post(id: "${id}") {
          title
          link
          createdAt
          _id
        }
      }
      `,
    });
    return data.post;
  }
  async getPostComments(idPost) {
    const { data } = await graphqlClient.query({
      query: gql`
      query getPostComments {
        getPostComments(idPost: "${idPost}") {
          commentAuthor
          commentContent
          createdAt
          postId
          _id
        }
      }
      `,
    });
    console.log(data.getPostComments);

    return data.getPostComments;

  }
}

export default new QueryManager();
