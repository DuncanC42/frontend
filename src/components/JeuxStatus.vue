<script setup>
import Checked from '../assets/images/checked.png';
import Lock from '../assets/images/lock.png'
import Exclamation from '../assets/images/point-exclamation.png'

defineProps({
    status: {
        type: String,
        required: true
    }
})

</script>
<template>
    <img v-if="status === 'completed'" :src="Checked" class="icon" alt="checked">
    <img v-else-if="status === 'locked'" :src="Lock" class="icon" alt="locked">
    <img v-else :src="Exclamation" class="icon bounce" alt="to-do">
</template>

<style scoped>
.icon {
    position: absolute;
    right: -3vw;
    top: -3vw;
    height: 30px;
    width: 30px;
}

.bounce {
    animation: bounce 1.5s infinite ease-in-out;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-10px) scale(1.2);
    }
}
</style>