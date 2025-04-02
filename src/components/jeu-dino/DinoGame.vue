<template>
    <div id="phaser-container">
        <Minuteur
            :couleur="'black'"
            class="timer-position"
            v-model="gameTime"
        />
        <PagePause
            v-if="!ibanCompleted && !gameOver"
            :time="remainingTimeBeforePause"
            @pause="handlePause"
            @unpause="handleUnpause"
            @retry="handleRetry"
            @leave="handleLeave"
        />
        <PageDefaite
            v-if="gameOver"
            :message="defeatMessage"
            @retry="handleRetry"
            @quit="handleLeave"
        />

        <Bravo 
            v-if="gameWon" 
            :score="score" 
            message="Les remboursements de l’Assurance Maladie se font par virement bancaire. Depuis ton compte ameli, enregistrer ton RIB c’est être sûr de recevoir les remboursements sur ton propre compte bancaire !"
            @retry="handleRetry" 
            @quit="handleLeave" 
        />
        <div ref="gameContainer" class="game-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Phaser from 'phaser'
import Bravo from '@/components/Bravo.vue'
import PagePause from '@/components/PagePause.vue'
import PageDefaite from '@/components/DommageDino.vue'
import Minuteur from '@/components/temps/MinuteurDino.vue'
import ambiance from '@/assets/jeu-dino/Son_ambiance_DINO.mp3'
import {useMusic} from "@/composable/volumes.js";
import saut from '@/assets/jeu-dino/Saut.mp3'
import { nextTick } from 'vue'

// Assets imports
import dinoImage from '@/assets/jeu-dino/dinosaure_1.png'
import cactus1 from '@/assets/jeu-dino/cactus_1.png'
import cactus2 from '@/assets/jeu-dino/cactus_2.png'
import cactus3 from '@/assets/jeu-dino/cactus_3.png'
import number9 from '@/assets/jeu-dino/9.png'
import number11 from '@/assets/jeu-dino/11.png'
import number12 from '@/assets/jeu-dino/12.png'
import number13 from '@/assets/jeu-dino/13.png'
import number14 from '@/assets/jeu-dino/14.png'
import number34 from '@/assets/jeu-dino/34.png'
import number56 from '@/assets/jeu-dino/56.png'
import number78 from '@/assets/jeu-dino/78.png'
import background from '@/assets/jeu-dino/background.png'
import iban_a_remplir from '@/assets/jeu-dino/iban_a_remplir.png'
import iban_titre from '@/assets/jeu-dino/iban_titre.png'
import montagnes from '@/assets/jeu-dino/montagnes.png'
import nuages from '@/assets/jeu-dino/nuages.png'
import herbe from '@/assets/jeu-dino/herbe.png'
import FR from '@/assets/jeu-dino/FR.png'

import applause from '@/assets/jeu-dino/applause.mp3'

const applauseSound = ref(null)

// Constants
const TIME_LIMIT = 60
const NUMBER_ORDER = ['12', '34', '56', '78', '9', '11', '11', '12', '13', '14']

// Refs
const router = useRouter()
const { switchAudio, pause, resume } = useMusic()
const minuteurRef = ref(null)
const gameContainer = ref(null)
const game = ref({
  instance: null,
  scene: null
});
const phaserScene = ref(null)
const gameOver = ref(false)
const defeatMessage = ref('')
const gameWon = ref(false)
const score = ref(0)

// Constants
const SCORE_VALUES = {
  NUMBER_COLLECTED: 40,    // 10 nombres × 40 = 400 points
  CACTUS_AVOIDED: 5,       // Environ 20 cactus × 5 = 100 points
  VICTORY_BONUS: 400,      // Bonus de base pour victoire
  TIME_BONUS_MULTIPLIER: 4 // Points par seconde restante
}

// Game state
const ibanCompleted = ref(false)
const showClassement = ref(false)
const gameTime = ref(TIME_LIMIT)
const gameTimer = ref(null)
const isGamePaused = ref(false)
const remainingTimeBeforePause = ref(0)

