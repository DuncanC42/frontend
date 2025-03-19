<template>
  <div id="phaser-container"></div>
</template>

<script>
import Phaser from 'phaser'
import backgroundImage from '@/assets/jeu-taquin/Fond_soiree.png'
import tile1 from '@/assets/jeu-taquin/carteVitale_01.jpg'
import tile2 from '@/assets/jeu-taquin/carteVitale_02.jpg'
import tile3 from '@/assets/jeu-taquin/carteVitale_03.jpg'
import tile4 from '@/assets/jeu-taquin/carteVitale_04.jpg'
import tile5 from '@/assets/jeu-taquin/carteVitale_05.jpg'
import tile6 from '@/assets/jeu-taquin/carteVitale_06.jpg'
import tile7 from '@/assets/jeu-taquin/carteVitale_07.jpg'
import tile8 from '@/assets/jeu-taquin/carteVitale_08.jpg'
import tile9 from '@/assets/jeu-taquin/carteVitale_09.jpg'
import tile10 from '@/assets/jeu-taquin/carteVitale_10.jpg'
import tile11 from '@/assets/jeu-taquin/carteVitale_11.jpg'
import tile12 from '@/assets/jeu-taquin/carteVitale_12.jpg'

export default {
  name: 'Taquin',
  data() {
    return {
      game: null,
      backgroundImageUrl: backgroundImage,
      tiles: [tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9, tile10, tile11, tile12],
      grid: [],
      emptyPos: { row: 2, col: 3 }
    }
  },
  mounted() {
    this.initPhaser()
    window.addEventListener('resize', this.resizeGame)
  },
  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true)
    }
    window.removeEventListener('resize', this.resizeGame)
  },
  methods: {
    initPhaser() {
      const self = this

      class MainScene extends Phaser.Scene {
        constructor() {
          super({ key: 'MainScene' })
        }

        preload() {
          this.load.image('background', self.backgroundImageUrl)
          self.tiles.forEach((tile, index) => {
            this.load.image(`tile${index}`, tile)
          })
        }

        create() {
          const background = this.add.image(0, 0, 'background').setOrigin(0)
          this.resizeBackground(background)
          this.createGrid()
          this.shuffleTiles()
          this.scale.on('resize', () => {
            this.resizeBackground(background)
          })
        }

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
            self.grid[row] = []
            for (let col = 0; col < cols; col++) {
              if (row === 2 && col === 3) {
                self.grid[row][col] = null
                continue
              }
              const tileSprite = this.add.image(
                  offsetX + col * tileSize,
                  offsetY + row * tileSize,
                  `tile${idx}`
              )
                  .setOrigin(0)
                  .setDisplaySize(tileSize, tileSize)
                  .setInteractive()

              tileSprite.row = row
              tileSprite.col = col
              tileSprite.originalRow = row
              tileSprite.originalCol = col

              tileSprite.on('pointerdown', () => {
                this.tryMove(tileSprite)
              })

              self.grid[row][col] = tileSprite
              idx++
            }
          }
        }

        tryMove(tile) {
          const {row, col} = tile
          const empty = self.emptyPos
          const dist = Math.abs(empty.row - row) + Math.abs(empty.col - col)

          if (dist === 1) {
            // Swap
            self.grid[empty.row][empty.col] = tile
            self.grid[row][col] = null

            // Move tile
            const tileSize = tile.displayWidth
            const offsetX = (this.cameras.main.width - (tileSize * 4)) / 2
            const offsetY = (this.cameras.main.height - (tileSize * 3)) / 2

            tile.row = empty.row
            tile.col = empty.col

            this.tweens.add({
              targets: tile,
              x: offsetX + empty.col * tileSize,
              y: offsetY + empty.row * tileSize,
              duration: 150,
              ease: 'Power2'
            })

            self.emptyPos = {row, col}
          }
        }

        shuffleTiles() {
          const moves = 100
          for (let i = 0; i < moves; i++) {
            const neighbors = this.getMovableTiles()
            const tile = Phaser.Utils.Array.GetRandom(neighbors)
            if (tile) this.tryMove(tile)
          }
        }

        getMovableTiles() {
          const empty = self.emptyPos
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
            if (r >= 0 && r < 3 && c >= 0 && c < 4 && self.grid[r][c]) {
              candidates.push(self.grid[r][c])
            }
          }
          return candidates
        }

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

      const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [MainScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      }

      this.game = new Phaser.Game(config)
    },

    resizeGame() {
      if (this.game) {
        this.game.scale.resize(window.innerWidth, window.innerHeight)
      }
    }
  }
}
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
</style>
