<template>
    <div class="main">
        <BlurFilter :is-open="true"></BlurFilter>
        <FondEcran :image="Appartement"></FondEcran>
        <div class="stats-title">
            <font-awesome-icon id="icon" :icon="['fas', 'chart-line']" />
            <h1>Mes Stats</h1>
        </div>
        <div class="stats-list">
            <table class="stats-table">
                <tr id="header-table">
                    <th>Catégories</th>
                    <th>Temps de jeu</th>
                    <th>Nombre de parties</th>
                </tr>
                <tr><td id="trait-hr" colspan="3"><hr></td></tr>
                <tr>
                    <td>Général</td>
                    <td>{{ tempsJeuTotal }}</td>
                    <td>{{ nbPartiesGeneral }}</td>
                </tr>
                <tr>
                    <td>Carte Vitale</td>
                    <td>{{ formatTemps(getStat(6, 'temps_jeu')) }}</td>
                    <td>{{ getStat(6, 'nb_essais') }}</td>
                </tr>
                <tr>
                    <td>C2S</td>
                    <td>{{ formatTemps(getStat(7, 'temps_jeu')) }}</td>
                    <td>{{ getStat(7, 'nb_essais') }}</td>
                </tr>
                <tr>
                    <td>RIB</td>
                    <td>{{ formatTemps(getStat(8, 'temps_jeu')) }}</td>
                    <td>{{ getStat(8, 'nb_essais') }}</td>
                </tr>
                <tr>
                    <td>Examen de prévention</td>
                    <td>{{ formatTemps(getStat(9, 'temps_jeu')) }}</td>
                    <td>{{ getStat(9, 'nb_essais') }}</td>
                </tr>
                <tr>
                    <td>M'T Dents</td>
                    <td>{{ formatTemps(getStat(10, 'temps_jeu')) }}</td>
                    <td>{{ getStat(10, 'nb_essais') }}</td>
                </tr>

            </table>
        </div>
        <NavBar></NavBar>
    </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import BlurFilter from '@/components/BlurFilter.vue';
import Appartement from '@/assets/images/Appartement.png';
import FondEcran from '@/components/FondEcran.vue';
import NavBar from '@/components/NavBar.vue';
import { fetchBackend } from '@/composable/fetchBackend.js';

const donnees = ref(null);

const getStat = (jeuId, key) => {
    return donnees.value?.[jeuId]?.[key] || 0;
};

// Fonction pour formater le temps en secondes, minutes, heures
const formatTemps = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
};

// Calcul du nombre total de parties
const nbPartiesGeneral = computed(() => {
    return [6, 7, 8, 9, 10].reduce((total, jeuId) => total + getStat(jeuId, 'nb_essais'), 0);
});

// Calcul du temps de jeu total et formatage
const tempsJeuTotal = computed(() => {
    const totalSeconds = [6, 7, 8, 9, 10].reduce((total, jeuId) => total + getStat(jeuId, 'temps_jeu'), 0);
    return formatTemps(totalSeconds);
});

fetchBackend('api/stats', 'GET')
    .then((response) => {
        console.log(response.data);
        donnees.value = response.data; // Mise à jour des données
    })
    .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
    });
</script>





<style scoped>

    .stats-title {
        z-index: 100;
        display: flex;
        align-items: center;
        color: white;
        margin-top: 4em;
    }

    .stats-title h1 {
        font-size: 36px;
        margin-left: 1rem;
        font-weight: 200;
        color: white;
    }

    #icon {
        font-size: 2rem;
        margin-right: 1rem;
        color: white;
    }

    tr td:first-of-type {
        text-align: left;
    }
 
    .stats-list[data-v-936f1ac2] {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 2.5rem;
        padding: 1rem;
        z-index: 100;
        width: 70%;
        height: 60%;
    }

    .stats-table th {   
        padding: 1rem;
        width: 33%;
    }

    #trait-hr {
        padding: 0px;
    }

    #trait-hr hr {
        background-color: black;
    }

    #header-table td {
        width: 33%;
        text-align: center;

    }

    td {
        padding: 10px;
        text-align: center;
    }

    .main {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 70vh;
        width: 100vw;
    }
</style>
