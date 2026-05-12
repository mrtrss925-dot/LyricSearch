<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const props = defineProps(['trackId']);

const songInfo = ref(undefined);
const lyrics = ref("");
const lyricsLoading = ref(false);
const lyricsError = ref(false);

onMounted(async function () {
  try {
    // Carico info canzone da iTunes
    const response = await axios.get("https://itunes.apple.com/lookup", {
      params: { id: props.trackId }
    });
    if (response.data.results.length > 0) {
      songInfo.value = response.data.results[0];
      // Carico il testo da lyrics.ovh
      await caricaTesto(songInfo.value.artistName, songInfo.value.trackName);
    }
  } catch (e) {
    // silenzioso
  }
});

async function caricaTesto(artist, title) {
  lyricsLoading.value = true;
  lyricsError.value = false;
  try {
    const cleanArtist = encodeURIComponent(artist);
    const cleanTitle = encodeURIComponent(title);
    const response = await axios.get(`https://api.lyrics.ovh/v1/${cleanArtist}/${cleanTitle}`);
    lyrics.value = response.data.lyrics;
  } catch (e) {
    lyricsError.value = true;
    lyrics.value = "";
  } finally {
    lyricsLoading.value = false;
  }
}

function formatDuration(ms) {
  if (!ms) return '-';
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
</script>

<template>
  <div v-if="songInfo">
    <v-btn to="/" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">Torna alla ricerca</v-btn>

    <v-row>
      <!-- Colonna sinistra: copertina e info -->
      <v-col cols="12" md="4">
        <v-img
          :src="songInfo.artworkUrl100?.replace('100x100', '600x600')"
          rounded="lg"
          elevation="4"
          color="blue-grey-lighten-4"
        ></v-img>

        <v-card class="mt-4" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title>{{ songInfo.trackName }}</v-card-title>
            <v-card-subtitle>{{ songInfo.artistName }}</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-album" :title="songInfo.collectionName" subtitle="Album"></v-list-item>
              <v-list-item prepend-icon="mdi-calendar" :title="songInfo.releaseDate?.slice(0,4)" subtitle="Anno"></v-list-item>
              <v-list-item prepend-icon="mdi-music-clef-treble" :title="songInfo.primaryGenreName" subtitle="Genere"></v-list-item>
              <v-list-item prepend-icon="mdi-clock-outline" :title="formatDuration(songInfo.trackTimeMillis)" subtitle="Durata"></v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions v-if="songInfo.trackViewUrl">
            <v-btn
              :href="songInfo.trackViewUrl"
              target="_blank"
              color="blue-darken-3"
              variant="tonal"
              prepend-icon="mdi-open-in-new"
              block
            >
              Apri su iTunes
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Anteprima audio -->
        <v-card v-if="songInfo.previewUrl" class="mt-4" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="text-body-1">Anteprima (30s)</v-card-title>
          </v-card-item>
          <v-card-text>
            <audio controls style="width: 100%;">
              <source :src="songInfo.previewUrl" type="audio/mpeg" />
            </audio>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Colonna destra: testo -->
      <v-col cols="12" md="8">
        <h2 class="text-h5 mb-4">
          <v-icon icon="mdi-text" class="me-2"></v-icon>
          Testo
        </h2>

        <div v-if="lyricsLoading" class="text-center py-10">
          <v-progress-circular indeterminate color="blue-darken-3"></v-progress-circular>
          <p class="mt-3 text-medium-emphasis">Carico il testo...</p>
        </div>

        <v-alert v-else-if="lyricsError" type="info" variant="tonal" icon="mdi-music-off">
          Testo non disponibile per questa canzone.
        </v-alert>

        <v-card v-else elevation="1" rounded="lg">
          <v-card-text>
            <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.8;">{{ lyrics }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div v-else class="text-center py-10">
    <v-progress-circular indeterminate color="blue-darken-3" size="64"></v-progress-circular>
  </div>
</template>
