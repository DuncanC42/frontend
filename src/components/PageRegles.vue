<script setup>
import BlurFilter from './BlurFilter.vue';

const emit = defineEmits(['back', 'pageClicked'])

const handlePageClick = () => {
    emit('pageClicked')
}
</script>

<template>
    <div class="menu-regles">
        <BlurFilter :is-open="true"></BlurFilter>
        <div class="content-regles" @click="handlePageClick">
            <slot></slot>
        </div>
        <span @click="handlePageClick">Appuyer pour continuer</span>
    </div>
</template>

<style scoped>
.menu-regles {
    z-index: 100;
    position: absolute;
    top: -5em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4vh;
    height: 100%;
    left: 0;
}

span {
    z-index: 101;
    font-size: x-large;
    color: white;
    animation: pulse 2s infinite;
}

/* Animation pulse from grey to white */
@keyframes pulse {
    0% {
        color: grey;
        transform: scale(1);
    }

    50% {
        color: white;
        transform: scale(1.05);
    }

    100% {
        color: grey;
        transform: scale(1);
    }
}

/* I want an animation pulse from grey to white like tailwind animate-pulse*/
.back {
    z-index: 101;
}

.content-regles {
    z-index: 101;
    position: relative;
    color: white;
    font-size: x-large;
    padding: 5vw;
    padding-top: 15vh;
    text-align: center;
}
</style>