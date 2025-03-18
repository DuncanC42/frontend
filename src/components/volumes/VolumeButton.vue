<script setup>

import { ref } from 'vue';
import Menu from './VolumeMenu.vue'

const isMenuOpen = ref(false)

</script>

<template>
    <button :style="isMenuOpen ? 'opacity:0;':''" @click="isMenuOpen = true" class="settings">
        <font-awesome-icon :icon="['fas', 'gear']" class="icon" />
    </button>
    <button :style="!isMenuOpen ? 'opacity:0;':''"  @click="isMenuOpen = false" class="back">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon" />
    </button>
    <Menu v-if="isMenuOpen"></Menu>
</template>

<style scoped>
button {
    position: absolute;
    top: 5vh;
    color: white;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.3);
    border: none;
    backdrop-filter: blur(3px);
    transition: all ease-in-out 0.3s;
}

button:active{
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