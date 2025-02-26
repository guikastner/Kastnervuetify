<template>
    <v-container>
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
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      characters: Array
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    transition: 0.3s;
  }
  
  .v-card:hover {
    transform: scale(1.05);
  }
  </style>
  