<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ListaCanzoni from '@/components/ListaCanzoni.vue';

const searchQuery = ref("");
const results = ref([]);
const loading = ref(false);
const searched = ref(false);
const messages = ref([]);

async function search() {
  if (!searchQuery.value.trim()) return;
  loading.value = true;
  searched.value = true;
  results.value = [];
  try {
    const response = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: searchQuery.value,
        entity: "song",
        limit: 20,
        media: "music"
      }
    });
    results.value = response.data.results;
    if (results.value.length === 0) {
      messages.value.push({ text: "Nessun risultato trovato", color: 'info' });
    }
  } catch (e) {
    messages.value.push({ text: "Errore nella ricerca. Riprova.", color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1 class="text-h4 mb-6">
    <v-icon icon="mdi-magnify" class="me-2"></v-icon>
    Cerca una canzone
  </h1>

  <v-row class="mb-6">
    <v-col cols="12" md="8">
      <v-text-field
        v-model="searchQuery"
        label="Artista, canzone o album..."
        variant="outlined"
        prepend-inner-icon="mdi-music-note"
        clearable
        @keyup.enter="search"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="4">
      <v-btn
        color="blue-darken-3"
        size="large"
        block
        :loading="loading"
        @click="search"
        prepend-icon="mdi-magnify"
      >
        Cerca
      </v-btn>
    </v-col>
  </v-row>

  <div v-if="loading" class="text-center py-10">
    <v-progress-circular indeterminate color="blue-darken-3" size="64"></v-progress-circular>
  </div>

  <div v-else-if="searched && results.length === 0 && !loading" class="text-center py-10 text-medium-emphasis">
    <v-icon icon="mdi-music-off" size="64"></v-icon>
    <p class="mt-4 text-h6">Nessun risultato trovato</p>
  </div>

  <lista-canzoni v-else :canzoni="results"></lista-canzoni>

  <v-snackbar-queue v-model="messages" :total-visible="3" closable></v-snackbar-queue>
</template>
