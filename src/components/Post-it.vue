<template>
    <div class="postit">
        <img src="../assets/images/post-it.png" alt="post-it">
        <p class="postit-text">{{ textPostIt }}</p>
    </div>
</template>

<script setup>
    const props = defineProps({
        textPostIt: {
            type: String, 
            default:'Il y a un post-it'
        },
        
    });

    //exemple d'utilisation : <ButtonIdenticator label="Primary" classArray="primary"></ButtonIdenticator>
</script>

<style scoped>
.postit {
    position: absolute;
    width: 100%; /* Ajuste selon la taille de ton post-it */
    height: 380px; /* Ajuste selon la taille de ton post-it */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.postit img {
    width: 320px;
    height: 320px;
    object-fit: cover;
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.2));
}

.postit-text {
    position: absolute;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    max-width: 70%;
    word-wrap: break-word;
    rotate: 5deg;
}
</style>