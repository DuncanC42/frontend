<template>
  <div>
    <h2>🕒 Compte à rebours fin projet</h2>
    <CompteRebours targetDate="2025-04-02T15:30:00" />
  </div>
  <div class="min">
    <Minuteur couleur="black"/>
    <Minuteur couleur="white"/>
  </div>
  <div class="min">
    <Chronometre couleur="black"/>
    <Chronometre couleur="white"/>
  </div>
</template>

<script setup>
  import Chronometre from './components/Chronometre.vue';
  import CompteRebours from './components/CompteRebours.vue';
  import Minuteur from './components/Minuteur.vue';
</script>

<style>
  .min{
    background-color: rgb(102, 102, 102);
  }
</style>