<script setup>
import { onMounted, ref } from "vue";
import queryManagerInstance from "./graphql/queryManagerInstance";
import Post from "./components/Post.vue";
import { OverlappingFieldsCanBeMergedRule } from "graphql";
import { openDB } from 'idb';

const post = ref({
  title: "",
  link: "",
});

const posts = ref([]);

async function createPost() {
  await queryManagerInstance.createPost(
    post.value.title,
    post.value.link
  );
  post.value.title = "";
  post.value.link = "";
}

async function saveLater(post){
  const database = await openDB(
    //nom de la BDD
    //Version
    //options
    'offline-sync',
    1,
    {
      upgrade(db){
        db.createObjectStore('posts', {keyPath: 'id', autoIncrement: true})
      }
    }
  )
  await database.add('posts', post);

  const serviceWorker = await navigator.serviceWorker.ready;
  await serviceWorker.sync.register('sync-new-posts');
}

async function loadPosts() {
  posts.value = await queryManagerInstance.getPosts();
}

onMounted(() => {
  loadPosts();
});
</script>

<template>
  <header>
    <h1>Le Blog d'Emeline</h1>
  </header>

  <div class="create-post">
    <input v-model="post.title" class="input" type="text" placeholder="Titre" />
    <input v-model="post.link" class="input" type="text" placeholder="Contenu" />
    <button @click="createPost" class="button button-primary">Poster</button>
  </div>

  <div class="home">
    <div class="posts">
      <Post
        :post="post"
        v-for="post in posts"
        :key="post.key"
      />
    </div>
  </div>
</template>

<style scoped>
header {
  background: #7ebfe7;
  width: 100%;
  padding: 20px;
  align-items: center;
  text-align: center;
}

.buttons {
  margin-left: auto;
}

.button {
  margin-top: 10px;
  background: #7ebfe7;
}

.create-post {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
}

.input {
  margin: 5px 0;
  width: 50%;
}

.home {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
}
.posts {
  margin-top: 20px;
  width: 50%;
}
</style>
