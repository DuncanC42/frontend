<template>
    <div ref="gameContainer" class="game-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Phaser from 'phaser';

// Import des images
import tirelireSprite from '@/assets/tirelire/images/Tirelire.png';
import background from '@/assets/tirelire/images/background.png';

// Good picto
import hopital from '@/assets/tirelire/images/pictos_bons/Hopital.png';
import auditive from '@/assets/tirelire/images/pictos_bons/AideAuditive.png';
import dentiste from '@/assets/tirelire/images/pictos_bons/Dentiste.png';
import medecin from '@/assets/tirelire/images/pictos_bons/Medecin.png';
import optique from '@/assets/tirelire/images/pictos_bons/Optique.png';
import transport from '@/assets/tirelire/images/pictos_bons/TransportSanitaire.png';

// Bad picto
import ampoule from '@/assets/tirelire/images/pictos_faux/ampoule.png';
import courrier from '@/assets/tirelire/images/pictos_faux/courrier.png';
import etude from '@/assets/tirelire/images/pictos_faux/etude.png';
import livre from '@/assets/tirelire/images/pictos_faux/livre.png';
import maison from '@/assets/tirelire/images/pictos_faux/maison.png';
import puzzle from '@/assets/tirelire/images/pictos_faux/puzzle.png';
import telephone from '@/assets/tirelire/images/pictos_faux/telephone.png';

const gameContainer = ref(null);

onMounted(() => {
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
    let scoreText;
    let timerText;
    let timeElapsed = 0;
    let collectedPictograms = {};
    let gameOver = false;

    // Arrays of good and bad pictograms
    const goodPictograms = [
        { key: 'hopital', image: hopital },
        { key: 'auditive', image: auditive },
        { key: 'dentiste', image: dentiste },
        { key: 'medecin', image: medecin },
        { key: 'optique', image: optique },
        { key: 'transport', image: transport },
    ];
    const badPictograms = [ampoule, courrier, etude, livre, maison, puzzle, telephone];

    function preload() {
        this.load.image('tirelire', tirelireSprite);
        this.load.image('background', background);

        // Load all pictograms
        goodPictograms.forEach((picto) => this.load.image(picto.key, picto.image));
        badPictograms.forEach((picto, index) => this.load.image(`bad${index}`, picto));
    }

    function create() {
        setUpBackground.call(this);
        setUpTirelire.call(this);
        setUpScore.call(this);
        setUpTimer.call(this);
        spawnFallingObjects.call(this);
    }

    function update() {
        // Logique supplémentaire si nécessaire
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

    function setUpScore() {
        scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '100px',
            fill: '#fff',
        });
    }

    function setUpTimer() {
        // Create the timer text in the top-right corner
        timerText = this.add.text(fixedWidth - 16, 16, 'Time: 0s', {
            fontSize: '100px',
            fill: '#fff',
        }).setOrigin(1, 0); // Align text to the top-right corner

        // Update the timer every second
        this.time.addEvent({
            delay: 1000, // 1 second
            loop: true,
            callback: () => {
                if (!gameOver) {
                    timeElapsed += 1;
                    timerText.setText(`Time: ${timeElapsed}s`);
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
            delay: 1000, // Spawn every second
            loop: true, // Repeat indefinitely
            callback: () => {
                // Randomly decide if the pictogram is good or bad (50/50 chance)
                const isGood = Phaser.Math.Between(0, 1) === 1;

                let pictogramKey;
                if (isGood) {
                    const randomIndex = Phaser.Math.Between(0, goodPictograms.length - 1);
                    pictogramKey = goodPictograms[randomIndex].key;
                } else {
                    pictogramKey = `bad${Phaser.Math.Between(0, badPictograms.length - 1)}`;
                }

                const fallingObject = this.physics.add.sprite(0, 0, pictogramKey).setScale(0.7);
                const pictogramWidth = fallingObject.displayWidth;

                // Ensure the pictogram spawns within the game frame
                const randomX = Phaser.Math.Between(pictogramWidth / 2, fixedWidth - pictogramWidth / 2);
                fallingObject.setPosition(randomX, 0);

                fallingObject.setVelocityY(Phaser.Math.Between(2000, 4000));

                // Tag the object as good or bad for collision detection
                fallingObject.isGood = isGood;

                // Detect collisions between falling objects and tirelire
                this.physics.add.overlap(tirelire, fallingObject, collectObject, null, this);
            },
        });
    }

    function collectObject(tirelire, fallingObject) {
        // Destroy the falling object immediately
        fallingObject.disableBody(true, true);

        if (fallingObject.isGood) {
            const pictogramKey = fallingObject.texture.key;

            // Check if the pictogram has already been collected
            if (!collectedPictograms[pictogramKey]) {
                // Mark the pictogram as collected and increment the score
                collectedPictograms[pictogramKey] = true;
                score += 1;
                scoreText.setText(`Score: ${score}`);

                // Check if all good pictograms have been collected
                if (Object.keys(collectedPictograms).length === goodPictograms.length) {
                    gameOver = true;
                    this.add.text(fixedWidth / 2, calculatedHeight / 2, 'Game Complete!', {
                        fontSize: '200px',
                        fill: '#0f0',
                    }).setOrigin(0.5);
                }
            }
        } else {
            // Increase the timer by 10 seconds for bad pictograms
            timeElapsed += 10;
            timerText.setText(`Time: ${timeElapsed}s`);
        }
    }
});
</script>

<style scoped>
.game-container {
    width: 100vw;
    height: fit-content;
    margin: 0 auto;
}
</style>