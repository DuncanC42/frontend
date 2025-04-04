<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Jeu from '@/components/tirelire/Jeu.vue';
import PageExplicationJeu from '@/components/PageExplicationJeu.vue';
import PageRegles from '@/components/PageRegles.vue';
import imagePostIt from '@/assets/tirelire/images/Jeu2.png';
import NavBar from '@/components/NavBar.vue';
import ButtonBack from '@/components/buttons/ButtonBack.vue';
import fondRamasseur from '@/assets/tirelire/images/fondRamasseur.png'

// Good pictograms
import hopital from '@/assets/tirelire/images/pictos_bons/Hopital.png';
import auditive from '@/assets/tirelire/images/pictos_bons/AideAuditive.png';
import dentiste from '@/assets/tirelire/images/pictos_bons/Dentiste.png';
import medecin from '@/assets/tirelire/images/pictos_bons/Medecin.png';
import optique from '@/assets/tirelire/images/pictos_bons/Optique.png';
import transport from '@/assets/tirelire/images/pictos_bons/TransportSanitaire.png';

// Bad pictograms
import ampoule from '@/assets/tirelire/images/pictos_faux/ampoule.png';
import courrier from '@/assets/tirelire/images/pictos_faux/courrier.png';
import etude from '@/assets/tirelire/images/pictos_faux/etude.png';
import livre from '@/assets/tirelire/images/pictos_faux/livre.png';
import maison from '@/assets/tirelire/images/pictos_faux/maison.png';
import puzzle from '@/assets/tirelire/images/pictos_faux/puzzle.png';
import telephone from '@/assets/tirelire/images/pictos_faux/telephone.png';

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
      PostItRotate="-15deg"
      :TexteIntroduction="`Seb est allé aux urgences parce qu’il s’est cassé le pied au foot. Il doit payer une partie des soins (radio, plâtre…) parce qu’il n’a pas de complémentaire santé !`" 
      @continue="nextStep"
    />
  </div>
  
  <!-- Étape 2: Règles du jeu -->
  <div v-show="currentStep === 1" class="regles-container">
    <ButtonBack 
      @click="handleBackClick" 
      class="back-button"
    />
    
    <img :src="fondRamasseur" alt="fond bouche" class="fond-tirelire">

    <PageRegles 
      @back="backToIntro" 
      @pageClicked="nextStep"
    >
      <div class="contenu-regles">
        <p class="big">Mets dans la tirelire tout ce qu'une complémentaire santé prend en charge !</p>
        <div>
          <p>Voici les pièces que tu dois récolter :</p>
          <div class="list-images-tirelire">
            <img :src="hopital" alt="hopital">
            <img :src="auditive" alt="auditive">
            <img :src="dentiste" alt="dentiste">
            <img :src="medecin" alt="medecin">
            <img :src="optique" alt="optique">
            <img :src="transport" alt="transport">
          </div>
        </div>
        <div>
          <p>Mais ne récolte surtout pas celles-ci !</p>
          <div class="list-images-tirelire">
            <img :src="ampoule" alt="ampoule">
            <img :src="courrier" alt="courrier">
            <img :src="etude" alt="etude">
            <img :src="livre" alt="livre">
            <img :src="maison" alt="maison">
            <img :src="puzzle" alt="puzzle">
            <img :src="telephone" alt="telephone">
          </div>
        </div>
        <p class="big">Essaye de finir le plus vite possible</p>
      </div>
    </PageRegles>
    
    <NavBar />
  </div>
  
  <!-- Étape 3: Jeu (préchargé mais masqué) -->
  <div v-if="currentStep === 2" class="jeu-tirelire">
    <Jeu 
      :key="'game-'+gameKey+'-'+difficulty" 
      :difficulty="difficulty"
      @retry="handleRetry"
    />
  </div>
</template>

<style scoped>
.jeu-tirelire {
  background-color: #1A203B;
  position: fixed;
  top: 18%;
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

.list-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  margin: 1em 0;
}

.list-images-tirelire img {
  width: 2em;
  height: 2em;
  padding: 0 3px;
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

.contenu-regles {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin-top: 0 !important;
}

.contenu-regles p{
    font-size: 24px;
}

.big{
    font-size: 1.2em !important;
}

.fond-tirelire {
  position: absolute;
  width: 100%;
  height: auto;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.content-regles{
  padding-top: 0vh !important;
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