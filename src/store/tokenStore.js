import { defineStore } from 'pinia';

export const useTokenStore = defineStore('token', {
    state: () => ({
        token: localStorage.getItem('auth_token') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getToken: (state) => state.token,
    },

    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('auth_token', token);
        },

        replaceToken(newToken) {
            this.token = newToken;
            localStorage.setItem('auth_token', newToken);
        },

        removeToken() {
            this.token = null;
            localStorage.removeItem('auth_token');
        },

        // Initialize token from localStorage (useful on app startup)
        initializeToken() {
            const token = localStorage.getItem('auth_token');
            if (token) {
                this.token = token;
                return true;
            }
            return false;
        }
    }
});
