<script setup>

import Image from '../assets/images/PanneauLiege.png'
import FondEcran from '@/components/FondEcran.vue';
import JeuxStatus from '@/components/JeuxStatus.vue'
import BlurFilter from '@/components/BlurFilter.vue';
import Loader from '@/components/Loader.vue';
import PostIt from '@/components/Post-it.vue';

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

</script>

<template>
    
    <FondEcran :image="Image"></FondEcran>
    <div v-for="i in 5" @click="handleClick(i, status['jeux' + i])" :key="'jeux-' + i" :id="'jeux-' + i"
        :class="status['jeux' + i] === 'locked' && 'locked'">
        <JeuxStatus :status="status['jeux' + i]"></JeuxStatus>
    </div>
    <PostIt></PostIt>

    
</template>

<style scoped>
.locked {
    background-color: rgba(0, 0, 0, 0.5);
}

div {
    position: fixed;
    height: 50px;
    width: 50px;
}

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
</style>