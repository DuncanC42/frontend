<script setup>

    import { ref, onMounted } from 'vue';
    import Phaser from "phaser";
    import GameScene from "@/components/jeu-frigo/Game-scene"
    import { volumeStore } from '@/stores/volume';
    import { useMusic } from '@/composable/volumes';
    import { watch } from 'vue';

    import applauseSound from '@/assets/fruit-ninja/sons/Applaudissement de fin.mp3'
    import ambianceJeu from '@/assets/fruit-ninja/sons/Son-ambiance.mp3'
    import cutSound from '@/assets/fruit-ninja/sons/Epée.mp3'
    import slapshSound from '@/assets/fruit-ninja/sons/Splash.mp3'

    import PagePause from '../PagePause.vue';

    import Bravo from '@/components/Bravo.vue';
    import Dommage from '@/components/Dommage.vue';
    import MinuteurDent from '../temps/MinuteurDent.vue';

    import frigo from '@/assets/fruit-ninja/images/frigo_Plan_de_travail_1.png';

    import coupeDiagonaleDroite from '@/assets/fruit-ninja/images/coupe_daigonale_droite.png';
    import coupeDiagonaleGauche from '@/assets/fruit-ninja/images/coupe_diagonale_gauche.png';
    import coupeHorizontale from '@/assets/fruit-ninja/images/coupe_horizontale.png';
    import coupeVerticale from '@/assets/fruit-ninja/images/coupe_verticale.png';

    import frite1 from '@/assets/fruit-ninja/images/frite_1.png';
    import frite2 from '@/assets/fruit-ninja/images/frite_2.png';
    import frite3 from '@/assets/fruit-ninja/images/frite_3.png';
    import frite4 from '@/assets/fruit-ninja/images/frite_4.png';
    import frite5 from '@/assets/fruit-ninja/images/frite_5.png';
    import frite6 from '@/assets/fruit-ninja/images/frite_6.png';

    import frites from '@/assets/fruit-ninja/images/frites.png';
    import paquetFrites from '@/assets/fruit-ninja/images/paquet_de_frites.png';

    import hamburger from '@/assets/fruit-ninja/images/hamburger.png';
    import hambugerFromage from '@/assets/fruit-ninja/images/hamburger_fromage.png';
    import hamburgerSalade from '@/assets/fruit-ninja/images/hamburger_salade.png';
    import hamburgerTomate from '@/assets/fruit-ninja/images/hamburger_tomate_1.png';
    import hambugerOignonDroite from '@/assets/fruit-ninja/images/hamburger_oignon_droite.png';
    import hambugerOignonGauche from '@/assets/fruit-ninja/images/hamburger_oignon_gauche.png';
    import hamburgerPartieHaut from '@/assets/fruit-ninja/images/hamburger_pain_dessus.png';
    import hamburgerPartieBas from '@/assets/fruit-ninja/images/hamburger_pain_bas.png';
    import hamburgerSteak from '@/assets/fruit-ninja/images/hamburger_steak_hache.png';

    import kebab from '@/assets/fruit-ninja/images/KEBAB.png';
    import kebabPartieHaut from '@/assets/fruit-ninja/images/kebab_partie_haut.png';
    import kebabPartieBas from '@/assets/fruit-ninja/images/kebab_partie_bas.png';

    import pizza from '@/assets/fruit-ninja/images/PIZZA.png';
    import pizza1 from '@/assets/fruit-ninja/images/pizza_part_1.png';
    import pizza2 from '@/assets/fruit-ninja/images/pizza_part_2.png';
    import pizza3 from '@/assets/fruit-ninja/images/pizza_part_3.png';
    import pizza4 from '@/assets/fruit-ninja/images/pizza_part_4.png';
    import pizza5 from '@/assets/fruit-ninja/images/pizza_part_5.png';
    import pizza6 from '@/assets/fruit-ninja/images/pizza_part_6.png';
    import pizza7 from '@/assets/fruit-ninja/images/pizza_part_7.png';
    import pizza8 from '@/assets/fruit-ninja/images/pizza_part_8.png';
    import pizza9 from '@/assets/fruit-ninja/images/pizza_part_9.png';

    import soda1 from '@/assets/fruit-ninja/images/soda_1.png';
    import soda2 from '@/assets/fruit-ninja/images/soda_2.png';
    import soda_casse_1 from '@/assets/fruit-ninja/images/soda_casse_1.png';
    import soda_casse_2 from '@/assets/fruit-ninja/images/soda_casse_2.png';

    import eau from '@/assets/fruit-ninja/images/eau.png';

    import pomme1 from '@/assets/fruit-ninja/images/pomme_1.png';
    import pomme2 from '@/assets/fruit-ninja/images/pomme_2.png';
    import pomme1Droite from '@/assets/fruit-ninja/images/pomme_1_droite.png';
    import pomme2Droite from '@/assets/fruit-ninja/images/pomme_2_droite.png';
    import pomme1Gauche from '@/assets/fruit-ninja/images/pomme_1_gauche.png';
    import pomme2Gauche from '@/assets/fruit-ninja/images/pomme_2_gauche.png';

    import banane from '@/assets/fruit-ninja/images/BANANE.png';
    import bananePartieBas from '@/assets/fruit-ninja/images/BANANE_.png';
    import bananePartieHaut from '@/assets/fruit-ninja/images/BANANE_PARTIE_HAUT.png';

    import brocoli from '@/assets/fruit-ninja/images/brocoli.png';
    import brocoliPartieHaut from '@/assets/fruit-ninja/images/brocoli_coupe_haut.png';
    import brocoliPartieBas from '@/assets/fruit-ninja/images/brocoli_coupe_bas.png';

    import carotte from '@/assets/fruit-ninja/images/carotte.png';
    import carottePartieHaut from '@/assets/fruit-ninja/images/Carotte_coupee_haut.png';
    import carottePartieBas from '@/assets/fruit-ninja/images/Carotte_coupee_bas.png';

    const gameConfig = ref(null);
    const isGamePaused = ref(false);
    const gameLost = ref(false);
    const gameWon = ref(false);
    const score = ref(0);
    const currentTime = ref('01:00');
    const timerReady = ref(false);

    const preventScroll = (e) => {
        e.preventDefault();
    };

    const pauseGame = () => {
        if (gameConfig.value) {
            isGamePaused.value = true;
            gameConfig.value.scene.pause('GameScene');
        }
    };
    
    const unpauseGame = () => {
        if (gameConfig.value) {
            isGamePaused.value = false;
            gameConfig.value.scene.resume('GameScene');
        }
    };
    
    const updateTime = (time) => {
        currentTime.value = time;
    };
    
    const handleLeave = () => {
        // Logique pour quitter le jeu
    };
    
    const handleRetry = () => {
        // Logique pour recommencer le jeu
    };

    defineProps({
        isActive: {
            type: Boolean,
            default: false
        }
    });

    defineExpose();

    const components = {
        PagePause,
        Bravo,
        Dommage
    };

    // Gestion de pauses
    // Gestion de la musique
    // Gestion du restart
    // Initialisation du jeu
    // Démarrage du jeu

    onMounted(() => {
        // Attendre que le DOM soit prêt pour initialiser Phaser
        setTimeout(() => {
            // Calculer les dimensions en fonction de la fenêtre
            const gameWidth = window.innerWidth;
            const gameHeight = window.innerHeight - 84; // Soustraire la hauteur du header
            
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
                scene: [GameScene],
                transparent: true, // Fond transparent pour voir l'image du frigo
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                }
            });
            
            timerReady.value = true;
        }, 100);
        
        // Ajouter des écouteurs pour le redimensionnement
        window.addEventListener('resize', handleResize);
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
                ref="minuteur"
                couleur="white" 
                :duree="60"
                :isPaused="isGamePaused || !timerReady"
                @timeUpdate="updateTime"
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
        background-color: black;
    }

    #game-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    frigo-container {
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