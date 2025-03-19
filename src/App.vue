<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from './components/NavBar.vue';
import Header from './components/Header.vue'
import VolumeButton from './components/volumes/VolumeButton.vue'
import { useMusique } from './composable/volumes'
useMusique();


onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>

<template>
  <div>
    <NavBar /> <!-- Barre de navigation -->
    <Header></Header>
    <RouterView></RouterView>
    <VolumeButton></VolumeButton>
  </div>
</template>


<style scoped>
div{
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
}

</style>