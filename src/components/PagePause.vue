<script setup>

import { ref, computed } from 'vue';
import ButtonMenu from './buttons/ButtonMenu.vue';
import BlurFilter from './BlurFilter.vue';

const isPaused = ref(false)

const props = defineProps({
    time: {
        type: Number,
        default: 0
    },
})

const timeToDisplay = computed(() => {
    const minutes = Math.floor(props.time / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (props.time % 60)
        .toString()
        .padStart(2, '0');
    return `${minutes}'${seconds}`;
})

const emit = defineEmits(['pause', 'unpause', 'retry', 'leave'])

const handlePause = () => {
    isPaused.value = true
    emit('pause')
}

const handleUnpause = () => {
    isPaused.value = false
    emit('unpause')
}

const handleLeave = () => {
    emit('leave')
}

const handleRetry = () => {
    emit('retry')
}

</script>

<template>
    <ButtonMenu @click="handlePause" icon="pause" :classArray="['littleSize']" id="bouton"></ButtonMenu>
    <div v-show="isPaused" id="panel">
        <BlurFilter :is-open="true" style="z-index: 100;"></BlurFilter>
        <div id="pause-menu">
            <div>
                <h2>Pause</h2>
                <hr>
            </div>
            <div class="timer">
                <span>{{ timeToDisplay }}</span>
                <font-awesome-icon :icon="['fas', 'stopwatch']" />

            </div>
            <div class="button-list">
                <ButtonMenu @click="handleLeave" icon="door-open" :class-array="['normalSize']"></ButtonMenu>
                <ButtonMenu @click="handleRetry" icon="rotate-right" :class-array="['normalSize']"></ButtonMenu>
                <ButtonMenu @click="handleUnpause" icon="play" :class-array="['normalSize']"></ButtonMenu>
            </div>
        </div>

    </div>
</template>

<style scoped>
#bouton {
    position: absolute;
    top: 70px;
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

.timer {
    font-size: xx-large;
}

.timer span {
    margin-right: 10px;
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