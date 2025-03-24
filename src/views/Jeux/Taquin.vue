<template>
  <div id="phaser-container">
    <button @click="resetPuzzle" id="reset-button" v-if="!showClassement">Réinitialiser le puzzle</button>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>🎉 Bravo ! 🎉</h2>
        <p>Vous avez résolu le puzzle !</p>
        <button @click="closeModal">Fermer</button>
      </div>
    </div>

    <ClassementFinJeu
        v-if="showClassement"
        :joueurs="listeJoueurs"
        :currentPlayerId="joueurActuelId"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import Phaser from 'phaser'
import backgroundImage from '@/assets/jeu-taquin/images/Fond_soiree.png'
import tile1 from '@/assets/jeu-taquin/images/carteVitale_01.jpg'
import tile2 from '@/assets/jeu-taquin/images/carteVitale_02.jpg'
import tile3 from '@/assets/jeu-taquin/images/carteVitale_03.jpg'
import tile4 from '@/assets/jeu-taquin/images/carteVitale_04.jpg'
import tile5 from '@/assets/jeu-taquin/images/carteVitale_05.jpg'
import tile6 from '@/assets/jeu-taquin/images/carteVitale_06.jpg'
import tile7 from '@/assets/jeu-taquin/images/carteVitale_07.jpg'
import tile8 from '@/assets/jeu-taquin/images/carteVitale_08.jpg'
import tile9 from '@/assets/jeu-taquin/images/carteVitale_09.jpg'
import tile10 from '@/assets/jeu-taquin/images/carteVitale_10.jpg'
import tile11 from '@/assets/jeu-taquin/images/carteVitale_11.jpg'
import tile12 from '@/assets/jeu-taquin/images/carteVitale_12.jpg'
import ClassementFinJeu from "@/components/ClassementFinJeu.vue";
import ambiance from '@/assets/jeu-taquin/sons/Son ambiance - taquin.mp3';
import shwish from '@/assets/jeu-taquin/sons/SWSH_Whoosh 4 (ID 1796)_LS.mp3';
import applause from '@/assets/jeu-taquin/sons/CRWDApls_Applaudissements 1 (ID 2363)_LS.mp3'; // Assuming this is the correct path for applause sound
import {useMusic} from "@/composable/volumes.js";

const {switchAudio, pause, resume} = useMusic();
switchAudio(ambiance);

// Variables réactives
const game = ref(null)
const showModal = ref(false)
const showClassement = ref(false)
const backgroundImageUrl = ref(backgroundImage)
const tiles = ref([tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9, tile10, tile11, tile12])
const grid = ref([])
const emptyPos = ref({row: 2, col: 3})
const phaserScene = ref(null)
const swishSound = ref(null)
const applauseSound = ref(null)

// Données de classement (à remplacer par vos propres données)
const joueurActuelId = ref("joueur123")
const listeJoueurs = ref([
  {id: "joueur111", name: 'Alice', score: '32,45'},
  {id: "joueur222", name: 'Bob', score: '38,12'},
  {id: "joueur333", name: 'Charlie', score: '42,83'},
  {id: "joueur123", name: 'Vous', score: '52'},  // Le joueur actuel
  {id: "joueur555", name: 'David', score: '51,92'},
  {id: "joueur555", name: 'David2', score: '60,92'}
])

