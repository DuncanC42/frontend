<script setup>

import PageBienvenue from './PageBienvenue.vue';
import PageErreur from './PageErreur.vue';
import {ref, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;

  // Redirige en fonction de la taille de l'écran
  if (screenWidth.value > 700 && router.name !== 'erreur') {
    router.replace('/erreur'); // Redirige vers la page d'erreur si l'écran est trop large
  } else if (screenWidth.value <= 700 && router.name !== 'bienvenue') {
    router.replace('/bienvenue'); // Redirige vers la page de bienvenue si l'écran est adapté
  }
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
   <router-view>
    <PageBienvenue v-if="screenWidth <= 700" />
    <PageErreur v-else />
   </router-view> 
</template>

<style scoped>

</style>