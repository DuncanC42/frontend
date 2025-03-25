<script setup>
import { computed } from 'vue';
import BlurFilter from './BlurFilter.vue';
import NavBar from './NavBar.vue';
import ButtonEndGame from './buttons/ButtonEndGame.vue';
import { ref } from 'vue' // Ajoutez cette ligne

// Définition des props dans le bloc `<script setup>`
const props = defineProps({
    time: {
        type: Number,
        required: true,
        default: 0
    },
    message: {
        type: String,
        required: true,
        default: "Félicitations !"
    }
});

const formattedTime = computed(() => {
    const minutes = Math.floor(props.time / 60);
    const seconds = props.time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const time = ref(0); // Temps du minuteur, à adapter selon votre logique
const isGameLost = ref(false); // État pour afficher ou masquer l'écran "perdu"

const startTimer = () => {
  // Exemple simple de minuterie pour tester
  const interval = setInterval(() => {
    if (time.value > 0) {
      time.value--;
    } else {
      clearInterval(interval);
      isGameLost.value = true; // Le jeu est perdu une fois que le timer atteint 0
    }
  }, 1000);
};

// Démarrer le timer (c'est à vous d'adapter cela selon la logique de votre jeu)
startTimer();


</script>

<template>    
  <div>
    <div v-if="isGameLost" id="panel">
      <BlurFilter :is-open="true" style="z-index: 100;"></BlurFilter>
      <div class="dommage">
        <div class="titre">
          <div class="titre">Bravo !</div>
        </div>
        <div class="contenu">
          <!-- Affichage du temps -->
          <p><u>Ton score :</u> {{ formattedTime }}</p>
          <!-- Message personnalisé -->
          <p class="big-message">{{ message }}</p>
        </div>
        <div class="bouton">
          <ButtonEndGame @click="$emit('quit')" :classArray="['continue']" />
        </div>
      </div>
      <NavBar />
    </div>
  </div>
</template>

<style scoped>
#panel {
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding-top: 10vh;
}
.dommage {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 70vh;
  color: white;
  position: relative;
  z-index: 101;
  text-align: center;
}
.titre {
  font-size: 40px;
  filter: drop-shadow(0px 4px 4px #00000040);
}
p {
  font-size: 32px;
  filter: drop-shadow(0px 4px 4px #00000040);
}
.big-message {
    font-size: 24px;
    margin-top: 20px;
    text-align: center;
    max-width: 85%;
    display: inline-flex;
}
.bouton {
  display: flex;
  gap: 10vw;
}
</style>