// Fonction d'initialisation de Phaser
const initPhaser = () => {
  class MainScene extends Phaser.Scene {
    constructor() {
      super({key: 'MainScene'})
    }

    // Fonction appelée une fois le puzzle terminé
    showFinalTile() {
      const tileSize = this.cameras.main.width * 0.8 / 4
      const offsetX = (this.cameras.main.width - (tileSize * 4)) / 2
      const offsetY = (this.cameras.main.height - (tileSize * 3)) / 2

      // Halo lumineux autour du puzzle
      const halo = this.add.graphics()
      const haloPadding = 20
      halo.lineStyle(10, 0xffff99, 0.8)
      halo.strokeRoundedRect(
          offsetX - haloPadding,
          offsetY - haloPadding,
          tileSize * 4 + haloPadding * 2,
          tileSize * 3 + haloPadding * 2,
          15
      )

      // Animation du halo (effet pulsant)
      this.tweens.add({
        targets: halo,
        alpha: {from: 0.3, to: 1},
        duration: 800,
        yoyo: true,
        repeat: -1
      })

      // Animation de la dernière tuile qui "tombe" pour compléter le puzzle
      const finalTile = this.add.image(
          offsetX + 3 * tileSize,
          -tileSize * 2,
          'finalTile'
      )
          .setOrigin(0)
          .setDisplaySize(tileSize, tileSize)

      const targetY = offsetY + 2 * tileSize

      this.tweens.add({
        targets: finalTile,
        y: targetY,
        duration: 1000,
        ease: 'Bounce.easeOut',
        onComplete: () => {
          showModal.value = true // Affiche la modale de victoire
          applauseSound.value.play() // Joue le son d'applaudissements
        }
      })
    }

    // Précharge les assets
    preload() {
      this.load.image('background', backgroundImageUrl.value)
      this.load.image('finalTile', tile12)
      tiles.value.forEach((tile, index) => {
        this.load.image(`tile${index}`, tile)
      })

      // Précharge les sons
      this.load.audio('swish', shwish)
      this.load.audio('applause', applause)
    }

    // Crée le plateau de jeu et mélange les tuiles
    create() {
      const background = this.add.image(0, 0, 'background').setOrigin(0)
      this.resizeBackground(background)

      // Initialise les sons
      swishSound.value = this.sound.add('swish')
      applauseSound.value = this.sound.add('applause')

      this.createGrid()
      this.shuffleTiles()
      this.scale.on('resize', () => {
        this.resizeBackground(background)
      })
      phaserScene.value = this
    }

    // Crée la grille du puzzle (3 lignes x 4 colonnes)
    createGrid() {
      const rows = 3
      const cols = 4
      const boardWidth = this.cameras.main.width * 0.8
      const boardHeight = this.cameras.main.height * 0.5
      const tileSize = Math.min(boardWidth / cols, boardHeight / rows)
      const offsetX = (this.cameras.main.width - (tileSize * cols)) / 2
      const offsetY = (this.cameras.main.height - (tileSize * rows)) / 2

      let idx = 0
      for (let row = 0; row < rows; row++) {
        grid.value[row] = []
        for (let col = 0; col < cols; col++) {
          if (row === 2 && col === 3) {
            // Case vide (en bas à droite)
            grid.value[row][col] = null
            continue
          }
          // Création et positionnement de chaque tuile
          const tileSprite = this.add.image(
              offsetX + col * tileSize,
              offsetY + row * tileSize,
              `tile${idx}`
          )
              .setOrigin(0)
              .setDisplaySize(tileSize, tileSize)
              .setInteractive()

          // Sauvegarde de la position actuelle et de la position d'origine
          tileSprite.row = row
          tileSprite.col = col
          tileSprite.originalRow = Math.floor(idx / 4)
          tileSprite.originalCol = idx % 4

          // Écouteur pour déplacer la tuile
          tileSprite.on('pointerdown', () => {
            this.tryMove(tileSprite)
          })

          grid.value[row][col] = tileSprite
          idx++
        }
      }
    }

    // Tente de déplacer une tuile vers la case vide
    tryMove(tile) {
      const {row, col} = tile
      const empty = emptyPos.value
      const dist = Math.abs(empty.row - row) + Math.abs(empty.col - col)

      // On ne peut déplacer que si c'est adjacent à la case vide
      if (dist === 1) {
        // Joue le son swish lors du déplacement
        swishSound.value.play()

        grid.value[empty.row][empty.col] = tile
        grid.value[row][col] = null

        const tileSize = tile.displayWidth
        const offsetX = (this.cameras.main.width - (tileSize * 4)) / 2
        const offsetY = (this.cameras.main.height - (tileSize * 3)) / 2

        tile.row = empty.row
        tile.col = empty.col

        // Animation de déplacement fluide
        this.tweens.add({
          targets: tile,
          x: offsetX + empty.col * tileSize,
          y: offsetY + empty.row * tileSize,
          duration: 150,
          ease: 'Power2',
          onComplete: () => {
            checkWin()
          }
        })

        // Mise à jour de la position vide
        emptyPos.value = {row, col}
      }
    }

    // Mélange aléatoire des tuiles (shuffle)
    shuffleTiles() {
      let shuffled = false
      while (!shuffled) {
        const moves = 100
        for (let i = 0; i < moves; i++) {
          const neighbors = this.getMovableTiles()
          const tile = Phaser.Utils.Array.GetRandom(neighbors)
          if (tile) this.tryMove(tile)
        }
        // Si le puzzle est résolu après le shuffle, on recommence
        if (!checkWin()) {
          shuffled = true
        } else {
          resetPuzzle()
        }
      }
    }

    // Trouve les tuiles adjacentes à la case vide (mouvables)
    getMovableTiles() {
      const empty = emptyPos.value
      const candidates = []
      const directions = [
        {row: -1, col: 0},
        {row: 1, col: 0},
        {row: 0, col: -1},
        {row: 0, col: 1}
      ]

      for (const dir of directions) {
        const r = empty.row + dir.row
        const c = empty.col + dir.col
        if (r >= 0 && r < 3 && c >= 0 && c < 4 && grid.value[r][c]) {
          candidates.push(grid.value[r][c])
        }
      }
      return candidates
    }

    // Redimensionne l'image de fond pour s'adapter à la taille de la fenêtre
    resizeBackground(background) {
      const width = this.cameras.main.width
      const height = this.cameras.main.height
      const scaleX = width / background.width
      const scaleY = height / background.height
      const scale = Math.max(scaleX, scaleY)
      background.setScale(scale)
      background.setPosition(0, 0)
    }
  }

  // Création de l'instance Phaser avec la scène personnalisée
  game.value = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser-container',
    scene: [MainScene],
    scale: {
      mode: Phaser.Scale.RESIZE, // S'adapte à la taille de l'écran
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  })
}

