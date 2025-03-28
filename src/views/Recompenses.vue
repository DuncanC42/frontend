<script setup>
import gift_1 from '@/assets/images/gift_1.png'
import gift_2 from '@/assets/images/gift_2.png'
import Appartement from '@/assets/images/Appartement.png'
import FondEcran from '@/components/FondEcran.vue';
import BlurFilter from '@/components/BlurFilter.vue';
import CompteRebours from '@/components/temps/CompteRebours.vue';
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';

//TO DO : fetch la fin en base
const limit = ref('04/01/2025')
</script>

<template>
    <div class="main">
        <BlurFilter :is-open="true"></BlurFilter>
        <FondEcran :image="Appartement"></FondEcran>
        <div class="countdown">
            <h1>Distribution des récompenses dans</h1>
            <CompteRebours :target-date="limit"></CompteRebours>
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
</style>