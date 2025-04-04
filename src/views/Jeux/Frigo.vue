<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import FruitNinjaGame from '@/components/jeu-frigo/FruitNinjaGame.vue';
import PageExplicationJeu from '@/components/PageExplicationJeu.vue';
import PageRegles from '@/components/PageRegles.vue';
import imagePostIt from '@/assets/images/FrigoExplication.png';
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
import brocoli from '@/assets/fruit-ninja/images/brocoli.png';
import carotte from '@/assets/fruit-ninja/images/carotte.png';
import eau from '@/assets/fruit-ninja/images/eau.png';

import frigo from '@/assets/fruit-ninja/images/frigo_Plan_de_travail_1.png';

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

const difficulty = ref('normal');

const toggleDifficulty = () => {
  difficulty.value = difficulty.value === 'normal' ? 'hard' : 'normal';
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
        PostItRotate="0deg"
        :TexteIntroduction="`Amélie adore manger des pizzas accompagnées d’un soda, même si ce n'est pas top pour sa santé…`"
        @continue="nextStep"
      />
    </div>

    <!-- Étape 2: Règles du jeu -->
     <div v-show="currentStep === 1" class="regles-container">
    <ButtonBack 
      @click="handleBackClick" 
      class="back-button"
    />

    <img :src="frigo" alt="fond frigo" class="fond-frigo">

    <PageRegles
        @back="backToIntro"
        @pageClicked="nextStep"
    >
        <div class="contenu-regles">
            <p>Coupe les aliments les moins bons pour sa santé !</p>
            <div class="badFood-section">
                <p>Voici les aliments que tu dois couper :</p>
                <div class="list-images-badFood">
                    <img :src="frite" id="frite" alt="frite" class="badFood-image"/>
                    <img :src="frites" alt="frites" class="badFood-image"/>
                    <img :src="soda1" id="soda1" alt="soda1" class="badFood-image"/>
                    <img :src="soda2" id="soda2" alt="soda2" class="badFood-image"/>
                    <img :src="hamburger" alt="hamburger" class="badFood-image"/>
                    <img :src="kebab" alt="kebab" class="badFood-image"/>
                    <img :src="pizza" alt="pizza" class="badFood-image"/>
                </div>
            </div>
            <div class="goodFood-section">
                <p>Voici les aliments que tu dois garder :</p>
                <div class="list-images-goodFood">
                    <img :src="pomme1" alt="pomme1" class="goodFood-image"/>
                    <img :src="pomme2" alt="pomme2" class="goodFood-image"/>
                    <img :src="banane" alt="banane" class="goodFood-image"/>
                    <img :src="brocoli" alt="brocoli" class="goodFood-image"/>
                    <img :src="carotte" id="carotte" alt="carotte" class="goodFood-image"/>
                    <img :src="eau" alt="eau" class="goodFood-image"/>
                </div>
            </div>
        </div>
    </PageRegles>

    <NavBar/>
    </div>
    <!-- Étape 3: Jeu (préchargé mais masqué) -->
     <div v-if="currentStep === 2" class="jeu-frigo">
       <FruitNinjaGame difficulty="hard" :key="'game-'+gameKey" />
     </div>
</template>

<style scoped>

    /* Transition entre les écrans */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .contenu-regles > p {
        font-size: 1.2em;
        text-align: center;
        margin-bottom: 20px;
    }

    .contenu-regles {
      margin-top: 60px !important;
    }

    .fond-frigo {
        position: absolute;
        width: 80%;
        height: auto;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
    }

    .regles-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: #1A203B;
    }

    .badFood-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 40px;
    }

    .goodFood-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .list-images-badFood img {
        width: 2.4em;
        padding: 0em 0.2em;
        display : inline;
    }

    .list-images-goodFood img {
        width: 2em;
        padding: 0em 0.2em;
        display : inline;
    }


    #carotte, #frite, #soda1, #soda2 {
        width: 1em;
    }

    .back-button {
    position: absolute;
    top: 30px !important;
    left: 20px;
    z-index: 101 !important; 
    cursor: pointer;
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