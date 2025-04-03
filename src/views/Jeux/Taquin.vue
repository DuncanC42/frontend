<template>
  <!-- Étape 1: Introduction -->
  <div v-show="currentStep === 0">
    <!-- Bouton de difficulté positionné en haut à droite -->
    <div class="global-difficulty-toggle">
      <button 
        @click="toggleDifficulty"
        :class="{ 'active': difficulty === 'hard' }"
      >
        {{ difficulty === 'hard' ? 'Difficile' : 'Normale' }}
      </button>
    </div>

    <PageExplicationJeu 
      :ImageSrc="imagePostIt" 
      PostItRotate="0deg"
      :TexteIntroduction="`Amélie retrouve sa carte Vitale en morceaux après la soirée d’intégration.`"
      @continue="nextStep"
    />
  </div>
  
  <!-- Étape 2: Règles du jeu -->
  <div v-show="currentStep === 1" class="regles-container">
    <ButtonBack 
      @click="handleBackClick" 
      class="back-button"
    />
    
    <img :src="FondSoiree" alt="fond soirée" class="fond-soiree">

    <PageRegles 
      @back="backToIntro" 
      @pageClicked="nextStep"
    >
      <div class="contenu-regles">
        <div class="space"></div>
        <p class="big">Aide Amélie à la reconstituer au plus vite !</p>
        <div class="puzzle-section">
          <p>Voici à quoi doit ressembler la carte vitale d’Amélie.</p>
          <img :src="CarteVitale" alt="carte vitale" class="carte">
        </div>
      </div>
    </PageRegles>
    
    <NavBar class="nav-bar"/>
  </div>
  
  <!-- Étape 3: Jeu -->
  <div v-if="currentStep === 2" class="jeu-taquin">
    <JeuTaquin :key="'game-'+gameKey" :difficulty="difficulty" @retry="handleRetry"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import JeuTaquin from '@/components/taquin/JeuTaquin.vue';
import PageExplicationJeu from '@/components/PageExplicationJeu.vue';
import PageRegles from '@/components/PageRegles.vue';
import imagePostIt from '@/assets/jeu-taquin/images/Jeu1.png';
import NavBar from '@/components/NavBar.vue';
import ButtonBack from '@/components/buttons/ButtonBack.vue';
import CarteVitale from '@/assets/jeu-taquin/images/carteVitale.png';
import FondSoiree from '@/assets/jeu-taquin/images/Fond_soiree.png';

const currentStep = ref(0); // 0 = intro, 1 = règles, 2 = jeu
const gameKey = ref(0);

const nextStep = () => {
  if (currentStep.value === 1) { // Quand on passe au jeu
    gameKey.value++; // Force un nouveau montage du composant
  }
  currentStep.value++;
};

const backToIntro = () => {
  currentStep.value = 0;
};

const handleBackClick = () => {
  if (currentStep.value === 1) { // Si on est sur l'étape des règles
    backToIntro(); // Retour à l'intro
  }
};

const difficulty = ref('normal');

const toggleDifficulty = () => {
  difficulty.value = difficulty.value === 'normal' ? 'hard' : 'normal';
};

const handleRetry = () => {
    gameKey.value++; // Force la recréation du composant
    currentStep.value = 2; // Retour au jeu
};
</script>

<style scoped>
.space{
  margin-top: -3em;
}

.carte{
  width: 80%;
}

.jeu-taquin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.regles-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #1A203B;
}

.back-button {
  position: absolute;
  top: 20px !important;
  left: 20px;
  z-index: 101 !important; 
  cursor: pointer;
}

.big {
  font-size: 1.2em;
}

.puzzle-section {
  padding: 1em 0;
}

.tip {
  font-style: italic;
  color: #f8f8f8;
  margin-top: 1em;
}

.fond-soiree{
  position: absolute;
  width: 120%;
  height: auto;
  top: 55%;
  left: 60%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

/* Ajoutez cette règle pour la NavBar */
.regles-container >>> .nav-bar {
  position: fixed;
  bottom: 18.5%;
  left: 41.5%;
  width: 45%;
  z-index: 100; /* Doit être plus élevé que le fond */
}


.global-difficulty-toggle {
  position: absolute;
  right: 20px;
  z-index: 100;
  top: 11%;
}

.global-difficulty-toggle button {
  padding: 8px 16px;
  border: 1px solid #000;
  border-radius: 20px;
  background-color: #0cd40c;
  cursor: pointer;
  color: #000;
  transition: all 0.3s;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.global-difficulty-toggle button.active {
  background-color: #cc0d0d;
  color: #000;
}

.intro-container {
  position: relative;
}
</style>