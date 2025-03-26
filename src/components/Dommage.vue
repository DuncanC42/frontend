<script setup>
import { ref, watch } from 'vue';
import BlurFilter from './BlurFilter.vue';
import NavBar from './NavBar.vue';
import ButtonEndGame from './buttons/ButtonEndGame.vue';

// Définition des props
const props = defineProps({
    message: {
        type: String,
        required: true,
        default: "Vous avez manqué de temps !"
    }
});

</script>

<template>
    <div id="panel">
      <BlurFilter :is-open="true" style="z-index: 100;" />
      <div class="dommage">
        <div class="titre">
          <div class="titre">Dommage !</div>
        </div>
        <div class="contenu">
          <p>Le temps est écoulé !</p>
          <p class="big-message">{{ message }}</p>
        </div>
        <div class="bouton">
          <ButtonEndGame @click="$emit('retry')" :classArray="['retry']" />
          <ButtonEndGame @click="$emit('quit')" :classArray="['continue']" />
        </div>
      </div>
      <NavBar />
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
