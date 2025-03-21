<script setup>

import PageBienvenue from './PageBienvenue.vue';
import PageErreur from './PageErreur.vue';
import {ref, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  // Ajoute un écouteur pour surveiller les changements de taille d'écran
  window.addEventListener('resize', updateScreenWidth);
  updateScreenWidth(); // Vérifie la taille de l'écran au chargement
});

onUnmounted(() => {
  // Supprime l'écouteur lors de la destruction du composant
  window.removeEventListener('resize', updateScreenWidth);
});
</script>

<template>
    <PageBienvenue v-if="screenWidth <= 700" />
    <PageErreur v-else />
</template>

<style scoped>

</style>