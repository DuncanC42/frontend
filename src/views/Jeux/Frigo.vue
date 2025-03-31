<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import PageExplicationJeu from '@/components/PageExplicationJeu.vue';
import PageRegles from '@/components/PageRegles.vue';
import imagePostIt from '@/assets/images/DentsExplication.png';
import NavBar from '@/components/NavBar.vue';
import ButtonBack from '@/components/buttons/ButtonBack.vue';

import frite from '@/assets/fruit-ninja/images/frite_1.png';
import frites from '@/assets/fruit-ninja/images/frites.png';
import soda1 from '@/assets/fruit-ninja/images/soda_1.png';
import soda2 from '@/assets/fruit-ninja/images/soda_2.png';
import hamburger from '@/assets/fruit-ninja/images/hamburger.png';
import kebab from '@/assets/fruit-ninja/images/KEBAB.png';
import pizza from '@/assets/fruit-ninja/images/PIZZA.png';

import pomme1 from '@/assets/fruit-ninja/images/pomme_1.png';
import pomme2 from '@/assets/fruit-ninja/images/pomme_2.png';
import banane from '@/assets/fruit-ninja/images/BANANE.png';
import brocolo from '@/assets/fruit-ninja/images/brocolo.png';
import carotte from '@/assets/fruit-ninja/images/carotte.png';
import eau from '@/assets/fruit-ninja/images/eau.png';

import frigo from '@/assets/fruit-ninja/images/frigo_Plan de travail 1.png';

const width = ref(window.innerWidth);
const currentStep = ref(0); // 0 = intro, 1 = règles, 2 = jeu, 3 = bravo, 4 = leaderboard
const gameKey = ref(0);

const updateWidth = () => {
  width.value = window.innerWidth;
};

const nextStep = () => {
  if (currentStep.value === 1) { // Quand on passe à l'étape suivante
    gameKey.value++; // Force un nouveau montage du composant
  }
  currentStep.value++;
};

const backToIntro = () => {
  currentStep.value = 0;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const handleBackClick = () => {
  if (currentStep.value === 1) { // Si on est sur l'étape des règles
    backToIntro(); // Retour à l'intro
  }
};
</script>

<template>
    <!-- Étape 1: Introduction -->
    <div v-show="currentStep === 0">
      <PageExplicationJeu 
        :ImageSrc="imagePostIt" 
        PostItRotate="0deg"
        :TexteIntroduction="`Amélie adore manger des pizzas accompagnées d’un soda, même si elle sait que pas top pour sa santé…`"
        @continue="nextStep"
      />
</template>

<style></style>