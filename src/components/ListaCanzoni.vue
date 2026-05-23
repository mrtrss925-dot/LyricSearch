<script setup>
import { onMounted, ref, watch } from 'vue';
import db from '@/firestore';

const props = defineProps(['canzoni']);
const preferiti = ref(new Set());
const messages = ref([]);

async function caricaPreferiti() {
  try {
    const ids = await db.getPreferiti();
    preferiti.value = new Set(ids.map(String));
  } catch (e) {
  }
}

async function togglePreferito(trackId) {
  const id = String(trackId);
  try {
    if (!preferiti.value.has(id)) {
      await db.addPreferito(id);
      preferiti.value.add(id);
      messages.value.push({ text: "Aggiunto ai preferiti!", color: 'success' });
    } else {
      await db.removePreferito(id);
      preferiti.value.delete(id);
      messages.value.push({ text: "Rimosso dai preferiti", color: 'info' });
    }
    
    preferiti.value = new Set(preferiti.value);
  } catch (e) {
    messages.value.push({ text: "Errore. Riprova.", color: 'error' });
  }
}

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

onMounted(caricaPreferiti);
watch(() => props.canzoni, caricaPreferiti);
</script>

<template>
  <v-row>
    <v-col cols="12" sm="6" lg="4" xl="3" v-for="canzone in canzoni" :key="canzone.trackId">
      <v-card elevation="2" rounded="lg" height="100%">
        <v-img
          :src="canzone.artworkUrl100?.replace('100x100', '300x300')"
          :alt="`copertina album ${canzone.collectionName }`"
          height="180"
          cover
          color="blue-grey-lighten-4"
        >
          <template v-slot:placeholder>
            <v-icon icon="mdi-music" size="64" color="blue-grey"></v-icon>
          </template>
        </v-img>
        <v-card-item>
          <v-card-title class="text-body-1 font-weight-bold">{{ canzone.trackName }}</v-card-title>
          <v-card-subtitle>{{ canzone.artistName }}</v-card-subtitle>
        </v-card-item>
        <v-card-text class="text-caption text-medium-emphasis pt-0">
          <v-icon icon="mdi-album" size="14" class="me-1"></v-icon>{{ canzone.collectionName }}
          <span class="ms-3">
            <v-icon icon="mdi-clock-outline" size="14" class="me-1"></v-icon>{{ formatDuration(canzone.trackTimeMillis) }}
          </span>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :to="`/song/${canzone.trackId}`"
            color="blue-darken-3"
            variant="tonal"
            size="small"
            prepend-icon="mdi-text"
          >
            Testo
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :color="preferiti.has(String(canzone.trackId)) ? 'red' : 'grey'"
            icon="mdi-heart"
            variant="text"
            :aria-label="preferiti.has(String(canzone.trackId))
            ? `Rimuovi ${canzone.trackName} dai preferiti`
            : `Aggiungi ${canzone.trackName} ai preferiti`"
            @click="togglePreferito(canzone.trackId)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar-queue v-model="messages" :total-visible="3" closable close-text="Chiudi"></v-snackbar-queue>
</template>
