<script setup>
import NavBar from './components/NavBar.vue';
import Header from './components/Header.vue'
import VolumeButton from './components/volumes/VolumeButton.vue'
import { useMusic } from '@/composable/volumes';
import audio_mp3 from '@/assets/sons/musiques/ambiance/chill.mp3';

useMusic(audio_mp3);

</script>

<template>
  <div>
    <!-- <NavBar /> -->
    <Header></Header>
    <RouterView></RouterView>
    <VolumeButton></VolumeButton>
  </div>
  
</template>


<style scoped>
div {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
</style>