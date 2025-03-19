<template>
    <div ref="gameContainer" class="game-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Phaser from 'phaser';

// Import des images
import tirelireSprite from '@/assets/tirelire/images/Tirelire.png';
import background from '@/assets/tirelire/images/background.png';

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

    function preload() {
        this.load.image('tirelire', tirelireSprite);
        this.load.image('background', background);
    }

    function create() {
        setUpBackground.call(this);
        setUpTirelire.call(this);
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

        tirelire.body.setCollideWorldBounds(true);
        tirelire.body.setMaxVelocityY(0);

        makeTirelireDraggable.call(this, tirelire);
    }

    function makeTirelireDraggable(tirelire) {
        tirelire.setInteractive();
        let tirelire_size = tirelire.displayWidth;

        // Start dragging when pointer is pressed anywhere in the game canvas
        this.input.on('pointerdown', () => {
            isDragging = true;
        });

        // Move the tirelire horizontally
        this.input.on('pointermove', (pointer) => {
            if (isDragging) {
                let newX = pointer.x;

                // Restrict movement within the game bounds (X-axis only)
                newX = Phaser.Math.Clamp(newX, tirelire_size / 2, fixedWidth - tirelire_size / 2);
                tirelire.x = newX;
            }
        });

        // Stop dragging when pointer is released
        this.input.on('pointerup', () => {
            isDragging = false;
        });

        // Stop dragging if the pointer leaves the entire game canvas
        this.input.on('pointerout', (pointer) => {
            // Check if the pointer is outside the game canvas bounds
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
});
</script>

<style scoped>
.game-container {
    width: 100vw;
    height: fit-content;
    margin: 0 auto;
}
</style>