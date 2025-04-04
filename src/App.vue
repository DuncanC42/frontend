<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useLoader } from '@/composable/loader'; // Import the loader store
import Header from './components/Header.vue';
import { useMusic } from '@/composable/volumes';
import audio_mp3 from '@/assets/sons/musiques/ambiance/chill.mp3';
import Loader from './components/Loader.vue';
import PageErreur from './views/PageErreur.vue';
import { useRouter } from 'vue-router';

useMusic(audio_mp3);

const { isLoading, showLoader, hideLoader } = useLoader();
const router = useRouter();
const ws = ref(null); // Référence pour le WebSocket

onMounted(async () => {
	// Ajoute un écouteur pour surveiller les changements de taille d'écran
	window.addEventListener('resize', updateScreenWidth);
	updateScreenWidth(); // Vérifie la taille de l'écran au chargement


	showLoader();
	await router.isReady(); // Wait for the router to be ready

    ws.value = new WebSocket('ws://localhost:8051');

    ws.value.onopen = () => {
        console.log('Connecté au WebSocket');
        ws.value.send(JSON.stringify({ action: 'userConnected' })); // Envoie l'action
    };

    ws.value.onmessage = (event) => {
        console.log('Message reçu du serveur:', event.data);
    };

    ws.value.onclose = () => {
        console.log('Déconnecté du WebSocket');
        ws.value.send(JSON.stringify({ action: 'userDisconnected' })); // Envoie l'action

    };

	setTimeout(() => {
		hideLoader();
	}, 500); // Adjust delay for smooth transition
});

onUnmounted(() => {
	// Supprime l'écouteur lors de la destruction du composant
	window.removeEventListener('resize', updateScreenWidth);

	showLoader(); // Show loader when the component is unmounted

    if (ws.value) {
        ws.value.send(JSON.stringify({action: 'userDisconnected'}));
        ws.value.close();
    }
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


const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
	screenWidth.value = window.innerWidth;
};

</script>

<template>
	<div>
		<Loader v-if="isLoading" />
		<Header></Header>
		<div class="gradient"></div>
		<RouterView v-if="screenWidth < 700"></RouterView>
		<PageErreur v-else/>
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