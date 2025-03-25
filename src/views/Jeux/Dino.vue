

<template>
    <div ref="gameContainer" class="game-container">
    </div>

  </template>
  
  <script>
  
  import Phaser from 'phaser';
  import dinoImage from '@/assets/jeu-dino/dinosaure_1.png';
  import cactus1 from '@/assets/jeu-dino/cactus_1.png';
  import cactus2 from '@/assets/jeu-dino/cactus_2.png';
  import cactus3 from '@/assets/jeu-dino/cactus_3.png';
  import number9 from '@/assets/jeu-dino/9.png';
  import number11 from '@/assets/jeu-dino/11.png';
  import number12 from '@/assets/jeu-dino/12.png';
  import number13 from '@/assets/jeu-dino/13.png';
  import number14 from '@/assets/jeu-dino/14.png';
  import number34 from '@/assets/jeu-dino/34.png';
  import number56 from '@/assets/jeu-dino/56.png';
  import number78 from '@/assets/jeu-dino/78.png';
  import background from '@/assets/jeu-dino/background.png';
  import iban_a_remplir from '@/assets/jeu-dino/iban_a_remplir.png';
  import iban_titre from '@/assets/jeu-dino/iban_titre.png';
  import montagnes from '@/assets/jeu-dino/montagnes.png';
  import nuages from '@/assets/jeu-dino/nuages.png';
  import herbe from '@/assets/jeu-dino/herbe.png';
  import FR from '@/assets/jeu-dino/FR.png';
  
  export default {
    name: 'DinoGame',
    mounted() {
      this.initGame();
    },
    beforeUnmount() {
      if (this.game) {
        this.game.destroy(true);
      }
    },
    methods: {
      initGame() {
        const game = new Phaser.Game({
          type: Phaser.AUTO,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 480,
            height: 800,
          },
          parent: document.querySelector('.game-container'),
          physics: {
            default: 'arcade',
            arcade: { gravity: { y: 2000 }, debug: false },
          },
          scene: {
            preload,
            create,
            update,
          },
        });
  
        let dino, obstacles, numbers, ibanText, collectedNumbers = [];
  
        function preload() {
          this.load.image('background', background);
          this.load.image('dino', dinoImage);
          this.load.image('cactus1', cactus1);
          this.load.image('cactus2', cactus2);
          this.load.image('cactus3', cactus3);
          this.load.image('montagnes', montagnes);
          this.load.image('nuages', nuages);
          this.load.image('herbe', herbe);
          this.load.image('iban_titre', iban_titre);
          this.load.image('iban_a_remplir', iban_a_remplir);
          this.load.image('FR', FR);
          this.load.image('number9', number9);
          this.load.image('number11', number11);
          this.load.image('number12', number12);
          this.load.image('number13', number13);
          this.load.image('number14', number14);
          this.load.image('number34', number34);
          this.load.image('number56', number56);
          this.load.image('number78', number78);
        }
  
        function create() {
            
          this.add.image(500, -250, 'background').setScale(0.5);
          const groundY = 620;
          this.isGameOver = false;
          this.ground = this.add.tileSprite(0, groundY, this.scale.width * 2, 0, 'herbe')
            .setOrigin(0, 0)
            .setScale(0.5);
            this.physics.add.existing(this.ground, true);

            this.mountains = this.add.tileSprite(0, groundY - 260, this.scale.width * 2, 300, 'montagnes')
                .setOrigin(0, 0)
                .setScale(0.8)
                .setDepth(0.1);
                

            this.clouds = this.add.tileSprite(0, -250, this.scale.width * 2, 1200, 'nuages')
                .setOrigin(0, 0)
                .setScale(0.5)
                .setDepth(0);

          dino = this.physics.add.sprite(400, groundY - 100, 'dino')
            .setScale(0.4)
            .setCollideWorldBounds(true)
            .setDepth(5)
            .setAngle(0);

            this.physics.add.collider(dino, this.ground);
  
          obstacles = this.physics.add.group();
          numbers = this.physics.add.group();

          this.baseSpeed = 3; // Vitesse de base
            this.speedMultiplier = 1.0; // Multiplicateur initial
            this.speedIncrement = 0.15; // Augmentation de vitesse par nombre
            
            // Vitesses relatives des éléments
            this.speeds = {
                ground: this.baseSpeed,
                mountains: this.baseSpeed * 0.5,
                clouds: this.baseSpeed * 0.4,
                obstacles: 250, // Vitesse initiale des obstacles
                numbers: 250    // Vitesse initiale des nombres
            };

            this.numberSpawnDelay = { min: 1000, max: 3000 };
  
          this.time.addEvent({ delay: Phaser.Math.Between(1000, 5000), callback: spawnObstacle, callbackScope: this });
          this.physics.add.collider(dino, obstacles, gameOver, null, this);
          this.physics.add.overlap(dino, numbers, collectNumber, null, this);

          this.ibanParts = {
            base: this.add.image(30, 80, 'iban_a_remplir').setOrigin(0, 0).setScale(0.4),
            fr: this.add.image(50, 80, 'FR').setOrigin(0, 0).setScale(0.3),
            numbers: [] // Stockera les sprites des nombres
        };
        this.nextNumberX = 60 + this.ibanParts.fr.displayWidth + 10;
  
          collectedNumbers = [];
          
  
          this.jumpSettings = {
                minJumpForce: -600,     // Force minimale (clic court)
                maxJumpForce: -880,     // Force maximale (clic maintenu)
                holdTime: 400,          // Temps max pour atteindre la force max (ms)
                maxJumpHeight: 200,     // Hauteur maximale de saut (en pixels)
                maxJumpDuration: 300    // Durée maximale d'application de la force (ms)
            };

            this.isJumping = false;
            this.jumpForce = 0;
            this.maxHeightReached = false;

            // Dans create(), ajoutez :
            this.consecutiveJumps = 0;
            this.lastJumpTime = 0;
            this.jumpComboTimeout = 1800; // 2 secondes pour le combo
            this.isDoingBackflip = false;
            this.comboActive = false;

            
  
            this.input.on('pointerdown', () => {
    if (dino.body.blocked.down && !this.isJumping) {
        const now = this.time.now;
        
        // Vérifie si le combo est toujours actif
        if (now - this.lastJumpTime > this.jumpComboTimeout) {
            this.consecutiveJumps = 0;
            this.comboActive = false;
        }
        
        this.consecutiveJumps++;
        this.lastJumpTime = now;
        
        // Active le combo après le premier saut
        if (this.consecutiveJumps === 1) {
            this.comboActive = true;
            this.time.delayedCall(this.jumpComboTimeout, () => {
                if (this.consecutiveJumps < 3) {
                    this.consecutiveJumps = 0;
                    this.comboActive = false;
                }
            }, [], this);
        }

        this.isJumping = true;
        this.maxHeightReached = false;
        this.jumpStartTime = now;
        this.jumpForce = this.jumpSettings.minJumpForce;
        
        // Vérifie si on doit faire un salto (3ème saut ou plus dans le combo)
        if (this.comboActive && this.consecutiveJumps >= 3) {
            this.isDoingBackflip = true;
            
            // Animation de salto plus visible
            this.tweens.add({
                targets: dino,
                angle: { from: 0, to: 360 },
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    dino.setAngle(0);
                    this.isDoingBackflip = false;
                }
            });
        }
        
        dino.setVelocityY(this.jumpForce);
        
        this.tweens.add({
            targets: dino,
            scaleX: 0.35,
            scaleY: 0.45,
            duration: 100,
            yoyo: true
        });
        
        this.time.delayedCall(this.jumpSettings.maxJumpDuration, () => {
            this.isJumping = false;
        }, [], this);
    }
});
            
        this.input.on('pointerup', () => {
            this.isJumping = false;
        });
            spawnNumber.call(this);
    }
  
        function update() {
            if (this.isGameOver) return;

            if (dino.body.blocked.down) {
                if (!this.isJumping && this.time.now - this.lastJumpTime > this.jumpComboTimeout) {
                    this.consecutiveJumps = 0;
                    this.comboActive = false;
                }
                // Réinitialise l'angle si besoin
                if (!this.isDoingBackflip) {
                    dino.setAngle(0);
                }
            }
    
            // Gestion du saut progressif avec limite de hauteur
            if (this.isJumping && this.input.activePointer.isDown && !this.maxHeightReached) {
                const holdDuration = this.time.now - this.jumpStartTime;
                const progress = Math.min(holdDuration / this.jumpSettings.holdTime, 1);
                
                this.jumpForce = this.jumpSettings.minJumpForce + 
                                (this.jumpSettings.maxJumpForce - this.jumpSettings.minJumpForce) * progress;
                
                // Vérifie si on a atteint la hauteur max
                const currentHeight = dino.y - (600 - 100); // Hauteur par rapport au sol initial
                if (currentHeight <= -this.jumpSettings.maxJumpHeight) {
                    this.maxHeightReached = true;
                    this.isJumping = false;
                } else {
                    dino.setVelocityY(this.jumpForce);
                }
            }

           

            // Applique la vitesse à tous les éléments du décor
            this.ground.tilePositionX += -this.speeds.ground * this.speedMultiplier;
            this.mountains.tilePositionX += -this.speeds.mountains * this.speedMultiplier;
            this.clouds.tilePositionX += -this.speeds.clouds * this.speedMultiplier;

            // Mise à jour des obstacles et nombres avec la nouvelle vitesse
            obstacles.getChildren().forEach(obstacle => {
                if (obstacle && obstacle.x > 530) {
                    obstacle.destroy();
                }
            });

            numbers.getChildren().forEach(number => {
                if (number && number.x > 530) {
                    missedNumber.call(this);
                }
            });
        }
  
        const numberOrder = ['12', '34', '56', '78', '9', '11', '11', '12', '13', '14'];
        let currentNumberIndex = 0;
        let currentNumber = null;
        let missedNumbers = []; // Liste des numéros ratés
  
        function spawnObstacle() {

          if (this.isGameOver) return;
          const x = -50;
          const groundY = 650;
          const cactusTypes = ['cactus1', 'cactus2', 'cactus3'];
          const selectedCactus = Phaser.Utils.Array.GetRandom(cactusTypes);
          
          const cactusHeights = {
                'cactus1': 134.4,
                'cactus2': 81.5,
                'cactus3': 154.5
            };

            const scale = selectedCactus === 'cactus2' ? 0.5 : 0.3;
            const cactusHeight = cactusHeights[selectedCactus] * scale;

            const cactus = obstacles.create(x, groundY - cactusHeight, selectedCactus)
                .setScale(scale)
                .setOrigin(0, 1)
                .setDepth(4);

            cactus.body.setAllowGravity(false);
            cactus.body.setImmovable(true);

            cactus.setVelocityX(this.speeds.obstacles * this.speedMultiplier);
  
            if (Math.random() < 0.3) {
                const secondCactusType = Phaser.Utils.Array.GetRandom(cactusTypes);
                const secondScale = secondCactusType === 'cactus2' ? 0.5 : 0.3;
                const secondCactusHeight = cactusHeights[secondCactusType] * secondScale;
                
                const secondCactus = obstacles.create(x - 60, groundY - secondCactusHeight, secondCactusType)
                .setScale(secondScale)
                .setOrigin(0, 1)
                .setDepth(4);
                
                secondCactus.setVelocityX(this.speeds.obstacles * this.speedMultiplier);
                secondCactus.body.setAllowGravity(false);
                secondCactus.body.setImmovable(true);
            }

        this.time.delayedCall(Phaser.Math.Between(1500, 5000), spawnObstacle.bind(this), [], this);
        }
  
        function spawnNumber() {
            if (this.isGameOver) return; 
            // Si aucun nombre actuel n'est en cours, on génère le suivant
            if (currentNumber !== null) {
                return; // Ne crée un nouveau nombre que si aucun nombre n'est en cours
            }

            // Vérifie si le nombre actuel est celui qu'on attend dans l'ordre
            let numberType = 'number' + numberOrder[currentNumberIndex];
            
            // Crée le nombre
            currentNumber = numbers.create(-50, Phaser.Math.Between(300, 550), numberType).setScale(0.5).setDepth(4);
            currentNumber.setVelocityX(this.speeds.numbers * this.speedMultiplier);
            currentNumber.body.setAllowGravity(false);
            currentNumber.setY(Phaser.Math.Between(300, 550));

            // Ajoute une collision pour collecter le nombre
            this.physics.add.overlap(dino, currentNumber, collectNumber.bind(this), null, this);
        }


        // Modifie la fonction collectNumber pour traiter le nombre actuel
        function collectNumber(dino, number) {
    const numberValue = number.texture.key.replace('number', '');
    
    // Détruit le nombre immédiatement (disparaît de l'écran)
    number.destroy();
    
    this.speedMultiplier += this.speedIncrement;
    // Vérifie si c'est le dernier numéro
    if (collectedNumbers.length === numberOrder.length - 1) {
        // Ajoute le sprite du dernier nombre collecté
        const numberSprite = this.add.image(
            this.nextNumberX, 
            50, 
            number.texture.key
        )
        .setOrigin(0, 0)
        .setScale(0.3);

        this.ibanParts.numbers.push(numberSprite);
        collectedNumbers.push(numberValue);

        // Affiche le message de victoire après un petit délai (pour l'effet visuel)
        this.time.delayedCall(100, () => {
            let gameWinText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
                'Bravo c\'est la win\nCliquez pour recommencer', 
                { fontSize: '32px', fill: '#000', align: 'center' }
            ).setOrigin(0.5)
            .setDepth(10);

            this.isGameOver = true;
            this.physics.pause();
            
            obstacles.getChildren().forEach(obstacle => {
                obstacle.setVelocity(0, 0);
            });
            this.input.once('pointerdown', () => {
                location.reload(); // Recharge la page
            });
        }, [], this);
    } else {
        // Pour les numéros normaux (pas le dernier)
        collectedNumbers.push(numberValue);
        
        // Ajoute le sprite du nombre collecté
        const numberSprite = this.add.image(
            this.nextNumberX, 
            80, 
            number.texture.key
        )
        .setOrigin(0, 0)
        .setScale(0.3);

        this.ibanParts.numbers.push(numberSprite);
        
        // Ajuste l'espacement (comme avant)
        if (collectedNumbers.length === 1 || collectedNumbers.length === 3) {
            this.nextNumberX += numberSprite.displayWidth + 20;
        } else if (collectedNumbers.length === 2 || collectedNumbers.length === 5) {
            this.nextNumberX += numberSprite.displayWidth + 8;
        } else if (collectedNumbers.length === 6) {
            this.nextNumberX += numberSprite.displayWidth + 24;
        } else if (collectedNumbers.length === 4) {
            this.nextNumberX += numberSprite.displayWidth + 5;
        } else if (collectedNumbers.length === 8 || collectedNumbers.length === 9 || collectedNumbers.length === 7) { 
            this.nextNumberX += numberSprite.displayWidth + 12;
        } else {
            this.nextNumberX += numberSprite.displayWidth + 2;
        }

        // Passe au numéro suivant
        currentNumberIndex++;
        if (currentNumberIndex < numberOrder.length) {
            currentNumber = null;
            // Planifie l'apparition du prochain nombre après un délai aléatoire
            this.time.delayedCall(
                Phaser.Math.Between(this.numberSpawnDelay.min, this.numberSpawnDelay.max),
                spawnNumber, 
                [], 
                this
            );
        }
    }
}

  
        function gameOver() {
            // Met le jeu en pause
            this.isGameOver = true;
            this.physics.pause();
            
            obstacles.getChildren().forEach(obstacle => {
                obstacle.setVelocity(0, 0);
            });
            
            numbers.getChildren().forEach(number => {
                number.setVelocity(0, 0);
            });

            // Ajoute un texte "Game Over" au centre de l'écran
            let gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
                `Game Over\nCliquez pour recommencer`, 
                { fontSize: '32px', fill: '#000', align: 'center' }
            ).setOrigin(0.5)
            .setDepth(10);

            // Ajoute un événement de clic pour recharger la page
            this.input.once('pointerdown', () => {
                location.reload(); // Recharge la page
            });
        }


        function missedNumber() {
            if (currentNumber) {
                missedNumbers.push(currentNumber.texture.key);
                currentNumber.destroy();
                currentNumber = null;
                
                // Planifie l'apparition du prochain nombre après un délai aléatoire
                this.time.delayedCall(
                    Phaser.Math.Between(this.numberSpawnDelay.min, this.numberSpawnDelay.max),
                    spawnNumber, 
                    [], 
                    this
                );
            }
        }
  
        this.game = game;
      },
    },
  };
  </script>
  
  <style>
  .game-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  </style>
  