<script setup>

    import { ref, onMounted } from 'vue';
    import Phaser from "phaser";
    import GameScene from "@/components/jeu-frigo/Game-scene"
    import { volumeStore } from '@/stores/volume';
    import { useMusic } from '@/composable/volumes';

    import applauseSound from '@/assets/fruit-ninja/sons/Applaudissement de fin.mp3'
    import ambianceJeu from '@/assets/fruit-ninja/sons/Son-ambiance.mp3'
    import chill from '@/assets/sons/musiques/ambiance/chill.mp3'

    import PagePause from '../PagePause.vue';

    import Bravo from '@/components/Bravo.vue';
    import Dommage from '@/components/Dommage.vue';
    import MinuteurDent from '../temps/MinuteurDent.vue';

    import frigo from '@/assets/fruit-ninja/images/frigo_Plan_de_travail_1.png';

    const gameConfig = ref(null);
    const isGamePaused = ref(false);
    const minuteurRef = ref(null);
    const gameLost = ref(false);
    const gameWon = ref(false);
    const score = ref(0);
    const currentTime = ref('01\'00');
    const formattedTimeForPause = ref('01\'00');
    const timerReady = ref(false);

    const SCORE_TO_WIN = 10; // Score à atteindre pour gagner

    const preventScroll = (e) => {
        e.preventDefault();
    };

    const { switchAudio, pauseTimer, resumeTimer } = useMusic();
    switchAudio(ambianceJeu, true);

    const pauseGame = () => {
        if (gameConfig.value) {
            isGamePaused.value = true;
            gameConfig.value.scene.pause('GameScene');
        }

        if (minuteurRef.value) {
            minuteurRef.value.pauseTimer();
        }
    };
    
    const unpauseGame = () => {
        if (gameConfig.value) {
            isGamePaused.value = false;
            gameConfig.value.scene.resume('GameScene');
        }

        if (minuteurRef.value) {
            minuteurRef.value.resumeTimer();
        }
    };
    
    const updateTime = (time) => {
        
        // S'assurer que c'est une chaîne valide
        if (typeof time === 'string') {
            // Stocker la valeur d'origine
            currentTime.value = time;
            
            // Formater pour la page de pause (convertir MM:SS en MM'SS si nécessaire)
            if (time.includes(':')) {
                const [minutes, seconds] = time.split(':');
                formattedTimeForPause.value = `${minutes}'${seconds}`;
            } else if (time.includes("'")) {
                formattedTimeForPause.value = time;
            } else {
                formattedTimeForPause.value = time;
            }

            if (gameConfig.value && gameConfig.value.scene.scenes[0]) {
                gameConfig.value.scene.scenes[0].events.emit('timeUpdate', time);
            }
            
            // Vérifier si le temps est écoulé
            if (time === "00:00" || time === "00'00") {
                onTimerEnd();
            }
        } else if (typeof time === 'number') {
            // Si on reçoit un nombre, le formater
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            
            // Stocker à la fois la version d'origine et la version formatée
            currentTime.value = time;
            formattedTimeForPause.value = `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
            
            if (gameConfig.value && gameConfig.value.scene.scenes[0]) {
                gameConfig.value.scene.scenes[0].events.emit('timeUpdate', time);
            }

            if (time === 0) {
                onTimerEnd();
            }
        } else {
            formattedTimeForPause.value = currentTime.value;
        }
    };

    const updateScore = (newScore) => {
        score.value = newScore;
    };

    const onTimerEnd = () => {
        if(gameConfig.value) {
            gameConfig.value.scene.pause('GameScene');
        }

        if (score.value > SCORE_TO_WIN) {
            gameWon.value = true;
            gameLost.value = false;
            switchAudio(applauseSound, true);
        } else {
            gameLost.value = true;
            gameWon.value = false;
        }
    }
    
    const handleLeave = () => {
        switchAudio(chill);
    };
    
    const handleRetry = () => {
        if(gameConfig.value){
            gameConfig.value.destroy(true);
            initializeGame();
        }

        score.value = 0;
        gameWon.value = false;
        gameLost.value = false;

        if (minuteurRef.value) {
            minuteurRef.value.resetTimer();
            minuteurRef.value.resumeTimer();
        }
    };

    const props = defineProps({
        difficulty: {
            type: String,
            default: 'normal', // 'normal' ou 'hard'
            validator: (value) => ['normal', 'hard'].includes(value)
        },
        isActive: {
            type: Boolean,
            default: false
        }
    });
    console.log('difficulty', props.difficulty);

    defineExpose();

    const components = {
        PagePause,
        Bravo,
        Dommage
    };

    const initializeGame = () => {
        // Attendre que le DOM soit prêt pour initialiser Phaser
        setTimeout(() => {
            // Calculer les dimensions en fonction de la fenêtre
            const gameWidth = window.innerWidth;
            const gameHeight = window.innerHeight - 80; // Soustraire la hauteur du header
            
            const gameScene = new GameScene({ 
                difficulty: props.difficulty // Passer la prop difficulty ici
            });
            // Configurer et créer le jeu Phaser
            gameConfig.value = new Phaser.Game({
                type: Phaser.AUTO,
                width: gameWidth,
                height: gameHeight,
                parent: "game-container",
                physics: {
                    default: "arcade",
                    arcade: { 
                        gravity: { y: 0 }, 
                        debug: false 
                    },
                },
                scene: [gameScene],
                transparent: true, // Fond transparent pour voir l'image du frigo
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                }
            });

            setTimeout(() => {
                if (gameConfig.value && gameConfig.value.scene.scenes.length > 0) {
                    const scene = gameConfig.value.scene.getScene('GameScene');
                    if (scene) {
                        scene.events.on('scoreUpdate', updateScore);
                    }
                }
                timerReady.value = true;
            }, 200);
        }, 100);
        
        // Ajouter des écouteurs pour le redimensionnement
        window.addEventListener('resize', handleResize);
    }

    onMounted(() => {
        initializeGame();
    });

    const handleResize = () => {
        if (gameConfig.value) {
            gameConfig.value.scale.resize(window.innerWidth, window.innerHeight - 84);
        }
    };

</script>

<template>
    <div class="game-container" @touchmove.prevent="preventScroll">
        <div class="frigo-container">
            <img :src="frigo" alt="Frigo" class="frigo" />
        </div>

        <div id="game-container"></div>

        <div class="minuteur-container">
            <MinuteurDent
                v-if="!gameLost"
                ref="minuteurRef"
                couleur="white" 
                :duree="60"
                :isPaused="isGamePaused || !timerReady"
                @timeUpdate="updateTime"
                @timerEnd="onTimerEnd"
            />
    
            <div v-if="gameLost" class="minuteur-fixed red">
            00'00
            <font-awesome-icon :icon="['fas', 'stopwatch']" class="red" />
            </div>
        </div>

        <PagePause 
            :time="currentTime" 
            @pause="pauseGame" 
            @unpause="unpauseGame" 
            @leave="handleLeave"
            @retry="handleRetry">
        </PagePause>

        <Bravo 
            v-if="gameWon" 
            :score="score" 
            :jeu_id="4"
            message="L’Assurance Maladie offre aux jeunes de 16 à 25 ans un examen de prévention santé. Il peut être réalisé dans un centre d’examens de santé."
            @retry="handleRetry" 
            @quit="handleLeave" />

        <Dommage 
            v-if="gameLost" 
            message="L’Assurance Maladie offre aux jeunes de 16 à 25 ans un examen de prévention santé. Il peut être réalisé dans un centre d’examens de santé."
            @retry="handleRetry" 
            @quit="handleLeave" />
    </div>
</template>

<style scoped>

    .game-container {
        position: absolute;
        top: 84px;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
    }

    #game-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    .frigo-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .frigo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .minuteur-container {
        position: absolute;
        top: 10px;
        right: 15px;
        z-index: 20;
    }


    .minuteur-fixed {
        font-size: 1.5rem;
        color: white;
    }

    #button {
        position: absolute;
        top: 90px;
        right: 15px;
        z-index: 100;
    }

    .red {
        color: red;
    }
</style>