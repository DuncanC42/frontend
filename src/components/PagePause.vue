<script setup>

import { ref } from 'vue';
import ButtonMenu from './buttons/ButtonMenu.vue';
import BlurFilter from './BlurFilter.vue';

const isPaused = ref(false)

</script>

<template>
    <ButtonMenu @click="isPaused = true" icon="pause" :classArray="['littleSize']" id="bouton"></ButtonMenu>
    <div v-show="isPaused" id="panel">
        <BlurFilter :is-open="true" style="z-index: 100;"></BlurFilter>
        <div id="pause-menu">
            <div>
                <h2>Pause</h2>
                <hr>
            </div>
            <div></div>
            <div class="button-list">
                <ButtonMenu icon="door-open" class-array="normalSize"></ButtonMenu>
                <ButtonMenu icon="rotate-right" class-array="normalSize"></ButtonMenu>
                <ButtonMenu icon="play" class-array="normalSize"></ButtonMenu>
            </div>
        </div>

    </div>
</template>

<style scoped>
#bouton {
    position: absolute;
    top: 150px;
    right: 15px;
    z-index: 100;
}

#panel {
    z-index: 101;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    padding-top: 10vh;
}

hr {
    width: 40vw;
    height: 2px;
    background-color: white;
    border-radius: 2px;
}

#pause-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 70vh;
    color: white;
    position: relative;
    z-index: 101;
}

h2 {
    font-size: xx-large;
    font-weight: normal;
    text-align: center;
}

.button-list {
    display: flex;
    gap: 10vw;
}
</style>