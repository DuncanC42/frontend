<template>
    <div ref="gameContainer" class="game-container">
        <Chrono :time="timeElapsed"></Chrono>
        <PagePause :time="timeElapsed" @pause="pauseGame" @unpause="unpauseGame" @leave="handleLeave"
            @retry="handleRetry">
        </PagePause>
        <Bravo 
            v-if="gameWon" 
            :score="finalScore" 
            message="La complémentaire santé solidaire (C2S) est une aide pour payer ses dépenses de santé, si tes ressources sont faibles. Avec la C2S tu ne paies pas le médecin, ni tes médicaments en pharmacie. La plupart des lunettes et des soins dentaires sont pris en charge. Tu peux faire une simulation sur ameli.fr pour savoir si tu y as droit !"
            @quit="handleLeave" 
        />
        <Dommage 
            v-if="gameLost" 
            message="La complémentaire santé solidaire (C2S) est une aide pour payer ses dépenses de santé, si tes ressources sont faibles. Avec la C2S tu ne paies pas le médecin, ni tes médicaments en pharmacie. La plupart des lunettes et des soins dentaires sont pris en charge. Tu peux faire une simulation sur ameli.fr pour savoir si tu y as droit !"
            @retry="handleRetry" 
            @quit="handleLeave" 
        />
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Phaser from 'phaser';
import { useMusic } from '@/composable/volumes';
import { preloadAssets, assets } from '@/composable/tirelire/assetsLoader';
import { volumeStore } from '@/stores/volume';
import ambiance from '@/assets/tirelire/sons/ambiance.mp3';
import Chrono from '@/components/temps/ChronoTirelire.vue';
import PagePause from '../PagePause.vue';
import Bravo from '@/components/Bravo.vue';
import Dommage from '@/components/Dommage.vue';
import applause from '@/assets/jeu-dino/applause.mp3'

const props = defineProps({
    difficulty: {
        type: String,
        default: 'normal',
        validator: (value) => ['normal', 'hard'].includes(value)
    }
});

console.log(props.difficulty)

let applauseSoundEffect;

const gameContainer = ref(null);
const timeElapsed = ref(0);
const gameWon = ref(false);
const gameLost = ref(false);
const score = ref(0);
const finalScore = ref(0);
const requiredPictograms = props.difficulty === 'hard' ? 40 : 20;
const maxTime = props.difficulty === 'hard' ? 180 : 300;

const { switchAudio, pause } = useMusic();
switchAudio(ambiance);

let game;

function pauseGame() {
    if (game) game.pause();
}

function unpauseGame() {
    if (game) game.resume();
}

const handleLeave = () => {
}

const handleRetry = () => {
    resetGameState();
    if (game) {
        game.destroy(true);
        initializeGame();
    }
}

const resetGameState = () => {
    timeElapsed.value = 0;
    score.value = 0;
    finalScore.value = 0;
    gameWon.value = false;
    gameLost.value = false;
}