// Phaser game variables
let dino = null
let obstacles = null
let numbers = null
let collectedNumbers = []
let currentNumberIndex = 0
let currentNumber = null
let missedNumbers = []

// Game timer management
const startGameTimer = () => {
  if (gameTimer.value) {
    clearInterval(gameTimer.value);
    gameTimer.value = null;
  }

  gameTimer.value = setInterval(() => {
    if (!isGamePaused.value) {
      gameTime.value = Math.max(0, gameTime.value - 1);

      
      if (gameTime.value <= 0) {
        clearInterval(gameTimer.value);
        gameTimer.value = null;
        triggerDefeat("time");
      }
    }
  }, 1000); // 1000ms = 1 seconde
};


// Pause management
const handlePause = () => {
  isGamePaused.value = true;
  remainingTimeBeforePause.value = gameTime.value;
  clearInterval(gameTimer.value);

  if (game.value.instance && game.value.scene) {
    game.value.scene.scene.pause();
  }
};

const handleUnpause = () => {
  isGamePaused.value = false;
  gameTime.value = remainingTimeBeforePause.value;
  startGameTimer(); // Redémarrez le timer principal
  resume();

  if (game.value.instance && game.value.scene) {
    const scene = game.value.scene;
    if (scene.scene.isPaused()) {
      scene.scene.resume();
    }
  }
};

const handleRetry = () => {
    try {
        clearInterval(gameTimer.value);
        resetGame();
        gameWon.value = false;
        
        if (game.value.instance) {
            game.value.instance.destroy(true);
        }
        
        initGame();
    } catch (error) {
        location.reload();
    }
}

const handleLeave = () => {
  clearInterval(gameTimer.value)
  router.push('home')
}


const resetGame = () => {
    clearInterval(gameTimer.value)
    gameTime.value = TIME_LIMIT
    isGamePaused.value = false
    remainingTimeBeforePause.value = TIME_LIMIT
    ibanCompleted.value = false
    gameOver.value = false
    gameWon.value = false
    defeatMessage.value = ''
    score.value = 0
    collectedNumbers = []
    currentNumberIndex = 0
    currentNumber = null
    missedNumbers = []
}

// Phaser game functions
const preload = function() {
  this.load.image('background', background)
  this.load.image('dino', dinoImage)
  this.load.image('cactus1', cactus1)
  this.load.image('cactus2', cactus2)
  this.load.image('cactus3', cactus3)
  this.load.image('montagnes', montagnes)
  this.load.image('nuages', nuages)
  this.load.image('herbe', herbe)
  this.load.image('iban_titre', iban_titre)
  this.load.image('iban_a_remplir', iban_a_remplir)
  this.load.image('FR', FR)
  this.load.image('number9', number9)
  this.load.image('number11', number11)
  this.load.image('number12', number12)
  this.load.image('number13', number13)
  this.load.image('number14', number14)
  this.load.image('number34', number34)
  this.load.image('number56', number56)
  this.load.image('number78', number78)
  this.load.audio('ambiance', ambiance)
  this.load.audio('saut', saut)
  this.load.audio('applause', applause)
}

const create = function() {  
  // Nettoyage du timer existant
  if (gameTimer.value) {
    clearInterval(gameTimer.value);
    gameTimer.value = null;
  }

  phaserScene.value = this;
  this.add.image(500, -250, 'background').setScale(0.5);

  // Enregistrement de la scène
  game.value.scene = this;
  
  const groundY = 620;
  this.isGameOver = false;
  
  // Setup du jeu...
  setupEnvironment.call(this, groundY);
  setupPlayer.call(this, groundY);
  setupGameMechanics.call(this);

  this.scoreText = this.add.text(20, 20, `Score: ${score.value}`, {
    fontSize: '24px',
    fill: '#000',
    fontFamily: 'Arial'
  }).setScrollFactor(0).setDepth(10);

  
  // Démarrer le timer seulement après un court délai
  if (!gameTimer.value && !isGamePaused.value && !gameOver.value) {
    startGameTimer();
  }
  this.time.delayedCall(2000, () => { // Délai de 2s avant le premier spawn
      spawnNumber.call(this);
  }, [], this);

  if (this.sound && this.sound.get('applause')) {
    this.sound.get('applause').setVolume(volumes.effet_sonore || 1.0);
  }
}

