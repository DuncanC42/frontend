<script setup>

import { ref } from 'vue';
import Menu from './VolumeMenu.vue'

const isMenuOpen = ref(false)

</script>

<template>
    <button :style="isMenuOpen ? 'opacity:0;' : ''" @click="isMenuOpen = true" class="settings">
        <font-awesome-icon :icon="['fas', 'gear']" class="icon" />
    </button>
    <button :style="!isMenuOpen ? 'opacity:0;' : ''" @click="isMenuOpen = false" class="back">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon" />
    </button>

    <!-- temporaire en attendant le composant filtre -->
    <div v-if="isMenuOpen" id="blur"></div>
    <div v-if="isMenuOpen" id="menu">
        <Menu></Menu>
    </div>

</template>

<style scoped>
#blur {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
}

#menu {
    position: fixed;
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 70%;
    top: 0;
    left: 0;
    z-index: 5;
}

button {
    position: absolute;
    top: 16vh;
    z-index: 10;
    color: white;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.3);
    border: none;
    backdrop-filter: blur(2px);
    transition: all ease-in-out 0.3s;
}

button:active {
    transform: scale(0.5);

}

.settings {
    right: 5vh;
}

.back {
    left: 5vh;
}

.icon {
    font-size: 20px;
}
</style>