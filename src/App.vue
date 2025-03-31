<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useLoader } from '@/composable/loader'; // Import the loader store
import { useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Header from './components/Header.vue';
import { useMusic } from '@/composable/volumes';
import audio_mp3 from '@/assets/sons/musiques/ambiance/chill.mp3';
import Loader from './components/Loader.vue';

useMusic(audio_mp3);

const { isLoading, showLoader, hideLoader } = useLoader();
const router = useRouter();

onMounted(async () => {
	showLoader();
	await router.isReady(); // Wait for the router to be ready
	setTimeout(() => {
		hideLoader();
	}, 500); // Adjust delay for smooth transition
});

onUnmounted(() => {
	showLoader(); // Show loader when the component is unmounted
});

router.beforeEach((to, from, next) => {
	showLoader();
	next();
});

router.afterEach(async () => {
	await router.isReady(); // Wait for the router to be ready
	setTimeout(() => {
		hideLoader();
	}, 500); // Adjust delay for smooth transition
});
</script>

<template>
	<div>
		<Loader v-if="isLoading" />
		<!-- <NavBar /> -->
		<Header></Header>
		<RouterView v-show="!isLoading"></RouterView>
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