const update = function() {
    
  if (this.isGameOver || this.scene.isPaused()) return

  this.scoreText.setText(`Score: ${score.value}`);
  
  handlePlayerMovement.call(this)
  handleScrolling.call(this)
  cleanupObjects.call(this)
}


const triggerDefeat = (reason) => {
  clearInterval(gameTimer.value);
  gameTimer.value = null;
  if (gameOver.value) {
    return
  }

  score.value = 0;
  
  gameOver.value = true
  
  switch(reason) {
    case 'time':
      defeatMessage.value = "Le temps est écoulé !"
      break
    case 'cactus':
      defeatMessage.value = "Vous vous êtes pris un cactus !"
      break
    default:
      defeatMessage.value = "Vous avez perdu !"
  }
  
  // Vérification de la scène Phaser
  if (game.value.instance && game.value.scene) {
    const scene = game.value.scene
    scene.physics.pause()
    scene.isGameOver = true
    
    if (scene.obstacles) {
      scene.obstacles.getChildren().forEach(obstacle => obstacle.setVelocity(0, 0))
    }
    
    if (scene.numbers) {
      scene.numbers.getChildren().forEach(number => number.setVelocity(0, 0))
    }
  } else {
    console.warn('Instance Phaser non disponible')
  }
}


const triggerVictory = () => {
  clearInterval(gameTimer.value);
  gameTimer.value = null;
  if (gameOver.value || gameWon.value) {
    return;
  }
  
  gameWon.value = true;
  const timeBonus = gameTime.value * SCORE_VALUES.TIME_BONUS_MULTIPLIER;
  score.value += SCORE_VALUES.VICTORY_BONUS + timeBonus;
  score.value = Math.min(score.value, 1000);
  
  // Jouer le son d'applaudissement
  if (game.value.instance && game.value.scene) {
    const scene = game.value.scene;
    if (scene.sound && !scene.sound.locked) {
      if (!scene.sound.get('applause')) {
        scene.sound.add('applause', applause);
      }
      scene.sound.play('applause');
    }
  }

  // Vérification de la scène Phaser
  if (game.value.instance && game.value.scene) {
    const scene = game.value.scene;
    scene.physics.pause();
    scene.isGameOver = true;
    
    if (scene.obstacles) {
      scene.obstacles.getChildren().forEach(obstacle => obstacle.setVelocity(0, 0));
    }
    
    if (scene.numbers) {
      scene.numbers.getChildren().forEach(number => number.setVelocity(0, 0));
    }
  } else {
    console.warn('Instance Phaser non disponible');
  }
};



// Helper functions
function setupEnvironment(groundY) {
  this.ground = this.add.tileSprite(0, groundY, this.scale.width * 2, 0, 'herbe')
    .setOrigin(0, 0)
    .setScale(0.5)
  this.physics.add.existing(this.ground, true)

  this.mountains = this.add.tileSprite(0, groundY - 260, this.scale.width * 2, 300, 'montagnes')
    .setOrigin(0, 0)
    .setScale(0.8)
    .setDepth(0.1)

  this.clouds = this.add.tileSprite(0, -250, this.scale.width * 2, 1200, 'nuages')
    .setOrigin(0, 0)
    .setScale(0.5)
    .setDepth(0)
}

