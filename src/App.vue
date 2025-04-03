<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useLoader } from '@/composable/loader'; // Import the loader store
import { useRouter } from 'vue-router';
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
		<Header></Header>
		<div class="gradient"></div>
		<RouterView></RouterView>
	</div>
</template>

<style scoped>
div {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
}

.gradient{
	position: fixed;
	z-index: -999;
	top: 85px;
	left: 0;
	height: 100vh;
	width: 100vw;
	background: linear-gradient( rgb(255, 255, 255), rgb(13, 0, 255))
}
</style>