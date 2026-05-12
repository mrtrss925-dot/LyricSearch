<script setup>
import { onMounted, ref } from 'vue';
import db from "@/firestore";
import router from './router';

const drawer = ref(true);
const authenticated = ref(false);

router.afterEach(function () {
  authenticated.value = db.isAuthenticated();
});

onMounted(function () {
  authenticated.value = db.isAuthenticated();
});

function logout() {
  db.logout();
  router.push("/login");
}
</script>

<template>
  <v-layout>
    <v-navigation-drawer v-if="authenticated" color="blue-darken-4" permanent v-model="drawer">
      <v-list nav>
        <v-list-item link to="/" prepend-icon="mdi-home" title="Home" base-color="white"></v-list-item>
        <v-list-item link to="/favourites" prepend-icon="mdi-heart" title="Preferiti" base-color="white"></v-list-item>
        <v-list-item link to="/profile" prepend-icon="mdi-account" title="Profilo" base-color="white"></v-list-item>
      </v-list>
      <template v-slot:append>
        <v-divider color="white"></v-divider>
        <v-list-item @click="logout" prepend-icon="mdi-logout" title="Logout" base-color="white" link></v-list-item>
      </template>
    </v-navigation-drawer>

    <v-app-bar :order="-1" color="blue-darken-3" flat>
      <v-app-bar-nav-icon v-if="authenticated" variant="text" color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-white">
        <v-icon icon="mdi-music-note" class="me-2"></v-icon>
        Music Finder
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <div class="ma-6">
        <RouterView></RouterView>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
