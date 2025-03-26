<script setup>
import BlurFilter from './BlurFilter.vue';
import NavBar from './NavBar.vue';
import ButtonEndGame from './buttons/ButtonEndGame.vue';
import { ref, onUnmounted, onMounted, watch } from 'vue' 

import applaudissementSound from '@/assets/Jeu5/applaudissementFin.mp3';
import ambianceSound from '@/assets/sons/musiques/ambiance/flow.mp3';

import { volumeStore } from '@/stores/volume';
import { useMusic } from '@/composable/volumes';

// Définition des props dans le bloc `<script setup>`
const props = defineProps({
  score: {
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

const audio = ref(null);
const volumes = volumeStore();
const { switchAudio, pauseAudio } = useMusic();

// Initialiser l'audio lorsque le composant est monté
onMounted(() => {
  // Musique d'ambiance
  switchAudio(ambianceSound)
  
  // Son d'applaudissement
  audio.value = new Audio(applaudissementSound)
  audio.value.volume = volumes.effet_sonore
  playSound()
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});

// Surveillance du volume
watch(
  () => volumes.effet_sonore,
  (newVolume) => {
    if (audio.value) audio.value.volume = newVolume
  }
)

// Jouer le son
const playSound = () => {
  if (!audio.value) return
  
  try {
    audio.value.currentTime = 0
    audio.value.play().catch(e => console.error("Erreur lecture audio:", e))
  } catch (e) {
    console.error("Erreur audio:", e)
  }
}
</script>

<template>    
  <div>
    <div id="panel">
      <BlurFilter :is-open="true" style="z-index: 100;"></BlurFilter>
      <div class="dommage">
        <div class="titre">
          <div class="titre">Bravo !</div>
        </div>
        <div class="contenu">
          <!-- Affichage du temps -->
          <p><u>Ton score :</u> {{ score }}pts</p>
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
