<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ThootbrushGame from '../../components/jeu-dents/ToothbrushGame.vue';
import PageExplicationJeu from '@/components/PageExplicationJeu.vue';
import PageRegles from '@/components/PageRegles.vue';
import imagePostIt from '@/assets/images/DentsExplication.png';
import NavBar from '@/components/NavBar.vue';
import ButtonBack from '@/components/buttons/ButtonBack.vue';

import bacterie1 from '@/assets/Jeu5/microbe_1.png';
import bacterie2 from '@/assets/Jeu5/microbe_2.png';
import carie from '@/assets/Jeu5/carie_droite.png';

import bouche from '@/assets/Jeu5/bouche_propre.png'

const width = ref(window.innerWidth);
const currentStep = ref(0); // 0 = intro, 1 = règles, 2 = jeu
const gameKey = ref(0);

const updateWidth = () => {
  width.value = window.innerWidth;
};

const nextStep = () => {
  if (currentStep.value === 1) { // Quand on passe au jeu
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
      :TexteIntroduction="`Damien a mal aux dents…`"
      @continue="nextStep"
    />
  </div>
  
  <!-- Étape 2: Règles du jeu -->
  <div v-show="currentStep === 1" class="regles-container">
    <ButtonBack 
      @click="handleBackClick" 
      class="back-button"
    />

    <img :src="bouche" alt="fond bouche" class="fond-bouche">
    
    <PageRegles 
      @back="backToIntro" 
      @pageClicked="nextStep"
    >
      <div class="contenu-regles">
        <p>Brosse ses dents avec du dentifrice pour enlever les restes alimentaires et lui faire retrouver le sourire !</p>
        <div class="microbes-section">
          <p>Élimine les saletés et les carries :</p>
          <div class="list-images">
            <img :src="bacterie1" alt="bacterie 1">
            <img :src="carie" alt="carie">
            <img :src="bacterie2" alt="bacterie 2">
          </div>
        </div>
      </div>
    </PageRegles>
    
    <NavBar />
  </div>
  
  <!-- Étape 3: Jeu (préchargé mais masqué) -->
  <div v-if="currentStep === 2" class="jeu-dents">
    <ThootbrushGame :key="'game-'+gameKey" />
  </div>
</template>

<style>
.jeu-dents {
  background-color: #1A203B;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Transition entre les écrans */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.list-images img {
  width: 4em;
  padding: 0em 0.4em;
}

.regles-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #1A203B;
}
.fond-bouche {
  position: absolute;
  width: 80%;
  height: auto;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.back-button {
  position: absolute;
  top: 20px !important;
  left: 20px;
  z-index: 101 !important; 
  cursor: pointer;
}
</style>