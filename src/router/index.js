import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/PanneauJeux.vue'
import Recompenses from '@/views/Recompenses.vue'
import Stats from '@/views/PageStats.vue'
import PageConnexion from '@/views/PageConnexion.vue'
import PageInscription from '@/views/PageInscription.vue'
import PageErreur from '@/views/PageErreur.vue'
import NotFound from '@/views/NotFound.vue'
import Leaderboard from '@/views/Leaderboard.vue'
import PageBienvenue from '@/views/PageBienvenue.vue'
import PageCompteRebours from '@/views/PageCompteRebours.vue'
import Dino from '@/views/Jeux/Dino.vue'
import Frigo from '@/views/Jeux/Frigo.vue'
import Dents from '@/views/Jeux/Dents.vue'
import Taquin from '@/views/Jeux/Taquin.vue'
import Tirelire from '@/views/Jeux/Tirelire.vue'
import { fetchBackend } from '@/composable/fetchBackend'

// Default to a future date to ensure redirection until we get the real date
let date_ouverture = null;

// Function to check if the current date is before the opening date
function isBeforeOpeningDate() {
	if (!date_ouverture) return true; // If date not loaded yet, redirect to be safe
	const currentDate = new Date();
	
	// Parse the opening date
	const openingDate = new Date(date_ouverture);

	// Add one hour to the opening date
	openingDate.setHours(openingDate.getHours() - 2);
	return currentDate <= openingDate;
}

const getDateOuverture = async () => {
	const response = await fetchBackend('api/parametres', 'GET')
	date_ouverture = response.data.dateDebut;
}


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'root',
			component: PageBienvenue,
		},
		{
			path: '/home',
			name: 'home',
			component: Home,
			props: (route) => ({ loader: route?.query?.loader === 'true' }),
		},
		{
			path: '/bienvenue',
			name: 'bienvenue',
			component: PageBienvenue,
		},
		{
			path: '/connexion',
			name: 'connexion',
			component: PageConnexion
		},
		{
			path: '/inscription',
			name: 'inscription',
			component: PageInscription
		},
		{
			path: '/erreur',
			name: 'erreur',
			component: PageErreur,
		},
		{
			path: '/dino',
			name: 'dino',
			component: Dino
		},
		{
			path: '/taquin',
			name: 'taquin',
			component: Taquin
		},
		{
			path: '/tirelire',
			name: 'tirelire',
			component: Tirelire
		},
		{
			path: '/frigo',
			name: 'frigo',
			component: Frigo
		},
		{
			path: '/dents',
			name: 'dents',
			component: Dents
		},
		{
			path: '/recompenses',
			name: "recompenses",
			component: Recompenses,
		},
		{
			path: '/stats',
			name: "stats",
			component: Stats,
		},
		{
			path: '/classement',
			name: 'leaderboard',
			component: Leaderboard,
			props: { title: 'Général', route: '/general', page: 1 }
		},
		{
			path: '/compte-rebours',
			name: 'compteRebours',
			component: PageCompteRebours,
			props: () => ({ date_ouverture: date_ouverture }), // Use a function to ensure current value
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'notFound',
			component: NotFound
		}
	],
})

// Navigation guard to handle redirection based on date condition
router.beforeEach(async (to, from, next) => {
	// List of exempted routes that won't redirect to countdown
	const exemptedRoutes = ['/', '/erreur', '/connexion', '/inscription', '/compte-rebours'];
	while (date_ouverture == null) {
		await getDateOuverture()
	}

	if (isBeforeOpeningDate() && !exemptedRoutes.includes(to.path)) {
		// Redirect to countdown page if current date is before opening date
		next({ path: '/compte-rebours' });
	} else {
		// Normal navigation
		next();
	}
});

export default router
