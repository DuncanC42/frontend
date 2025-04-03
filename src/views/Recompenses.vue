<script setup>
import gift_1 from '@/assets/images/gift_1.png'
import gift_2 from '@/assets/images/gift_2.png'
import Appartement from '@/assets/images/Appartement.png'
import FondEcran from '@/components/FondEcran.vue';
import BlurFilter from '@/components/BlurFilter.vue';
import CompteRebours from '@/components/temps/CompteRebours.vue';
import { onMounted, ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { fetchBackend } from '@/composable/fetchBackend';

const limit = ref(null);

onMounted(() => {
    fetchBackend('intranet/parametres', 'GET')
        .then(response => {
            if (response.status === 200) {
                limit.value = response.data.dateCloture;
            } else {
                console.error('Erreur lors de la récupération des données :', response.status);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        })
})

</script>

<template>
    <div class="main">
        <BlurFilter :is-open="true"></BlurFilter>
        <FondEcran :image="Appartement"></FondEcran>
        <div class="countdown">
            <h1>Distribution des récompenses dans</h1>
            <CompteRebours v-if="limit" :target-date="limit"></CompteRebours>
            <div v-if="!limit" class="loading">
                <font-awesome-icon :icon="['fas', 'spinner']" />
                <span>Chargement...</span>
            </div>
        </div>
        <div class="gifts">
            <img :src="gift_1" alt="Image cadeau n°1">
            <img :src="gift_2" alt="Image cadeau n°2">
        </div>
        <NavBar></NavBar>
    </div>

</template>

<style scoped>
.main {
    display: flex;
    justify-content: space-evenly;
    color: white;
    text-align: center;
}

.main * {
    z-index: 100;
}

.countdown {
    padding: 0 10px;
}

.countdown h1 {
    text-decoration: underline;
    font-size: xx-large;
    font-weight: 500;
}

.gifts {
    display: flex;
    justify-content: space-between;
    padding: 2vw;
    height: 40vw;
}

img {
    width: 45vw;
}

img:first-of-type {
    align-self: flex-start;
}

img:last-of-type {
    align-self: flex-end;
}

.loading {
    color: #ffffffa2;
    font-size: xx-large;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
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