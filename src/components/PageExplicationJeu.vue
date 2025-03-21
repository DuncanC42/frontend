<script setup>
import PostIt from './Post-it.vue';

const props = defineProps({
    ImageSrc: {
        type: String, 
        required: true
    },
    PostItRotate: {
        type: String, 
        default: '0deg'
    }
});

// Convertit le chemin en URL correcte pour Vite
</script>

<template>
    <div class="page-explication-jeu">
        <img class="backgroundImage" :src="ImageSrc" alt="image non trouvée"/>
        <PostIt :style="{ transform: `rotate(${PostItRotate})` }" class="postit" text-post-it="Amélie adore manger des pizzas accompagnées d’un soda, même si elle sait que pas top pour sa santé…"></PostIt>
    </div>
</template>


<style scoped>
.page-explication-jeu {
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    width: 100vw; /* Largeur 100% de l'écran */
    height: 100vh; /* Hauteur 100% de l'écran */
    overflow: hidden; /* Empêche le scroll */
}

.page-explication-jeu img {
    width: 100vw;
    height: 100vh;
    object-fit: cover; /* Ajuste l'image sans déformation */
}

.postit {
    top: 35%;
}

</style>