// Vérifie si le puzzle est résolu
const checkWin = () => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (row === 2 && col === 3) continue // Ignore la case vide
      const tile = grid.value[row][col]
      if (!tile) return false
      // Est-ce que la tuile à cette position est bien celle qui devait s'y trouver ?
      if (tile.originalRow !== row || tile.originalCol !== col) {
        return false
      }
    }
  }
  if (phaserScene.value) {
    phaserScene.value.showFinalTile()
  }
  return true
}

// Ferme la fenêtre modale de victoire et affiche le classement
const closeModal = () => {
  showModal.value = false;
  showClassement.value = true; // Afficher le composant ClassementFinJeu
}

// Redimensionne le jeu lors du redimensionnement de la fenêtre
const resizeGame = () => {
  if (game.value && !showClassement.value) {
    game.value.scale.resize(window.innerWidth, window.innerHeight)
  }
}

// Réinitialise le puzzle
const resetPuzzle = () => {
  if (!phaserScene.value) return
  const scene = phaserScene.value
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const tile = grid.value[row][col]
      if (tile) tile.destroy()
    }
  }
  grid.value = []
  emptyPos.value = {row: 2, col: 3}
  scene.createGrid()
}

// Hooks du cycle de vie
onMounted(() => {
  initPhaser() // Démarre Phaser quand le composant est monté
  window.addEventListener('resize', resizeGame) // Gère le redimensionnement de la fenêtre
})

onBeforeUnmount(() => {
  if (game.value) {
    game.value.destroy(true) // Nettoyage du jeu quand le composant est détruit
  }
  window.removeEventListener('resize', resizeGame)
})
</script>

<style scoped>
#phaser-container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

#reset-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>