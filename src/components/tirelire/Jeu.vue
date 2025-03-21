<template>
    <div ref="gameContainer" class="game-container">
        <Chrono :time="timeElapsed"></Chrono>
        <PagePause :time="timeElapsed" @pause="pauseGame" @unpause="unpauseGame" @leave="handleLeave"
            @retry="handleRetry">
        </PagePause>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Phaser from 'phaser';
import { useMusic } from '@/composable/volumes';
import { preloadAssets, assets } from '@/composable/tirelire/assetsLoader'; // Import the centralized asset loader
import { volumeStore } from '@/stores/volume';
import ambiance from '@/assets/tirelire/sons/ambiance.mp3';
import chill from '@/assets/sons/musiques/ambiance/chill.mp3';
import Chrono from '@/components/temps/ChronoTirelire.vue';
import PagePause from '../PagePause.vue';

const gameContainer = ref(null);
const timeElapsed = ref(0);

const { switchAudio, pause, resume } = useMusic();
switchAudio(ambiance);

// Declare game as a global variable so it can be accessed by pauseGame and unpauseGame
let game;

// Define pauseGame and unpauseGame functions
function pauseGame() {
    if (game) {
        game.pause();
    }
}

function unpauseGame() {
    if (game) {
        game.resume();
    }
}

const handleLeave = () => {
    switchAudio(chill);
}

const handleRetry = () => {
    if (game) {
        timeElapsed.value = 0
        game.destroy(true)
        initializeGame()
    }
}

