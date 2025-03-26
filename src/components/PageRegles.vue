<script setup>
import BlurFilter from './BlurFilter.vue';
import ButtonBack from './buttons/ButtonBack.vue';

const emit = defineEmits(['back', 'pageClicked'])

const handleBack = () => {
    emit('back')
}

const handlePageClick = (event) => {
    if (!event.target.closest('.back')) {
        emit('pageClicked')
    }
}
</script>

<template>
    <div class="menu-regles" @click="handlePageClick">
        <BlurFilter :is-open="true"></BlurFilter>
        <ButtonBack @click="handleBack" class="back"></ButtonBack>
        <div class="content-regles">
            <slot></slot>
        </div>
        <span>Appuyer pour continuer</span>
    </div>
</template>

<style scoped>
.menu-regles {
    z-index: 100;
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8vh;
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
    text-align: center;
}
</style>