const initializeGame = () => {
    const referenceWidth = 4510;
    const referenceHeight = 8014;
    const aspectRatio = referenceWidth / referenceHeight;

    const calculateCanvasSize = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = screenWidth / aspectRatio;
        return { width: screenWidth, height: screenHeight };
    };

    const { width: initialWidth, height: initialHeight } = calculateCanvasSize();

    const getScalingFactors = (currentWidth, currentHeight) => {
        return {
            widthScale: currentWidth / referenceWidth * 2.2,
            heightScale: currentHeight / referenceHeight * 2.2,
            bgHeight: currentHeight / referenceHeight
        };
    };

    const config = {
        type: Phaser.CANVAS,
        width: initialWidth,
        height: initialHeight,
        parent: gameContainer.value,
        scale: {
            mode: Phaser.Scale.NONE,
            resizeInterval: 0,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: initialHeight * (props.difficulty === 'hard' ? 1.0 : 0.5) },
                debug: false,
            },
        },
        scene: {
            preload,
            create,
            update,
        },
    };

    game = new Phaser.Game(config);
    let scalingFactors = getScalingFactors(initialWidth, initialHeight);

    const handleResize = () => {
        const { width, height } = calculateCanvasSize();
        game.scale.resize(width, height);
        scalingFactors = getScalingFactors(width, height);
    };

    window.addEventListener('resize', handleResize);

    let tirelire;
    let isDragging = false;
    let gameOver = false;
    let gauge;
    let goodSoundEffect;
    let wrongSoundEffect;
    let clapSoundEffect;
    let isGameStarted = false;
    let fallingObjects = [];
    let spawnInterval = props.difficulty === 'hard' ? 800 : 1000;
    let difficultyTimer;
    let timeLimitReached = false;
    let goodPictogramsCollected = 0;
    let badPictogramsCollected = 0;

    function preload() {
        preloadAssets(this);
        this.load.audio('applause', applause);
    }

    function create() {
        goodPictogramsCollected = 0;
        setUpBackground.call(this);

        const startTextBg = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000)
            .setOrigin(0).setAlpha(0.4);
        const startText = this.add.text(game.config.width / 2, game.config.height / 2, 'Appuyer pour démarrer !', {
            fontSize: `${150 * scalingFactors.widthScale}px`,
            fontFamily: '\'Source Sans Pro\', sans-serif',
            fontWeight: 'bolder',
            fill: '#fff',
        }).setOrigin(0.5);
        
        this.input.once('pointerdown', () => {
            startText.destroy();
            startTextBg.destroy();
            isGameStarted = true;
            setUpTirelire.call(this);
            setUpGauge.call(this);
            setUpTimer.call(this);
            startDifficultyIncrease.call(this);
            spawnFallingObjects.call(this);

            goodSoundEffect = this.sound.add('goodSound');
            wrongSoundEffect = this.sound.add('wrongSound');
            clapSoundEffect = this.sound.add('clap');
            applauseSoundEffect = this.sound.add('applause');

            const volumes = volumeStore();
            goodSoundEffect.volume = volumes.effet_sonore;
            wrongSoundEffect.volume = volumes.effet_sonore;
            clapSoundEffect.volume = volumes.effet_sonore;
            applauseSoundEffect.volume = volumes.effet_sonore;

            watch(
                () => volumes.effet_sonore,
                (newVolume) => {
                    goodSoundEffect.volume = newVolume;
                    wrongSoundEffect.volume = newVolume;
                    clapSoundEffect.volume = newVolume;
                    applauseSoundEffect.volume = newVolume;
                }
            );
        });
    }

    function update() {
        if (isGameStarted && !gameOver) {
            if (timeElapsed.value >= maxTime && !timeLimitReached) {
                timeLimitReached = true;
                endGame(false);
            }
        }
    }

    function setUpBackground() {
        const bg = this.add.image(game.config.width / 2, game.config.height / 2, 'background');
        bg.setScale(scalingFactors.widthScale, scalingFactors.bgHeight);
    }

    function setUpTirelire() {
        const tirelireYPosition = game.config.height - 700 * scalingFactors.heightScale;
        tirelire = this.physics.add.sprite(game.config.width / 2, tirelireYPosition, 'tirelire');
        tirelire.setScale(0.07 * scalingFactors.widthScale);
        const tirelireBody = tirelire.body;
        tirelireBody.setSize(tirelire.displayWidth, tirelire.displayHeight * 0.7);
        tirelire.body.setCollideWorldBounds(true);
        tirelire.body.setMaxVelocityY(0);
        makeTirelireDraggable.call(this, tirelire);
    }

    function setUpGauge() {
        gauge = this.add.image(150 * scalingFactors.widthScale, 550 * scalingFactors.heightScale, 'jauge0');
        gauge.setScale(0.15 * scalingFactors.widthScale);
    }

    function updateGauge() {
        const gaugeLevel = Math.min(4, Math.floor(goodPictogramsCollected / (requiredPictograms / 5)));
        if (gauge && gauge.texture.key !== `jauge${gaugeLevel}`) {
            gauge.setTexture(`jauge${gaugeLevel}`);
            gauge.setScale(0.15 * scalingFactors.widthScale);
        }
    }

    function setUpTimer() {
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!gameOver && isGameStarted) {
                    timeElapsed.value += 1;
                }
            },
        });
    }

    function startDifficultyIncrease() {
        difficultyTimer = this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => {
                spawnInterval = Math.max(300, spawnInterval - (props.difficulty === 'hard' ? 150 : 100));
            }
        });
    }

    function makeTirelireDraggable(tirelire) {
        tirelire.setInteractive();
        let tirelire_size = tirelire.displayWidth;
        
        this.input.on('pointerdown', () => {
            isDragging = true;
        });

        this.input.on('pointermove', (pointer) => {
            if (isDragging) {
                let newX = pointer.x;
                newX = Phaser.Math.Clamp(newX, tirelire_size / 2, game.config.width - tirelire_size / 2);
                tirelire.x = newX;
            }
        });

        this.input.on('pointerup', () => {
            isDragging = false;
        });

        this.input.on('pointerout', (pointer) => {
            if (pointer.x < 0 || pointer.x > game.config.width || pointer.y < 0 || pointer.y > game.config.height) {
                isDragging = false;
            }
        });
    }

    function spawnFallingObjects() {
        this.time.addEvent({
            delay: spawnInterval,
            loop: true,
            callback: () => {
                if (gameOver) return;
                
                const badProbability = Math.min(0.7, 0.3 + (timeElapsed.value / maxTime) * 0.4);
                const isGood = Phaser.Math.FloatBetween(0, 1) > badProbability;
                
                let pictogramKey;
                if (isGood) {
                    const randomIndex = Phaser.Math.Between(0, assets.goodPictograms.length - 1);
                    pictogramKey = assets.goodPictograms[randomIndex].key;
                } else {
                    pictogramKey = `bad${Phaser.Math.Between(0, assets.badPictograms.length - 1)}`;
                }

                const fallingObject = this.physics.add.sprite(0, 0, pictogramKey);
                fallingObject.setScale(0.7 * scalingFactors.widthScale);
                const pictogramWidth = fallingObject.displayWidth;
                
                const margin = pictogramWidth * 1.5;
                const randomX = Phaser.Math.Between(
                    margin, 
                    game.config.width - margin
                );
                
                fallingObject.setPosition(randomX, 0);
                
                const baseSpeed = (props.difficulty === 'hard' ? 150 : 50) + (timeElapsed.value / maxTime) * 150;
                fallingObject.setVelocityY(Phaser.Math.Between(baseSpeed, baseSpeed + 50));
                fallingObject.isGood = isGood;

                this.physics.add.overlap(tirelire, fallingObject, collectObject, null, this);
                fallingObjects.push(fallingObject);
            },
        });
    }

    function collectObject(tirelire, fallingObject) {
        fallingObject.disableBody(true, true);
        
        if (fallingObject.isGood) {
            goodPictogramsCollected++;
            score.value = goodPictogramsCollected;
            
            updateGauge.call(this);
            goodSoundEffect.play();

            if (goodPictogramsCollected >= requiredPictograms) {
                calculateFinalScore();
                endGame(true);
            }
        } else {
            badPictogramsCollected++;
            const penalty = props.difficulty === 'hard' ? 15 + Math.floor(timeElapsed.value / maxTime * 10) : 10 + Math.floor(timeElapsed.value / maxTime * 5);
            timeElapsed.value += penalty;
            wrongSoundEffect.play();
        }
    }

    function calculateFinalScore() {
        // Score de base
        let baseScore = 1000;
        
        // Pénalité pour le temps écoulé (plus sévère en mode difficile)
        const timePenalty = props.difficulty === 'hard' 
            ? Math.min(600, timeElapsed.value * 3) 
            : Math.min(400, timeElapsed.value * 2);
        
        // Bonus pour la difficulté
        const difficultyBonus = props.difficulty === 'hard' ? 500 : 0;
        
        // Calcul final
        finalScore.value = Math.max(0, baseScore - timePenalty + difficultyBonus);
    }

    function endGame(isVictory) {
        gameOver = true;
        
        if (difficultyTimer) difficultyTimer.destroy();
        
        fallingObjects.forEach(obj => obj.destroy());
        fallingObjects = [];
        
        if (isVictory) {
            clapSoundEffect.play();
            applauseSoundEffect.play();
            gameWon.value = true;
        } else {
            calculateFinalScore();
            gameLost.value = true;
        }
    }
}

onMounted(initializeGame);
</script>

<style scoped>
.game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    background-color: lightgray;
    overflow: hidden;
}
</style>