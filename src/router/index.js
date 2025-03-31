import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/PanneauJeux.vue'
import Recompenses from '@/views/Recompenses.vue'
import Bienvenue from '@/views/Bienvenue.vue'
import PageConnexion from '@/views/PageConnexion.vue'
import PageInscription from '@/views/PageInscription.vue'
import PageErreur from '@/views/PageErreur.vue'
import NotFound from '@/views/NotFound.vue'
import Leaderboard from '@/views/Leaderboard.vue'

import Dino from '@/views/Jeux/Dino.vue'
import Frigo from '@/views/Jeux/Frigo.vue'
import Dents from '@/views/Jeux/Dents.vue'
import Taquin from '@/views/Jeux/Taquin.vue'
import Tirelire from '@/views/Jeux/Tirelire.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/home',
			name: 'home',
			component: Home,
			props: (route) => ({ loader: route?.query?.loader === 'true' }),
		},
		{
			path: '/erreur',
			name: 'accueil',
			component: Bienvenue,
		},

		{
			path: '/bienvenue',
			name: 'bienvenue',
			component: Bienvenue,
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
			path: '/classement',
			name: 'leaderboard',
			component: Leaderboard,
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'notFound',
			component: NotFound
		}
	],
})

export default router