const initializeGame = () => {
    // Reference resolution (base resolution)
    const referenceWidth = 4510;
    const referenceHeight = 8014;

    // Aspect ratio of the game (width / height)
    const aspectRatio = referenceWidth / referenceHeight;

    // Function to calculate canvas dimensions
    const calculateCanvasSize = () => {
        const screenWidth = window.innerWidth; // Always use 100vw for width
        const screenHeight = screenWidth / aspectRatio; // Calculate height based on aspect ratio
        return { width: screenWidth, height: screenHeight };
    };

    // Initial canvas size
    const { width: initialWidth, height: initialHeight } = calculateCanvasSize();

    // Calculate scaling factors
    const getScalingFactors = (currentWidth, currentHeight) => {
        const widthScale = currentWidth / referenceWidth * 2.2;
        const heightScale = currentHeight / referenceHeight * 2.2;
        const bgHeight = currentHeight / referenceHeight;
        return { widthScale, heightScale, bgHeight };
    };

    const config = {
        type: Phaser.CANVAS,
        width: initialWidth,
        height: initialHeight,
        parent: gameContainer.value,
        scale: {
            mode: Phaser.Scale.NONE, // Disable automatic scaling
            resizeInterval: 0, // Prevent frequent resizing
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: initialHeight },
                debug: false,
            },
        },
        scene: {
            preload,
            create,
        },
    };

    // Initialize the game and assign it to the global variable
    game = new Phaser.Game(config);
    let scalingFactors = getScalingFactors(initialWidth, initialHeight);

    // Handle window resize events
    const handleResize = () => {
        const { width, height } = calculateCanvasSize();
        game.scale.resize(width, height); // Resize the game canvas
        scalingFactors = getScalingFactors(width, height); // Update scaling factors
    };

    window.addEventListener('resize', handleResize);

    let tirelire;
    let isDragging = false;
    let score = 0;
    let collectedPictograms = {};
    let gameOver = false;
    let gauge;
    let goodSoundEffect;
    let wrongSoundEffect;
    let clapSoundEffect;
    let isGameStarted = false;

    function preload() {
        preloadAssets(this); // Use the centralized asset loader
    }

    function create() {
        setUpBackground.call(this);

        const startTextBg = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0).setAlpha(0.4); // Full-screen background
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
            spawnFallingObjects.call(this);

            goodSoundEffect = this.sound.add('goodSound');
            wrongSoundEffect = this.sound.add('wrongSound');
            clapSoundEffect = this.sound.add('clap');

            const volumes = volumeStore();
            goodSoundEffect.volume = volumes.effet_sonore;
            wrongSoundEffect.volume = volumes.effet_sonore;
            clapSoundEffect.volume = volumes.effet_sonore;

            watch(
                () => volumes.effet_sonore,
                (newVolume) => {
                    goodSoundEffect.volume = newVolume;
                    wrongSoundEffect.volume = newVolume;
                    clapSoundEffect.volume = newVolume;
                }
            );
        });
    }

    function setUpBackground() {
        const bg = this.add.image(game.config.width / 2, game.config.height / 2, 'background');
        bg.setScale(scalingFactors.widthScale, scalingFactors.bgHeight);
    }

    function setUpTirelire() {
        const tirelireYPosition = game.config.height - 700 * scalingFactors.heightScale;
        tirelire = this.physics.add.sprite(game.config.width / 2, tirelireYPosition, 'tirelire');
        tirelire.setScale(0.07 * scalingFactors.widthScale); // Scale the sprite
        const tirelireBody = tirelire.body;
        tirelireBody.setSize(tirelire.displayWidth, tirelire.displayHeight * 0.7);
        tirelire.body.setCollideWorldBounds(true);
        tirelire.body.setMaxVelocityY(0);
        makeTirelireDraggable.call(this, tirelire);
    }

    function setUpGauge() {
        gauge = this.add.image(150 * scalingFactors.widthScale, 550 * scalingFactors.heightScale, 'jauge0');
        gauge.setScale(0.15 * scalingFactors.widthScale); // Scale the gauge
    }

    function updateGauge() {
        let gaugeKey;
        if (score === 0) {
            gaugeKey = 'jauge0';
        } else if (score === 1) {
            gaugeKey = 'jauge1';
        } else if (score === 2 || score === 3) {
            gaugeKey = 'jauge2';
        } else if (score === 4 || score === 5) {
            gaugeKey = 'jauge3';
        } else {
            gaugeKey = 'jauge4';
        }
        gauge.setTexture(gaugeKey);
    }

    function setUpTimer() {
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!gameOver) {
                    timeElapsed.value += 1;
                }
            },
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
            if (
                pointer.x < 0 ||
                pointer.x > game.config.width ||
                pointer.y < 0 ||
                pointer.y > game.config.height
            ) {
                isDragging = false;
            }
        });
    }

    function spawnFallingObjects() {
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const isGood = Phaser.Math.Between(0, 1) === 1;
                let pictogramKey;
                if (isGood) {
                    const randomIndex = Phaser.Math.Between(0, assets.goodPictograms.length - 1);
                    pictogramKey = assets.goodPictograms[randomIndex].key;
                } else {
                    pictogramKey = `bad${Phaser.Math.Between(0, assets.badPictograms.length - 1)}`;
                }

                const fallingObject = this.physics.add.sprite(0, 0, pictogramKey);
                fallingObject.setScale(0.7 * scalingFactors.widthScale); // Scale the falling object
                const pictogramWidth = fallingObject.displayWidth;
                const randomX = Phaser.Math.Between(pictogramWidth / 2, game.config.width - pictogramWidth / 2);
                fallingObject.setPosition(randomX, 0);
                fallingObject.setVelocityY(Phaser.Math.Between(50, 100));
                fallingObject.isGood = isGood;

                this.physics.add.overlap(tirelire, fallingObject, collectObject, null, this);
            },
        });
    }

    function collectObject(tirelire, fallingObject) {
        fallingObject.disableBody(true, true);
        if (fallingObject.isGood) {
            const pictogramKey = fallingObject.texture.key;
            if (!collectedPictograms[pictogramKey]) {
                collectedPictograms[pictogramKey] = true;
                score += 1;
                updateGauge.call(this);
                goodSoundEffect.play();

                if (Object.keys(collectedPictograms).length === assets.goodPictograms.length) {
                    pause();
                    gameOver = true;
                    this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0).setAlpha(0.4); // Full-screen background
                    this.add.text(game.config.width / 2, game.config.height / 2, 'Jeu terminé !', {
                        fontSize: `${150 * scalingFactors.widthScale}px`,
                        fontFamily: '\'Source Sans Pro\', sans-serif',
                        fontWeight: 'bolder',
                        fill: '#fff',
                    }).setOrigin(0.5);
                    clapSoundEffect.play();
                    setTimeout(() => switchAudio(chill), 4500);
                }
            }
        } else {
            timeElapsed.value += 10;
            wrongSoundEffect.play();
        }
    }
}

onMounted(initializeGame)
</script>

<style scoped>
.game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    background-color: lightgray;
}
</style>