<script setup>
import BlurFilter from './BlurFilter.vue';
import NavBar from './NavBar.vue';
import ButtonEndGame from './buttons/ButtonEndGame.vue';
import { ref, onUnmounted, onMounted, watch } from 'vue' 

import ambianceSound from '@/assets/sons/musiques/ambiance/flow.mp3';

import { volumeStore } from '@/stores/volume';
import { useMusic } from '@/composable/volumes';

import ClassementFinJeu from './ClassementFinJeu.vue';

import { fetchBackend } from '@/composable/fetchBackend.js';

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
  },
  jeu_id:{
    type: Number,
    required: true,
  }
});

const scoreSent = ref(false);


const handleScore = async () => {
  if (scoreSent.value) return;
  
  scoreSent.value = true;
  try {
    const { status, data, error } = await fetchBackend('api/score', 'POST', { 
      jeu_id: props.jeu_id,
      points: props.score 
    });
    
    if (status === 200 || status === 201) {
    } else if (error) {
      // Stocker pour réessai ultérieur
      storePendingScore();
    }
  } catch (error) {
    storePendingScore();
  }
};

const storePendingScore = () => {
  const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || []);
  pendingScores.push({
    jeu_id: props.jeu_id,
    points: props.score,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('pendingScores', JSON.stringify(pendingScores));
  toast.warning("Score sauvegardé localement", { position: "top-center" });
};

const audio = ref(null);
const volumes = volumeStore();
const { switchAudio } = useMusic();

const showClassement = ref(false);

// Initialiser l'audio lorsque le composant est monté
onMounted(() => {
  switchAudio(ambianceSound);
  handleScore();
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

const showRanking = () => {
  showClassement.value = true;
};
const emit = defineEmits(['quit']);
</script>

<template>    
  <div>
    <div id="panel">
      <BlurFilter :is-open="true" style="z-index: 100;"></BlurFilter>
      
      <Transition name="fade" mode="out-in">
        <div v-if="!showClassement" key="bravo" class="bravo">
          <div class="titre">Bravo !</div>
          <div class="contenu">
            <p><u>Ton score :</u> {{ score }}pts</p>
            <p class="big-message">{{ message }}</p>
          </div>
          <!-- Bouton pour afficher le classement manuellement -->
          <div class="bouton">
            <ButtonEndGame 
              @click="showRanking" 
              text="Voir le classement" 
              :classArray="['continue']"
            />
          </div>
        </div>
        
        <ClassementFinJeu
          v-else
          key="classement"
          :currentPlayerId="'joueur-actuel'"
          :currentScore="score"
          :joueurs="[]"
          @quit="$emit('quit')"
        />
      </Transition>
      <NavBar />
    </div>
  </div>
</template>

<style scoped>
/* Animation de transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#panel {
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding-top: 10vh;
}
.bravo {
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
