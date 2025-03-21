<script setup>
import { computed } from 'vue';

const props = defineProps({
    time: Number,
    required: true
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

</script>

<template>
    <div>
        <span>{{ timeToDisplay }}</span>
        <font-awesome-icon :icon="['fas', 'stopwatch']" />
    </div>
</template>

<style scoped>
div {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 10px;
    top: 10px;
    right: 10px;
    font-size: 30px;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
    padding: 5px 20px;
    border-radius: 10px;
    color: rgb(52, 52, 52);
}
</style>