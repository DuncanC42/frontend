<script setup>
import Image from '../assets/images/PanneauLiege.png'
import Appartement from '@/assets/images/Appartement.png'
import FondEcran from '@/components/FondEcran.vue';
import JeuxStatus from '@/components/JeuxStatus.vue'
import { ref, onMounted } from 'vue';

import { useRouter } from 'vue-router'
const router = useRouter();

// Tableau temporaire renvoyé plus tard par l'api : completed / locked / unlocked
const status = {
    jeux1: 'completed',
    jeux2: 'completed',
    jeux3: 'unlocked',
    jeux4: 'locked',
    jeux5: 'locked',
}

const ready = ref(false)

const handleClick = (numero, status) => {
    if (status !== 'locked') {
        let route = ''
        switch (numero) {
            case 1:
                route = 'taquin'
                break;
            case 2:
                route = 'tirelire'
                break;
            case 3:
                route = 'dino'
                break;
            case 4:
                route = 'frigo'
                break;
            case 5:
                route = 'dents'
                break;
            default:
                break;
        }
        router.push(route)
    }
}

onMounted(() => {
    const appartementWrapper = document.getElementById('appartement-wrapper');
    if (appartementWrapper) {
        appartementWrapper.classList.add('zoom-in'); // Trigger zoom animation
    }

    setTimeout(() => {
        ready.value = true;

    }, 3000);

    setTimeout(() => {
        document.getElementById('blur').classList.add('blur');
        setTimeout(() => {

            document.getElementById('blur').classList.remove('blur');

        }, 500);
    }, 2500);

    setTimeout(() => {
        document.getElementById('blur').classList.add('blur');
        setTimeout(() => {

            document.getElementById('blur').classList.remove('blur');

        }, 300);
    }, 4000);
})
</script>


<template>

    <Transition name="zoom" appear="">
        <img :src="Appartement" v-show="!ready" id="appartement">
    </Transition>
    <div v-show="ready">
        <FondEcran :image="Image"></FondEcran>
        <div v-for="i in 5" @click="handleClick(i, status['jeux' + i])" :key="'jeux-' + i" :id="'jeux-' + i"
            :class="status['jeux' + i] === 'locked' && 'locked'">
            <JeuxStatus :status="status['jeux' + i]"></JeuxStatus>
        </div>
    </div>
    <div id="blur"></div>
</template>

<style scoped>
#blur {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transition: all 0.5s ease-in-out;
}

/* General styles */
.locked {
    background-color: rgba(0, 0, 0, 0.5);
}

div {
    position: fixed;
    height: 50px;
    width: 50px;
}

#appartement {
    position: fixed;
    width: 100vw;
    bottom: 0;
    left: 0;
    transition: transform 3s ease-in-out;
    /* Smooth transition for zoom */
}

#appartement-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Positioning for game elements */
#jeux-1 {
    left: 13vw;
    bottom: 111.5vw;
    height: 25vw;
    width: 36.5vw;
    transform: rotate(-4deg);
}

#jeux-2 {
    left: 58vw;
    bottom: 98vw;
    height: 39vw;
    width: 28vw;
    transform: rotate(6deg);
}

#jeux-3 {
    left: 16.5vw;
    bottom: 75vw;
    height: 30vw;
    width: 29.5vw;
    transform: rotate(2deg);
}

#jeux-4 {
    left: 50vw;
    bottom: 62vw;
    height: 31vw;
    width: 42.5vw;
}

#jeux-5 {
    left: 33.9vw;
    bottom: 44vw;
    height: 23vw;
    width: 23vw;
    transform: rotate(-10deg);
}

.zoom-enter-from {
    transform: scale(1);
    transform-origin: 50% 20%;
}

.zoom-enter-active {
    transition: transform 3s ease-in-out;
}

.zoom-enter-to {
    transform: scale(3.3);
    transform-origin: 40% 42%;
}


.blur {
    backdrop-filter: blur(100px);
    background-color: rgba(0, 0, 0, 0.7);
    transition: all 0.1s ease-in-out;
}

.anti-blur {
    transition: all 0.1s ease-in-out;
}
</style>