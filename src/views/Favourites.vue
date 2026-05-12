<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import db from '@/firestore';
import ListaCanzoni from '@/components/ListaCanzoni.vue';

const canzoni = ref([]);
const loading = ref(true);

onMounted(async function () {
  loading.value = true;
  try {
    const ids = await db.getPreferiti();
    if (ids.length === 0) {
      loading.value = false;
      return;
    }
    // iTunes lookup accetta max ~200 id
    const response = await axios.get("https://itunes.apple.com/lookup", {
      params: { id: ids.join(",") }
    });
    canzoni.value = response.data.results.filter(r => r.wrapperType === "track");
  } catch (e) {
    // silenzioso
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1 class="text-h4 mb-6">
    <v-icon icon="mdi-heart" color="red" class="me-2"></v-icon>
    I miei preferiti
  </h1>

  <div v-if="loading" class="text-center py-10">
    <v-progress-circular indeterminate color="blue-darken-3" size="64"></v-progress-circular>
  </div>

  <div v-else-if="canzoni.length === 0" class="text-center py-10 text-medium-emphasis">
    <v-icon icon="mdi-heart-outline" size="64"></v-icon>
    <p class="mt-4 text-h6">Non hai ancora canzoni preferite</p>
    <v-btn to="/" color="blue-darken-3" variant="tonal" class="mt-4" prepend-icon="mdi-magnify">
      Cerca canzoni
    </v-btn>
  </div>

  <lista-canzoni v-else :canzoni="canzoni"></lista-canzoni>
</template>
