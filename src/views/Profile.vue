<script setup>
import { onMounted, ref } from 'vue';
import db from '@/firestore';

const userData = ref(null);
const nomeDisplay = ref("");
const generePreferito = ref("");
const messages = ref([]);
const saving = ref(false);
const loading = ref(true);
const numeroPreferiti = ref(0);

const generi = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Electronic", "Jazz", "Classical",
  "Country", "Metal", "Indie", "Latin", "Reggae", "Blues", "Soul"
];

onMounted(async function () {
  loading.value = true;
  try {
    userData.value = await db.getUserData();
    if (userData.value) {
      nomeDisplay.value = userData.value.nomeDisplay || "";
      generePreferito.value = userData.value.generePreferito || "";
    }
    const preferiti = await db.getPreferiti();
    numeroPreferiti.value = preferiti.length;
  } catch (e) {
    messages.value.push({ text: "Errore nel caricamento del profilo", color: 'error' });
  } finally {
    loading.value = false;
  }
});

async function salvaProfilo() {
  saving.value = true;
  try {
    await db.updateUserData(db.getUser(), {
      nomeDisplay: nomeDisplay.value,
      generePreferito: generePreferito.value,
    });
    messages.value.push({ text: "Profilo aggiornato con successo!", color: 'success' });
  } catch (e) {
    messages.value.push({ text: "Errore nel salvataggio. Riprova.", color: 'error' });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <h1 class="text-h4 mb-6">
    Il mio profilo
  </h1>

  <div v-if="loading" class="text-center py-10">
    <v-progress-circular indeterminate color="blue-darken-3" size="64"></v-progress-circular>
  </div>

  <v-row v-else>
    <v-col cols="12" md="8">
      <v-card elevation="2" rounded="lg">
        <v-card-item>
          <template v-slot:prepend>
            <v-avatar color="blue-darken-3" size="56">
              <v-icon icon="mdi-account" size="32" color="white"></v-icon>
            </v-avatar>
          </template>
          <v-card-title>{{ nomeDisplay || userData?.username }}</v-card-title>
          <v-card-subtitle>@{{ userData?.username }}</v-card-subtitle>
          
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <p class="text-subtitle-2 mb-4 text-medium-emphasis">Modifica le tue informazioni</p>

          <!-- Interazione 1: v-model su nome display -->
          <v-text-field
            v-model="nomeDisplay"
            label="Nome visualizzato"
            variant="outlined" 
            prepend-inner-icon="mdi-account-edit"
            class="mb-3"
          ></v-text-field>

          <!-- Interazione 2: v-model su genere preferito (select) -->
          <v-select
            v-model="generePreferito"
            :items="generi"
            label="Genere musicale preferito"
            variant="outlined"
            prepend-inner-icon="mdi-music-clef-treble"
            class="mb-4"
            clearable
          ></v-select>

          <v-btn
            color="blue-darken-3"
            block
            size="large"
            :loading="saving"
            @click="salvaProfilo"
            prepend-icon="mdi-content-save"
          >
            Salva
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card elevation="2" rounded="lg">
        <v-card-item>
          <v-card-title>I tuoi dati</v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
            <v-list-item prepend-icon="mdi-account" :subtitle="userData?.username" title="Username"></v-list-item>
            <v-list-item
              prepend-icon="mdi-badge-account"
              :subtitle="nomeDisplay || 'Non impostato'"
              title="Nome visualizzato"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-music-clef-treble"
              :subtitle="generePreferito || 'Non impostato'"
              title="Genere preferito"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-heart"
              :subtitle="numeroPreferiti"
              title="Canzoni preferite"
            ></v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <v-btn
        color="red"
        block
        class="mt-4"
        @click="db.logout(); $router.push('/login')"
        prepend-icon="mdi-logout">Logout</v-btn>
    </v-col>
  </v-row>

  <v-snackbar-queue v-model="messages" :total-visible="3" closable></v-snackbar-queue>
</template>
