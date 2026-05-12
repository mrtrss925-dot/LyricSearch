<script setup>
import { ref } from 'vue';
import db from '@/firestore';
import router from '@/router';

const username = ref("");
const password = ref("");
const messages = ref([]);
const loginLoading = ref(undefined);

async function login() {
  if (!username.value || !password.value) {
    messages.value.push({ text: "Username e password sono obbligatori", color: 'error' });
    return;
  }
  loginLoading.value = "blue";
  try {
    let loggedUser = await db.verificaLogin(username.value, password.value);
    db.setUser(loggedUser.username);
    router.push("/");
  } catch (e) {
    messages.value.push({ text: e.message, color: 'error' });
  } finally {
    loginLoading.value = undefined;
  }
}
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 80vh;">
    <v-sheet class="mx-auto py-8 px-10" width="450" elevation="4" rounded="lg">
      <div class="text-center mb-6">
        <v-icon icon="mdi-music-note" size="48" color="blue-darken-3"></v-icon>
        <h1 class="text-h5 mt-2">LyricSearch</h1>
        <p class="text-medium-emphasis">Accedi al tuo account</p>
      </div>
      <v-form @submit.prevent="login">
        <v-text-field
          :disabled="loginLoading ? true : false"
          v-model.trim="username"
          label="Username"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          class="mb-2"
        ></v-text-field>
        <v-text-field
          :disabled="loginLoading ? true : false"
          type="password"
          v-model.trim="password"
          label="Password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-btn :loading="loginLoading" color="blue-darken-3" type="submit" block size="large">
          Login
        </v-btn>
      </v-form>
    </v-sheet>
  </v-container>
  <v-snackbar-queue v-model="messages" :total-visible="5" closable></v-snackbar-queue>
</template>
