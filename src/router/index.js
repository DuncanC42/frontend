import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/PanneauJeux.vue'
import PageErreur from '@/views/PageErreur.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/home',
			name: 'home',
			component: Home,
		},
		{
			path: '/',
			name: 'Accueil',
			component: PageErreur
		}, {
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: NotFound
		}
	],
})

export default router
