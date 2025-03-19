<script setup>
    import ButtonIdenticator from './components/buttons/ButtonIdenticator.vue';
    import ButtonMenu from './components/buttons/ButtonMenu.vue';
    import ButtonNextPrevious from './components/buttons/ButtonNextPrevious.vue';
    import ButtonEndGame from './components/buttons/ButtonEndGame.vue';import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from './components/NavBar.vue';
import Header from './components/Header.vue'
import VolumeButton from './components/volumes/VolumeButton.vue'
import { useMusique } from './composable/volumes'
useMusique();


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