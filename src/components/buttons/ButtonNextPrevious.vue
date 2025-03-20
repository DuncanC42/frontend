<template>
    <button>
        <font-awesome-icon 
            v-if="isPrevious" 
            class="icon button" 
            :icon="['fas', 'angle-left']"
        />
        {{ buttonLabel }}
        <font-awesome-icon 
            v-if="isNext" 
            class="icon button" 
            :icon="['fas', 'angle-right']"
        />
    </button>  
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    classArray: Array
});

// Vérifie si le bouton est "Suivant" ou "Précédent"
const isNext = computed(() => props.classArray?.includes("next"));
const isPrevious = computed(() => props.classArray?.includes("previous"));

// Détermine automatiquement le texte
const buttonLabel = computed(() => (isNext.value ? "Suivant" : "Précédent"));
</script>

<style scoped>
button {
    border-radius: 50px;
    border: none;
    transition: all ease 0.2s;
    width: 84px;
    height: 30px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    font-family: 'Source Sans Pro';
    background-color: rgba(255, 255, 255, 0.3);
}

button:active {
    transform: scale(0.9);
    transition: all ease 0.2s;
}

.icon {
    color: white;
    font-size: 18px;
}
</style>