function setupPlayer(groundY) {
  dino = this.physics.add.sprite(400, groundY - 100, 'dino')
    .setScale(0.4)
    .setCollideWorldBounds(true)
    .setDepth(5)
    .setAngle(0)

  this.physics.add.collider(dino, this.ground)

  this.jumpSettings = {
    minJumpForce: -600,
    maxJumpForce: -880,
    holdTime: 400,
    maxJumpHeight: 200,
    maxJumpDuration: 300
  }

  this.isJumping = false
  this.jumpForce = 0
  this.maxHeightReached = false
  this.consecutiveJumps = 0
  this.lastJumpTime = 0
  this.jumpComboTimeout = 1800
  this.isDoingBackflip = false
  this.comboActive = false

  setupPlayerControls.call(this)
}

function setupPlayerControls() {
  this.input.on('pointerdown', () => {
    if (dino.body.blocked.down && !this.isJumping) {
      handleJump.call(this)
    }
  })
  
  this.input.on('pointerup', () => {
    this.isJumping = false
  })
}

function handleJump() {
  const now = this.time.now
    
  this.sound.play('saut')
  if (now - this.lastJumpTime > this.jumpComboTimeout) {
    this.consecutiveJumps = 0
    this.comboActive = false
  }
  
  this.consecutiveJumps++
  this.lastJumpTime = now
  
  if (this.consecutiveJumps === 1) {
    this.comboActive = true
    this.time.delayedCall(this.jumpComboTimeout, () => {
      if (this.consecutiveJumps < 3) {
        this.consecutiveJumps = 0
        this.comboActive = false
      }
    }, [], this)
  }

  this.isJumping = true
  this.maxHeightReached = false
  this.jumpStartTime = now
  this.jumpForce = this.jumpSettings.minJumpForce
  
  if (this.comboActive && this.consecutiveJumps >= 3) {
    handleBackflip.call(this)
  }
  
  dino.setVelocityY(this.jumpForce)
  
  this.tweens.add({
    targets: dino,
    scaleX: 0.35,
    scaleY: 0.45,
    duration: 100,
    yoyo: true
  })
  
  this.time.delayedCall(this.jumpSettings.maxJumpDuration, () => {
    this.isJumping = false
  }, [], this)
}

function handleBackflip() {
  this.isDoingBackflip = true
  this.tweens.add({
    targets: dino,
    angle: { from: 0, to: 360 },
    duration: 400,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      dino.setAngle(0)
      this.isDoingBackflip = false
    }
  })
}

function setupGameMechanics() {
  obstacles = this.physics.add.group()
  numbers = this.physics.add.group()

  this.cactusAvoided = 0;

  this.baseSpeed = 3
  this.speedMultiplier = 1.0
  this.speedIncrement = 0.15

  this.speeds = {
    ground: this.baseSpeed,
    mountains: this.baseSpeed * 0.5,
    clouds: this.baseSpeed * 0.4,
    obstacles: 250,
    numbers: 250
  }

  this.numberSpawnDelay = { min: 1000, max: 3000 }

  this.time.addEvent({ 
    delay: Phaser.Math.Between(1000, 5000), 
    callback: spawnObstacle, 
    callbackScope: this 
  })
  
  this.physics.add.collider(dino, obstacles, () => {
        triggerDefeat('cactus')
    }, null, this)
  this.physics.add.overlap(dino, numbers, collectNumber, null, this)

  this.ibanParts = {
    base: this.add.image(30, 80, 'iban_a_remplir').setOrigin(0, 0).setScale(0.4),
    fr: this.add.image(50, 80, 'FR').setOrigin(0, 0).setScale(0.3),
    numbers: []
  }
  
  this.nextNumberX = 60 + this.ibanParts.fr.displayWidth + 10
}

