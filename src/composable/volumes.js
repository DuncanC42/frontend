import { ref, watch } from 'vue';
import { volumeStore } from '@/stores/volume';

let musiqueInstance = null;

export function useMusic(initialAudioMp3) {
    const volumes = volumeStore();

    if (!musiqueInstance) {
        const musique = ref(new Audio(initialAudioMp3));
        musique.value.volume = volumes.musique;
        musique.value.loop = true;

        (async () => {
            let isPlaying = false;
            while (!isPlaying) {
                try {
                    await musique.value.play();
                    isPlaying = true;
                } catch {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
        })();

        watch(
            () => volumes.musique,
            (newVolume) => {
                musique.value.volume = newVolume;
            }
        );
        musiqueInstance = musique.value;
    }

    function switchAudio(newAudioMp3) {
        if (musiqueInstance) {
            musiqueInstance.pause();
            musiqueInstance.currentTime = 0;
            musiqueInstance.src = newAudioMp3;

            (async () => {
                let isPlaying = false;
                while (!isPlaying) {
                    try {
                        await musiqueInstance.play();
                        isPlaying = true;
                    } catch {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
            })();
        }
    }

    function pause() {
        if (musiqueInstance) {
            musiqueInstance.pause();
        }
    }

    function resume() {
        if (musiqueInstance) {
            (async () => {
                let isPlaying = false;
                while (!isPlaying) {
                    try {
                        await musiqueInstance.play();
                        isPlaying = true;
                    } catch {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
            })();
        }
    }

    return {
        switchAudio,
        pause,
        resume,
    };
}