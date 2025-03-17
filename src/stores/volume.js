import { defineStore } from 'pinia';

export const volumeStore = defineStore('global', {
    state: () => ({
        musique: Math.pow(50 / 100, 2),
        effet_sonore: Math.pow(50 / 100, 2),
    }),
    actions: {
        setMusique(newVolume) {
            this.musique = Math.pow(newVolume / 100, 2);
        },
        setEffetSonore(newVolume) {
            this.effet_sonore = Math.pow(newVolume / 100, 2);
        },
    },
});
