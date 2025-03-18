<!--  <h1>🕒 Compte à rebours test</h1>                 -->
<!--  <CompteRebours targetDate="2025-03-18T09:00:00" /> -->

<template>
  <div v-if="timeLeft > 0" class="countdown">
    <div class="minuteur">{{ formattedTime }}</div>
    <div class="chrono">
      <p class="p1">jours</p>
      <p class="p2">heures</p>
      <p class="p3">minutes</p>
      <p class="p4">secondes</p>
    </div>
  </div>

  <div v-else class="message">
    <h1>🚀 Temps écoulé !</h1>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue';

// 🕒 Recevoir la date cible en prop
const props = defineProps({
  targetDate: String,
});

// 📌 Convertir la date cible en objet Date
const targetTime = new Date(props.targetDate);

// 🕰️ Initialiser le temps restant
const timeLeft = ref(getRemainingTime());

// Fonction pour calculer le temps restant en secondes
function getRemainingTime() {
  const now = new Date();
  const difference = Math.floor((targetTime - now) / 1000);
  return difference > 0 ? difference : 0;
}

// Formater le temps en JJ:HH:MM:SS
const formattedTime = computed(() => {
  const days = Math.floor(timeLeft.value / (24 * 3600));
  const hours = Math.floor((timeLeft.value % (24 * 3600)) / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  return `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
});

// Mettre à jour le compte à rebours chaque seconde
onMounted(() => {
  const countdownInterval = setInterval(() => {
    timeLeft.value = getRemainingTime();
    if (timeLeft.value <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
});
</script>

<style scoped>
  .countdown {
    text-align: center;
    background-color: #494646;
  }
  .minuteur {
    font-size: 48px;
    margin-bottom: 0;
    filter: drop-shadow(0px 4px 4px #00000040);
    color: white;
  }
  .message {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: red;
  }
  .chrono {
    margin-top: -5px;
    display: flex;
    font-size: 14px;
    color: white;
    filter: drop-shadow(0px 4px 4px #00000040);
  }
  .chrono .p1 {
    margin-left: 74px;
    font-weight: bold;
  }
  .chrono .p2 {
    margin-left: 44px;
    font-weight: bold;
  }
  .chrono .p3 {
    margin-left: 35px;
    font-weight: bold;
  }
  .chrono .p4 {
    margin-left: 28px;
    font-weight: bold;
  }
</style>
