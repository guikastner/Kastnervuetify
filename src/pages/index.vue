<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-center mb-5">Star Wars Characters 🌌</h1>

        <v-btn 
          color="primary" 
          @click="fetchCharacters" 
          :disabled="isLoading || allLoaded"
          class="mb-5"
        >
          {{ isLoading ? 'Loading...' : allLoaded ? 'All Characters Loaded ✅' : 'Load All Characters' }}
        </v-btn>

        <v-row>
          <v-col
            v-for="(character, index) in characters"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="text-h6">{{ character.name }}</v-card-title>
              <v-card-text>
                <div><strong>Height:</strong> {{ character.height }} cm</div>
                <div><strong>Mass:</strong> {{ character.mass }} kg</div>
                <div><strong>Gender:</strong> {{ character.gender }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Snackbar para avisos durante o carregamento -->
        <v-snackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor" top>
          {{ snackbarMessage }}
        </v-snackbar>

        <!-- Banner ao concluir o carregamento -->
        <v-banner
          v-if="allLoaded"
          color="success"
          icon="mdi-check-circle"
          class="mt-5"
        >
          🎉 All Star Wars Characters Loaded!
          <template v-slot:actions>
            <v-btn text @click="closeBanner">Close</v-btn>
          </template>
        </v-banner>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StarWarsApp',
  data() {
    return {
      characters: [],
      isLoading: false,
      allLoaded: false,
      error: false,
      nextPageUrl: 'https://swapi.dev/api/people/?page=1',
      showSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info',
    };
  },
  methods: {
    async fetchCharacters() {
      if (this.allLoaded || this.isLoading) return;

      this.isLoading = true;
      this.error = false;

      try {
        while (this.nextPageUrl) {
          const response = await axios.get(this.nextPageUrl);
          const newCharacters = response.data.results;

          // Adiciona novos personagens
          this.characters = [...this.characters, ...newCharacters];

          // Mostra snackbar a cada página carregada
          this.showNotification(`Loaded ${newCharacters.length} characters`, 'info');

          // Atualiza o nextPageUrl
          this.nextPageUrl = response.data.next;

          // Pequeno delay entre requisições
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        // Banner ao concluir
        this.allLoaded = true;
      } catch (err) {
        console.error('API Error:', err);
        this.showNotification('❌ Failed to load characters. Try again.', 'error');
        this.error = true;
      } finally {
        this.isLoading = false;
      }
    },

    showNotification(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },

    closeBanner() {
      this.allLoaded = false;
    },
  },
};
</script>

<style scoped>
h1 {
  color: #1976D2;
}

.v-card {
  transition: 0.3s;
}

.v-card:hover {
  transform: scale(1.05);
}
</style>
