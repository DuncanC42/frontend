import { defineStore } from 'pinia';

export const volumeStore = defineStore('global', {
    state: () => ({
        musique: JSON.parse(localStorage.getItem('musique')) ?? Math.pow(50 / 100, 2),
        effet_sonore: JSON.parse(localStorage.getItem('effet_sonore')) ?? Math.pow(50 / 100, 2),
    }),
    actions: {
        setMusique(newVolume) {
            this.musique = Math.pow(newVolume / 100, 2);
            localStorage.setItem('musique', JSON.stringify(this.musique));
        },
        setEffetSonore(newVolume) {
            this.effet_sonore = Math.pow(newVolume / 100, 2);
            localStorage.setItem('effet_sonore', JSON.stringify(this.effet_sonore));
        },
    },
});
