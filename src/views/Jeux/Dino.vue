<script setup>
import { ref } from 'vue';
import DinoGame from '../../components/jeu-dino/DinoGame.vue';
import PageExplicationJeu from '@/components/PageExplicationJeu.vue';
import PageRegles from '@/components/PageRegles.vue';
import imagePostIt from '@/assets/images/DinoExplication.png';
import NavBar from '@/components/NavBar.vue';
import ButtonBack from '@/components/buttons/ButtonBack.vue';

import cactus1 from '@/assets/jeu-dino/cactus_1.png'
import cactus2 from '@/assets/jeu-dino/cactus_2.png'
import cactus3 from '@/assets/jeu-dino/cactus_3.png'

import fondDino from '@/assets/jeu-dino/rendu_dino.png'

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

<template>
    <div>
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
        :TexteIntroduction="`La mère de Pauline l'appelle pour lui dire qu'elle a eu des remboursements de consultations pas l'Assurance Maladie qui ne la concernent pas...`"
        @continue="nextStep"
      />
    </div>
  
  <!-- Étape 2: Règles du jeu -->
  <div v-show="currentStep === 1" class="regles-container">
    <ButtonBack 
      @click="handleBackClick" 
      class="back-button"
    />

    <img :src="fondDino" alt="fond bouche" class="fond-dino">
    
    <PageRegles 
      @back="backToIntro" 
      @pageClicked="nextStep"
    >
      <div class="contenu-regles">
        <p class="big">Aide Pauline à compléter son RIB !</p>
        <div class="dino-section">
          <p>Fais attention à ne pas foncer dans un cactus !</p>
          <div class="list-images-dino">
            <img :src="cactus1" alt="cactus 1">
            <img :src="cactus2" alt="cactus 2">
            <img :src="cactus3" alt="cactus 3">
          </div>
        </div>
      </div>
    </PageRegles>
    
    <NavBar />
  </div>
  
  <!-- Étape 3: Jeu (préchargé mais masqué) -->
  <div v-if="currentStep === 2" class="jeu-dino">
    <DinoGame 
      :key="'game-'+gameKey" 
      :difficulty="difficulty"
      @retry="handleRetry"
    />
  </div>
</div>
</template>

<style>

  .contenu-regles{
    margin-top: 5em;
  } 

  .list-images-dino {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .list-images-dino img {
    height: 65px;
  }

  .dino-section {
    margin-top: 120px;
  }
  .back-button {
    position: absolute;
    top: 20px !important;
    left: 20px;
    z-index: 101 !important; 
    cursor: pointer;
  }
  .regles-container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
  .contenu-regles p{
    font-size: 24px;
  }

  .big{
      font-size: 1.2em !important;
  }

  .fond-dino{
    position: absolute;
    width: 100%;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
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