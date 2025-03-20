<template>
    <button :class="buttonClass">
        {{ buttonLabel }}
        <font-awesome-icon class="icon button" :icon="iconClass" />
    </button>  
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    classArray: Array
});

// Configuration des styles et icônes selon le type
const buttonConfig = {
    share: { label: "Partager", class: "share", iconClass: "fa-solid fa-share-nodes" },
    continue: { label: "Continuer", class: "continue", iconClass: "fa-forward-step" },
    retry: { label: "Réessayer", class: "retry", iconClass: "fa-rotate-right" }
};

// Détection automatique du type de bouton
const buttonType = computed(() => Object.keys(buttonConfig).find(type => props.classArray?.includes(type)));

// Applique la classe correspondante
const buttonClass = computed(() => buttonConfig[buttonType.value]?.class || "");

// Détermine le texte et l’icône
const buttonLabel = computed(() => buttonConfig[buttonType.value]?.label || "Bouton");
const iconClass = computed(() => `fas ${buttonConfig[buttonType.value]?.iconClass || "fa-question"}`);
</script>

<style scoped>
button {
    border: none;
    transition: all ease 0.2s;
    width: 114px;
    height: 45px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 15px;
    color: white;
    font-family: 'Source Sans Pro';
}

button:active {
    transform: scale(0.95);
    transition: all ease 0.2s;
}

.icon {
    font-size: 15px;
}

/* Couleurs selon le type */
.share { background-color: #655FBC; } /* Bleu */
.continue { background-color: rgba(0, 0, 0, 0.3); } /* Gris */
.retry { background-color: rgba(0, 0, 0, 0.3); } /* Rouge */

</style>
