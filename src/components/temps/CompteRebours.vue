<template>
  <div v-if="timeLeft > 0" class="countdown">
    <div class="countdown__timer">{{ formattedTime }}</div>
    <div class="countdown__labels">
      <p>jours</p>
      <p>heures</p>
      <p>minutes</p>
      <p>secondes</p>
    </div>
  </div>

  <div v-else class="countdown-complete">
    <h1>🚀 Temps écoulé !</h1>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue';

const props = defineProps({
  targetDate: {
    type: String,
    required: true,
  },
  timeZoneOffset: {
    type: Number,
    default: -2, // Default offset of -2 hours
  }
});

// Time calculation functions
const calculateAdjustedTargetTime = () => {
  const targetTime = new Date(props.targetDate);
  return new Date(targetTime.getTime() + (props.timeZoneOffset * 60 * 60 * 1000));
};

const calculateRemainingSeconds = () => {
  const now = new Date();
  const adjustedTargetTime = calculateAdjustedTargetTime();
  const difference = Math.floor((adjustedTargetTime - now) / 1000);
  return Math.max(0, difference);
};

// Reactive state
const timeLeft = ref(calculateRemainingSeconds());

// Format time components
const formatTimeUnit = (value) => String(value).padStart(2, '0');

const timeComponents = computed(() => {
  const days = Math.floor(timeLeft.value / (24 * 3600));
  const hours = Math.floor((timeLeft.value % (24 * 3600)) / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  
  return { days, hours, minutes, seconds };
});

const formattedTime = computed(() => {
  const { days, hours, minutes, seconds } = timeComponents.value;
  return `${formatTimeUnit(days)} : ${formatTimeUnit(hours)} : ${formatTimeUnit(minutes)} : ${formatTimeUnit(seconds)}`;
});

// Lifecycle hooks
let countdownInterval;

onMounted(() => {
  countdownInterval = setInterval(() => {
    timeLeft.value = calculateRemainingSeconds();
    if (timeLeft.value <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.countdown {
  text-align: center;
  background-color: transparent;
}

.countdown__timer {
  font-size: 48px;
  margin-bottom: 0;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  color: white;
}

.countdown__labels {
  margin-top: -5px;
  display: flex;
  justify-content: center;
  gap: 32px;
  font-size: 14px;
  color: white;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.countdown-complete {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: rgb(255, 255, 255);
}
</style>
