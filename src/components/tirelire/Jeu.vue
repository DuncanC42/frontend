<template>
    <div ref="gameContainer" class="game-container">
        <Chrono :time="timeElapsed"></Chrono>
    </div>
</template>

<script setup>
import { onMounted, ref,watch } from 'vue';
import Phaser from 'phaser';
import { useMusic } from '@/composable/volumes';
import { preloadAssets, assets } from '@/composable/tirelire/assetsLoader'; // Import the centralized asset loader
import { volumeStore } from '@/stores/volume';
import ambiance from '@/assets/tirelire/sons/ambiance.mp3';
import chill from '@/assets/sons/musiques/ambiance/chill.mp3';
import Chrono from '@/components/temps/ChronoTirelire.vue';

const gameContainer = ref(null);
const timeElapsed = ref(0)

onMounted(() => {
    const { switchAudio, pause, resume } = useMusic();
    switchAudio(ambiance);

    const fixedWidth = 2000;
    const aspectRatio = 4510 / 8014;
    const calculatedHeight = fixedWidth / aspectRatio;

    const config = {
        type: Phaser.AUTO,
        width: fixedWidth,
        height: calculatedHeight,
        parent: gameContainer.value,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
                debug: false,
            },
        },
        scene: {
            preload,
            create,
            update,
        },
    };

    const game = new Phaser.Game(config);
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
        const startTextBg = this.add.rectangle(0, 0, fixedWidth, calculatedHeight, 0x000000).setOrigin(0).setAlpha(0.4); // Full-screen background
        const startText = this.add.text(fixedWidth / 2, calculatedHeight / 2, 'Appuyer pour démarrer !', {
            fontSize: '150px',
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

            const volumes = volumeStore()

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

    function update() {
        if (!isGameStarted) return;
    }

    function setUpBackground() {
        const bg = this.add.image(fixedWidth / 2, calculatedHeight / 2, 'background');
        bg.setScale(Math.max(fixedWidth / 4510, calculatedHeight / 8014));
    }

    function setUpTirelire() {
        const tirelireYPosition = calculatedHeight - 700;
        tirelire = this.physics.add.sprite(fixedWidth / 2, tirelireYPosition, 'tirelire').setScale(0.07);
        const tirelireBody = tirelire.body;
        tirelireBody.setSize(tirelire.displayWidth, tirelire.displayHeight * 0.7);
        tirelire.body.setCollideWorldBounds(true);
        tirelire.body.setMaxVelocityY(0);
        makeTirelireDraggable.call(this, tirelire);
    }

    function setUpGauge() {
        gauge = this.add.image(150, 550, 'jauge0').setScale(0.15);
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
                newX = Phaser.Math.Clamp(newX, tirelire_size / 2, fixedWidth - tirelire_size / 2);
                tirelire.x = newX;
            }
        });
        this.input.on('pointerup', () => {
            isDragging = false;
        });
        this.input.on('pointerout', (pointer) => {
            if (
                pointer.x < 0 ||
                pointer.x > fixedWidth ||
                pointer.y < 0 ||
                pointer.y > calculatedHeight
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
                const fallingObject = this.physics.add.sprite(0, 0, pictogramKey).setScale(0.7);
                const pictogramWidth = fallingObject.displayWidth;
                const randomX = Phaser.Math.Between(pictogramWidth / 2, fixedWidth - pictogramWidth / 2);
                fallingObject.setPosition(randomX, 0);
                fallingObject.setVelocityY(Phaser.Math.Between(2000, 4000));
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
                    this.add.rectangle(0, 0, fixedWidth, calculatedHeight, 0x000000).setOrigin(0).setAlpha(0.4); // Full-screen background
                    this.add.text(fixedWidth / 2, calculatedHeight / 2, 'Jeu terminé !', {
                        fontSize: '150px',
                        fontFamily: '\'Source Sans Pro\', sans-serif',
                        fontWeight: 'bolder',
                        fill: '#fff',
                    }).setOrigin(0.5);
                    clapSoundEffect.play();
                    pauseGame.call(this);
                    setTimeout(() => switchAudio(chill), 4500);
                }
            }
        } else {
            timeElapsed.value += 10;
            wrongSoundEffect.play();
        }
    }

    function pauseGame() {
        this.scene.pause();
    }

    function unpauseGame() {
        this.scene.resume();
    }
});
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