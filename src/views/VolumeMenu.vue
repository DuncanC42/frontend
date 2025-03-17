<script setup>

import { ref, watch } from 'vue'

import { volumeStore } from '@/stores/volume';
const volumes = volumeStore();

const musique_volume = ref(50)
const effets_sonores_volume = ref(50)

watch(musique_volume, () => {
    volumes.setMusique(musique_volume.value)
})

watch(effets_sonores_volume, () => {
    volumes.setEffetSonore(musique_volume.value)
})

</script>

<template>
    <div class="page">
        <div class="title">
            <font-awesome-icon class="icon" :icon="['fas', 'gear']" />
            <h1>Sons et musiques</h1>
        </div>
        <div class="slider">
            <font-awesome-icon class="icon" :icon="['fas', 'music']" />
            <input v-model="musique_volume" type="range" class="level">
            <span>{{ musique_volume }}</span>
        </div>
        <div class="slider">
            <font-awesome-icon class="icon" :icon="['fas', 'volume-high']" />
            <input v-model="effets_sonores_volume" type="range" class="level">
            <span>{{ effets_sonores_volume }}</span>
        </div>
    </div>
</template>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10vh;
    margin-top: 20vh;
}

.title {
    display: flex;
    align-items: center;
    gap: 20px;

}

.title>h1 {
    font-size: 36px;
}

.icon {
    font-size: larger;
    width: 30px;
    height: 30px;
}


.slider {
    --slider-height: 6px;
    --slider-bg: rgb(82, 82, 82);
    --slider-border-radius: 999px;
    --level-color: #ffffff;
    --level-transition-duration: .1s;
    --icon-margin: 15px;
    --icon-color: var(--slider-bg);
    --icon-size: 25px;
    gap: 10px;
    cursor: pointer;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.slider .level {

    width: 100vw;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    height: var(--slider-height);
    background: var(--slider-bg);
    overflow: hidden;
    border-radius: var(--slider-border-radius);
    -webkit-transition: height var(--level-transition-duration);
    -o-transition: height var(--level-transition-duration);
    transition: height var(--level-transition-duration);
    cursor: inherit;
}

.slider .level::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0;
    height: 0;
    -webkit-box-shadow: -200px 0 0 200px var(--level-color);
    box-shadow: -200px 0 0 200px var(--level-color);
}
</style>