<!--
<Chronometre couleur="black"/>
<Chronometre couleur="white"/>
-->
<template>
    <div>
        <div class="chronometre" :class="couleur">
            {{ formattedTime }}
            <font-awesome-icon :icon="['fas', 'stopwatch']" :class="couleur" />
        </div>
        <div class="buttons">
            <button @click="startStop">{{ isRunning ? '⏸ Pause' : '▶ Démarrer' }}</button>
            <button @click="reset">🔄 Réinitialiser</button>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, computed } from 'vue';
  
    // 🎨 Recevoir la couleur en prop
    const props = defineProps({
        couleur: String, // Ex: "white" ou "black"
    });
  
    const timeElapsed = ref(0); // Temps écoulé en secondes
    const isRunning = ref(false);
    let timer = null;
    
    // ⏱ Formater le temps en MM:SS
    const formattedTime = computed(() => {
        const minutes = Math.floor(timeElapsed.value / 60);
        const seconds = timeElapsed.value % 60;
        return `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
    });
  
    // ▶ Démarrer ou ⏸ arrêter le chronomètre
    const startStop = () => {
        if (isRunning.value) {
        clearInterval(timer);
        } else {
        timer = setInterval(() => {
            timeElapsed.value++;
        }, 1000);
        }
        isRunning.value = !isRunning.value;
    };
  
    // 🔄 Réinitialiser le chronomètre
    const reset = () => {
        clearInterval(timer);
        timeElapsed.value = 0;
        isRunning.value = false;
    };
</script>
    
<style scoped>
    .chronometre {
        font-size: 32px;
        text-align: center;
        background-color: #c4c4c448;
        border-radius: 10px;
        margin: 0 150px;
        filter: drop-shadow(0px 4px 4px #00000040);
    }
  
    /* 🎨 Couleurs dynamiques */
    .white {
        color: white;
    }
    
    .black {
        color: black;
    }
    
    .buttons {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    
    button {
        padding: 10px 20px;
        margin: 0 5px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    
    button:first-child {
        background-color: #28a745;
        color: white;
    }
    
    button:nth-child(2) {
        background-color: #dc3545;
        color: white;
    }
</style>
  