function handlePlayerMovement() {
  if (dino.body.blocked.down) {
    if (!this.isJumping && this.time.now - this.lastJumpTime > this.jumpComboTimeout) {
      this.consecutiveJumps = 0
      this.comboActive = false
    }
    if (!this.isDoingBackflip) {
      dino.setAngle(0)
    }
  }

  if (this.isJumping && this.input.activePointer.isDown && !this.maxHeightReached) {
    const holdDuration = this.time.now - this.jumpStartTime
    const progress = Math.min(holdDuration / this.jumpSettings.holdTime, 1)
    
    this.jumpForce = this.jumpSettings.minJumpForce + 
                    (this.jumpSettings.maxJumpForce - this.jumpSettings.minJumpForce) * progress
    
    const currentHeight = dino.y - (600 - 100)
    if (currentHeight <= -this.jumpSettings.maxJumpHeight) {
      this.maxHeightReached = true
      this.isJumping = false
    } else {
      dino.setVelocityY(this.jumpForce)
    }
  }
}

function handleScrolling() {
  this.ground.tilePositionX += -this.speeds.ground * this.speedMultiplier
  this.mountains.tilePositionX += -this.speeds.mountains * this.speedMultiplier
  this.clouds.tilePositionX += -this.speeds.clouds * this.speedMultiplier
}

function cleanupObjects() {
  obstacles.getChildren().forEach(obstacle => {
    if (obstacle && obstacle.x > 530) {
      this.cactusAvoided++;
      score.value += SCORE_VALUES.CACTUS_AVOIDED;
      obstacle.destroy()
    }
  })

  numbers.getChildren().forEach(number => {
    if (number && number.x > 530) {
      missedNumber.call(this)
    }
  })
}

function spawnObstacle() {
  if (this.isGameOver) return
  
  const x = -50
  const groundY = 650
  const cactusTypes = ['cactus1', 'cactus2', 'cactus3']
  const selectedCactus = Phaser.Utils.Array.GetRandom(cactusTypes)
  
  const cactusHeights = {
    'cactus1': 134.4,
    'cactus2': 81.5,
    'cactus3': 154.5
  }

  const scale = selectedCactus === 'cactus2' ? 0.5 : 0.3
  const cactusHeight = cactusHeights[selectedCactus] * scale

  const cactus = obstacles.create(x, groundY - cactusHeight, selectedCactus)
    .setScale(scale)
    .setOrigin(0, 1)
    .setDepth(4)

  cactus.body.setAllowGravity(false)
  cactus.body.setImmovable(true)
  cactus.setVelocityX(this.speeds.obstacles * this.speedMultiplier)

  if (Math.random() < 0.3) {
    spawnSecondObstacle.call(this, x, groundY, cactusTypes, cactusHeights)
  }

  this.time.delayedCall(
    Phaser.Math.Between(1500, 5000), 
    spawnObstacle.bind(this), 
    [], 
    this
  )
}

function spawnSecondObstacle(x, groundY, cactusTypes, cactusHeights) {
  const secondCactusType = Phaser.Utils.Array.GetRandom(cactusTypes)
  const secondScale = secondCactusType === 'cactus2' ? 0.5 : 0.3
  const secondCactusHeight = cactusHeights[secondCactusType] * secondScale
  
  const secondCactus = obstacles.create(x - 60, groundY - secondCactusHeight, secondCactusType)
    .setScale(secondScale)
    .setOrigin(0, 1)
    .setDepth(4)
  
  secondCactus.setVelocityX(this.speeds.obstacles * this.speedMultiplier)
  secondCactus.body.setAllowGravity(false)
  secondCactus.body.setImmovable(true)
}

function spawnNumber() {
  if (this.isGameOver || currentNumber !== null) return

  const numberType = 'number' + NUMBER_ORDER[currentNumberIndex]
  
  currentNumber = numbers.create(-50, Phaser.Math.Between(300, 550), numberType)
    .setScale(0.5)
    .setDepth(4)
  
  currentNumber.setVelocityX(this.speeds.numbers * this.speedMultiplier)
  currentNumber.body.setAllowGravity(false)
  currentNumber.setY(Phaser.Math.Between(300, 550))

  this.physics.add.overlap(dino, currentNumber, collectNumber, null, this)
}

