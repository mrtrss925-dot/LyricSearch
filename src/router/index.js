import { createRouter, createWebHistory } from "vue-router";
import db from "@/firestore";

import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Song from "@/views/Song.vue";
import Favourites from "@/views/Favourites.vue";
import Profile from "@/views/Profile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home, name: "Home" },
    { path: "/song/:trackId", component: Song, props: true, name: "Song" },
    { path: "/favourites", component: Favourites, name: "Favourites" },
    { path: "/profile", component: Profile, name: "Profile" },
    { path: "/login", component: Login, name: "Login" },
  ],
});

router.beforeEach(function (to) {
  if (!db.isAuthenticated() && to.name !== "Login") {
    return { name: "Login" };
  }
  if (db.isAuthenticated() && to.name === "Login") {
    return { name: "Home" };
  }
});

export default router;
