<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import CompteRebours from './components/CompteRebours.vue';
  import PageBienvenue from './views/PageBienvenue.vue';
  import PageErreur from './views/PageErreur.vue'
  
  import VolumeButton from './components/volumes/VolumeButton.vue'
  import {useMusique} from './composable/volumes'
  useMusique();
  const width = ref(window.innerWidth);
  const updateWidth = () => {
    width.value = window.innerWidth;
  };
  onMounted(() => {
    window.addEventListener('resize', updateWidth);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });
</script>

<template>
  <PageErreur v-if="width > 700" /> <!--Passage de la page d'erreur à la page de bienvenue--> 
  <PageBienvenue v-else />
  <VolumeButton></VolumeButton>
</template>