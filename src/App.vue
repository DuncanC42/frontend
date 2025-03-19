<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import PageBienvenue from './views/PageBienvenue.vue';
import PageErreur from './views/PageErreur.vue'
import PanneauJeux from './views/PanneauJeux.vue';
import FondEcran from './components/FondEcran.vue'; 
import Header from './components/Header.vue'

import VolumeButton from './components/volumes/VolumeButton.vue'
import { useMusique } from './composable/volumes'
useMusique();

const width = ref(window.innerWidth);

const updateWidth = () => {
	width.value = window.innerWidth;
};

onMounted(() => {
	window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateWidth);
});
</script>

<template>
	<div>
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