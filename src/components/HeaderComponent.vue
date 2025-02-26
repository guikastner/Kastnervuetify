<template>
    <v-container>
      <h1 class="text-center mb-5">Star Wars Characters 🌌</h1>
  
      <v-btn 
        color="primary" 
        @click="triggerLoad"
        :disabled="isLoading || allLoaded"
        class="mb-5"
      >
        {{ isLoading ? 'Loading...' : allLoaded ? 'All Characters Loaded ✅' : 'Load All Characters' }}
      </v-btn>
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      isLoading: Boolean,
      allLoaded: Boolean
    },
    methods: {
      triggerLoad() {
        this.$emit('loadCharacters');
      }
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #1976D2;
  }
  </style>
  