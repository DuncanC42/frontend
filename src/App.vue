<template>
  <div>
    <h1>🕒 Compte à rebours test</h1>
    <CompteRebours targetDate="2025-03-18T09:00:00" />
  
    <h1>🕒 Compte à rebours fin projet</h1>
    <CompteRebours targetDate="2025-04-02T15:30:00" />
  </div>
  <PageErreur />
</template>

<script setup>
import CompteRebours from './components/CompteRebours.vue';
import PageErreur from './views/PageErreur.vue'
</script>
