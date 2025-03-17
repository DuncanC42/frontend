import { ref, watch } from 'vue';
import { volumeStore } from '@/stores/volume';
import audio_mp3 from '@/assets/sons/musiques/ambiance/chill.mp3';

export function useMusique() {
    const volumes = volumeStore();
    const musique = ref(new Audio(audio_mp3));

    musique.value.volume = volumes.musique;
    musique.value.loop = true;
    
    (async () => {
        let isPlaying = false;
        while (!isPlaying) {
            try {
                await musique.value.play();
                isPlaying = true;
            } catch {
                // Wait 1 second and retry
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    })();

    watch(() => volumes.musique, () => {
        musique.value.volume = volumes.musique;
    });
}
