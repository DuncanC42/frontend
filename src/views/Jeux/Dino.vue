<script setup>
    import PageExplicationJeu from '../../components/PageExplicationJeu.vue';
    import ImageDino from '../../assets/images/DinoExplication.png';
</script>

<template>
    <PageExplicationJeu id="pageExplication" PostItRotate="0deg" :ImageSrc="ImageDino"/>
</template>

<style scoped>
    #pageExplication {
        display: flex;
    }
</style>