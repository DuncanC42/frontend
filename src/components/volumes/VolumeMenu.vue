<script setup>

import { ref, watch } from 'vue'

import { volumeStore } from '@/stores/volume';
const volumes = volumeStore();

const musique_volume = ref(Math.sqrt(volumes.musique) * 100)
const effets_sonores_volume = ref(Math.sqrt(volumes.effet_sonore) * 100)

watch(musique_volume, () => {
    volumes.setMusique(musique_volume.value)
})

watch(effets_sonores_volume, () => {
    volumes.setEffetSonore(effets_sonores_volume.value)
})

</script>

<template>
    <div class="page">
        <div class="title">
            <font-awesome-icon class="icon" :icon="['fas', 'gear']" />
            <h1>Sons et musiques</h1>
        </div>
        <div class="slider">
            <font-awesome-icon v-if="musique_volume > 0" class="icon" :icon="['fas', 'music']" />
            <font-awesome-icon v-else class="icon" :icon="['fas', 'music']" />
            <font-awesome-icon v-if="musique_volume == 0" class="icon slash" :icon="['fas', 'slash']" />

            <input v-model="musique_volume" type="range" class="level">
            <span>{{ musique_volume }}</span>
        </div>
        <div class="slider">
            <font-awesome-icon v-if="effets_sonores_volume > 0" class="icon" :icon="['fas', 'volume-high']" />
            <font-awesome-icon v-else class="icon" :icon="['fas', 'volume-xmark']" />
            <input v-model="effets_sonores_volume" type="range" class="level">
            <span>{{ effets_sonores_volume }}</span>
        </div>
    </div>
</template>

<style scoped>
/* Global styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #292929;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

#app {
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

/* Component-specific styles */
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 10vh;
    margin-top: 20vh;
    color: white;
}

.title {
    display: flex;
    align-items: center;
}

.title>h1 {
    font-size: 36px;
}

.icon {
    font-size: larger;
    height: 30px;
    width: 60px;
}

.slash {
    position: absolute;
    translate: -7px;
}

span {
    width: 20px;
}

.slider {
    width: 80vw;
    --slider-height: 12px;
    /* Increased height */
    --slider-bg: rgba(251, 251, 251, 0.189);
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
    /* Apply the increased height */
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