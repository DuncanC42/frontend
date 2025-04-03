<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
defineEmits(['continue']);

import PostIt from './Post-it.vue';
import ButtonBack from './buttons/ButtonBack.vue';
import NavBar from './NavBar.vue';

const router = useRouter();
const buttonRef = ref(null);

const props = defineProps({
    ImageSrc: {
        type: String, 
        required: true
    },
    PostItRotate: {
        type: String, 
        default: '0deg'
    },
    TexteIntroduction: {
        type: String, 
        required: true,
        default: ''
    }
});

const handleBackClick = () => {
    router.push('/home'); 
};

// Attache l'événement après le montage
onMounted(() => {
  if (buttonRef.value?.$el) {
    buttonRef.value.$el.addEventListener('click', handleBackClick);
  }
});

onUnmounted(() => {
  if (buttonRef.value?.$el) {
    buttonRef.value.$el.removeEventListener('click', handleBackClick);
  }
});

</script>

<template>
    <ButtonBack ref="buttonRef"/>
    <div class="page-explication-jeu">
        <img class="backgroundImage" :src="ImageSrc" alt="image non trouvée"/>
        <PostIt :style="{ transform: `rotate(${PostItRotate})` }" class="postit" :text-post-it=TexteIntroduction></PostIt>
        
        <!-- Bouton continuer stylisé comme le span -->
        <button class="continue-button" @click="$emit('continue')">
            Appuyer pour continuer
        </button>
    </div>
    <NavBar/>
</template>


<style scoped>
.page-explication-jeu {
    display: flex;
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.page-explication-jeu img {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
}

.postit {
    top: 40%;
}

.continue-button {
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 101;
    font-size: x-large;
    color: black;
    background: transparent;
    border: none;
    cursor: pointer;
    animation: pulse 2s infinite;
    padding: 10px 20px;
    width: 15em;
    filter: drop-shadow(0px 4px 4px #fff);
}

.continue-button:hover {
    opacity: 0.8;
}

@keyframes pulse {
    0% { opacity: 0.7; transform: translateX(-50%) scale(0.95); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
    100% { opacity: 0.7; transform: translateX(-50%) scale(0.95); }
}
</style>