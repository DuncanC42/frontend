<script setup>
import { ref } from 'vue';
import BlurFilter from './BlurFilter.vue';
import NavBar from './NavBar.vue';
import ButtonEndGame from './buttons/ButtonEndGame.vue';
import ClassementFinJeu from './ClassementFinJeu.vue';

// Définition des props
const props = defineProps({
    message: {
        type: String,
        required: true,
        default: "Vous avez manqué de temps !"
    }
});

const showClassement = ref(false);

const showRanking = () => {
  showClassement.value = true;
};

const emit = defineEmits(['retry', 'quit']);
</script>

<template>
    <div id="panel">
      <BlurFilter :is-open="true" style="z-index: 100;" />
      
      <Transition name="fade" mode="out-in">
        <div v-if="!showClassement" key="dommage" class="dommage">
          <div class="titre">Dommage !</div>
          <div class="contenu">
            <p>Vous avez perdu</p>
            <p class="big-message">{{ message }}</p>
          </div>
          <div class="bouton">
            <ButtonEndGame @click="$emit('retry')" :classArray="['retry']" />
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
          :currentScore="0"
          :joueurs="[]"
          @quit="$emit('quit')"
        />
      </Transition>
      
      <NavBar />
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