<template>
  <v-app>
    <v-main>
      <HeaderComponent 
        :isLoading="isLoading" 
        :allLoaded="allLoaded"
        @loadCharacters="loadCharacters"
      />

      <CharacterList :characters="characters" />

      <!-- Snackbar para notificações -->
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
    </v-main>
  </v-app>
</template>

<script>
import { fetchAllCharacters } from '@/services/starWarsService.js';
import HeaderComponent from '@/components/HeaderComponent.vue';
import CharacterList from '@/components/CharacterList.vue';

export default {
  name: 'StarWarsApp',
  components: {
    HeaderComponent,
    CharacterList
  },
  data() {
    return {
      characters: [],
      isLoading: false,
      allLoaded: false,
      showSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'info'
    };
  },
  methods: {
    async loadCharacters() {
      this.isLoading = true;
      this.showNotification('🚀 Loading Star Wars Characters...', 'info');

      const { error } = await fetchAllCharacters(this.onProgress);

      if (error) {
        this.showNotification(error, 'error');
      } else {
        this.showNotification(`✅ All characters loaded!`, 'success');
        this.allLoaded = true;
      }

      this.isLoading = false;
    },

    // Atualiza a lista a cada nova página carregada
    onProgress(newCharacters, totalLoaded) {
      this.characters = [...this.characters, ...newCharacters];
      this.showNotification(`Loaded ${totalLoaded} characters`, 'info');
    },

    showNotification(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },

    closeBanner() {
      this.allLoaded = false;
    }
  }
};
</script>
