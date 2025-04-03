<template>
  <div v-if="timeLeft > 0" class="minuteur" :class="currentColor">
    {{ formattedTime }}
    <font-awesome-icon :icon="['fas', 'stopwatch']" :class="currentColor" />
  </div>
  <div v-else class="message">
    <h1>🚀 Temps écoulé !</h1>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  couleur: String,
});

const timeLeft = defineModel();

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
});

const currentColor = computed(() => {
  return timeLeft.value < 10 ? 'red' : props.couleur;
});

// Supprimez toutes les fonctions de timer (startTimer, pauseTimer, resetTimer)
// et le defineExpose car vous n'en avez plus besoin
</script>

<style scoped>
.minuteur {
    font-size: 32px;
    text-align: center;
    background-color: #c4c4c448;
    border-radius: 10px;
    filter: drop-shadow(0px 4px 4px #00000040);
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    padding: 5px;
}

/* Couleurs dynamiques */
.white {
    color: white;
    filter: drop-shadow(0px 4px 4px #00000040);
}

.black {
    color: black;
    filter: drop-shadow(0px 4px 4px #00000040);
}

.red {
    color: #cf0000;
    filter: drop-shadow(0px 4px 4px #00000040);
}

.message {
    font-size: 24px;
    text-align: center;
    color: #cf0000;
    filter: drop-shadow(0px 4px 4px #00000040);
}
</style>