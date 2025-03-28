<template>
    <div class="minuteur" :class="currentColor">
        {{ formattedTime }}
        <font-awesome-icon :icon="['fas', 'stopwatch']" :class="currentColor" />
    </div>  
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  couleur: String,
  duree: {
    type: Number,
    default: 60
  },
  isPaused: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['finTimer', 'timeUpdate']);

const timeLeft = ref(props.duree);
let timer = null;

const formattedTime = computed(() => {
    const minutes = Math.floor(Math.max(0, timeLeft.value) / 60);
    const seconds = Math.max(0, timeLeft.value) % 60;
    return `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
});

// Changer la couleur si < 10 sec
const currentColor = computed(() => {
    return timeLeft.value < 10 ? 'red' : props.couleur;
});

const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
            emit('timeUpdate', timeLeft.value);
            // Solution mobile: forcer le rendu via une réassignation
            const temp = timeLeft.value;
            timeLeft.value = null;
            timeLeft.value = temp;
        } else {
            stopTimer();
            emit('finTimer');
        }
    }, 1000);
};

const pauseTimer = () => {
  stopTimer();
};

const resumeTimer = () => {
  if (!timer && timeLeft.value > 0) {
    startTimer();
  }
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const resetTimer = () => {
  stopTimer();
  timeLeft.value = props.duree; // Réinitialise à la durée initiale
  emit('timeUpdate', timeLeft.value); // Important pour mettre à jour l'affichage
};

// Exposez les méthodes au parent
defineExpose({
  pauseTimer,
  resumeTimer,
  resetTimer,
  stopTimer,
  startTimer
});

watch(() => props.isPaused, (isPaused) => {
  // Cette logique est maintenant gérée par les méthodes explicites
});

onMounted(() => {
  timeLeft.value = props.duree;
  startTimer();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

</script>
  
<style scoped>
.minuteur {
    font-size: 30px;
    text-align: center;
    background-color: #c4c4c448;
    border-radius: 10px;
    filter: drop-shadow(0px 4px 4px #00000040);
    padding: 5px;
    margin-left: 9em;
    margin-top: 5px;
    /* Styles critiques */
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative;
    z-index: 100;
}

/* Couleurs dynamiques */
.white { color: white !important; }
.black { color: black !important; }
.red { color: #cf0000 !important; }

.message {
    font-size: 24px;
    text-align: center;
    color: #cf0000;
    filter: drop-shadow(0px 4px 4px #00000040);
}

.minuteur.red {
    animation: pulse 1s infinite alternate;
}

@keyframes pulse {
    from { opacity: 1; }
    to { opacity: 0.7; }
}
</style>