function collectNumber(dino, number) {
  const numberValue = number.texture.key.replace('number', '')
  
  number.destroy()
  this.speedMultiplier += this.speedIncrement

  score.value += SCORE_VALUES.NUMBER_COLLECTED;
  
  if (collectedNumbers.length === NUMBER_ORDER.length - 1) {
    // Utiliser endGame au lieu de gameOver directement
    this.time.delayedCall(100, () => {
      handleGameCompletion.call(this, number)
    }, [], this)
  } else {
    handleNumberCollection.call(this, number)
  }
}

function handleGameCompletion(number) {
  const numberValue = number.texture.key.replace('number', '')
  const numberSprite = this.add.image(
    this.nextNumberX, 
    80, 
    number.texture.key
  )
  .setOrigin(0, 0)
  .setScale(0.3)

  this.ibanParts.numbers.push(numberSprite)
  collectedNumbers.push(numberValue.replace('number', ''))

  endGame.call(this)
  
  this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
    'Bravo c\'est la win\nCliquez pour recommencer', 
    { fontSize: '32px', fill: '#000', align: 'center' }
  )
  .setOrigin(0.5)
  .setDepth(10)
}

function handleNumberCollection(number) {
  

  const numberValue = number.texture.key.replace('number', '')
  collectedNumbers.push(numberValue)
  
  const numberSprite = this.add.image(
    this.nextNumberX, 
    80, 
    number.texture.key
  )
  .setOrigin(0, 0)
  .setScale(0.3)

  this.ibanParts.numbers.push(numberSprite)
  
  updateNumberPosition.call(this, numberSprite)
  
  currentNumberIndex++
  if (currentNumberIndex < NUMBER_ORDER.length) {
    currentNumber = null
    this.time.delayedCall(
      Phaser.Math.Between(this.numberSpawnDelay.min, this.numberSpawnDelay.max),
      spawnNumber, 
      [], 
      this
    )
  }
}

function updateNumberPosition(numberSprite) {
  if (collectedNumbers.length === 1 || collectedNumbers.length === 3) {
    this.nextNumberX += numberSprite.displayWidth + 20
  } else if (collectedNumbers.length === 2 || collectedNumbers.length === 5) {
    this.nextNumberX += numberSprite.displayWidth + 8
  } else if (collectedNumbers.length === 6) {
    this.nextNumberX += numberSprite.displayWidth + 24
  } else if (collectedNumbers.length === 4) {
    this.nextNumberX += numberSprite.displayWidth + 5
  } else if ([7, 8, 9].includes(collectedNumbers.length)) { 
    this.nextNumberX += numberSprite.displayWidth + 12
  } else {
    this.nextNumberX += numberSprite.displayWidth + 2
  }
}

function missedNumber() {
  if (currentNumber) {
    missedNumbers.push(currentNumber.texture.key)
    currentNumber.destroy()
    currentNumber = null
    
    this.time.delayedCall(
      Phaser.Math.Between(this.numberSpawnDelay.min, this.numberSpawnDelay.max),
      spawnNumber, 
      [], 
      this
    )
  }
}


const endGame = () => {
    clearInterval(gameTimer.value);
    gameTimer.value = null;
    ibanCompleted.value = true;
    triggerVictory(); // Utilisez triggerVictory au lieu de triggerDefeat

}

// Lifecycle hooks
onMounted(() => {
  nextTick(() => { // Attend que le DOM soit complètement rendu
    switchAudio(ambiance);
    initGame();
  });
});

onBeforeUnmount(() => {
  if (game.value?.instance) {
    // Détruire proprement l'instance Phaser
    game.value.instance.destroy(true);
    game.value.instance = null;
  }
  clearInterval(gameTimer.value);
});

const initGame = () => {
  // Détruire l'ancien jeu s'il existe
  game.value.instance = new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 480,
      height: 800,
    },
    parent: gameContainer.value,
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

}
</script>

<style>

.timer-position {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

#phaser-container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

</style>