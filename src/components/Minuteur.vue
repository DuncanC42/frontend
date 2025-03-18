<!--
<Minuteur couleur="black"/>
<Minuteur couleur="white"/>
-->
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
    import { ref, computed, onMounted } from 'vue';
  
    // Recevoir la couleur en prop
    const props = defineProps({
    couleur: String, // Ex: "white" ou "black"
});
  
const timeLeft = ref(15); // 60 secondes (1 minute)
  
// Formater en MM:SS
const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
});
  
// Changer la couleur si < 10 sec
    const currentColor = computed(() => {
    return timeLeft.value < 10 ? 'red' : props.couleur;
});
  
// Démarrer le compte à rebours
onMounted(() => {
    const timer = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
        } else {
            clearInterval(timer);
        }
    }, 1000);
});
</script>
  
<style scoped>
    .minuteur {
        font-size: 32px;
        text-align: center;
        background-color: #c4c4c448;
        border-radius: 10px;
        margin: 0 150px;
        filter: drop-shadow(0px 4px 4px #00000040);

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
  