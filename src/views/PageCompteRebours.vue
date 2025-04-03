<script setup>
import CompteRebours from '@/components/temps/CompteRebours.vue';
import Appartement from '@/assets/images/Appartement.png';
import FondEcran from '@/components/FondEcran.vue';
import BlurFilter from '@/components/BlurFilter.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const handleAccueil = () => {
    router.push('/')
}

defineProps({
    date_ouverture: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <BlurFilter :is-open="true"></BlurFilter>
    <FondEcran :image="Appartement"></FondEcran>
    <div class="content">
        <h1>Ouverture du serious game dans</h1>
        <div v-if="!date_ouverture" class="loading">
            <font-awesome-icon :icon="['fas', 'spinner']" />
            <span>Chargement...</span>
        </div>
        <CompteRebours v-else :targetDate="date_ouverture" class="compte-rebours"></CompteRebours>
        <button @click="handleAccueil">Revenir à la page d'accueil</button>
    </div>
</template>

<style scoped>
.content {
    z-index: 101;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 50px;
}

h1 {
    font-size: 1.5rem;
}

button{
    background-color: #00000068;
    border: 2px solid rgba(255, 255, 255, 0.583);
    border-radius: 10px;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:active{
    scale: 0.8;
}

.loading {
    color: #ffffffa2;
    font-size: xx-large;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: bold;
}

.loading svg {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>