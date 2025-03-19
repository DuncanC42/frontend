<script setup>

defineProps({
    image : {
        type : String,
        required : true
    }
})

// Avec phaser : etendre image de fond (scale ?)

</script>

<template>
    <img :src="image" id="fond-ecran" alt="fond-ecran">
</template>

<style scoped>

#fond-ecran{
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: -1;
}
</style>