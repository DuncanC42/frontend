<!-- src/components/JeuTaquin.vue -->
<template>
    <div id="phaser-container">
        <!-- Minuteur -->
        <Minuteur
            ref="minuteurRef"
            :couleur="'white'"
            class="timer-position"
            v-model="gameTime"
            @timeup="handleGameOver"
        />
        <div v-if="gameLost" class="minuteur-fixed red">
            00'00
            <font-awesome-icon :icon="['fas', 'stopwatch']" class="red" />
        </div>
        <!-- Bouton de pause -->
        <PagePause
            v-if="!puzzleCompleted"
            :time="remainingTimeBeforePause"
            @pause="handlePause"
            @unpause="handleUnpause"
            @retry="handleRetry"
            @leave="handleLeave"
        />

        <Bravo 
            v-if="gameWon" 
            :score="score" 
            :jeu="1"
            message="L'Assurance Maladie offre des rendez-vous de prévention avec le dentiste appelés « M'T dents » aux jeunes de âgés de 18, 21 et 24 ans !"
            @retry="handleRetry" 
            @quit="handleLeave" 
        />
        <Dommage 
            v-if="gameLost" 
            message="L'Assurance Maladie offre des rendez-vous de prévention avec le dentiste appelés « M'T dents » aux jeunes de âgés de 18, 21 et 24 ans !"
            @retry="handleRetry" 
            @quit="handleLeave" 
        />
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
    import Phaser from 'phaser'
    import Minuteur from '@/components/temps/Minuteur.vue'
    import PagePause from '@/components/PagePause.vue'
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
    import ambiance from '@/assets/jeu-taquin/sons/Son ambiance - taquin.mp3';
    import shwish from '@/assets/jeu-taquin/sons/switch.mp3';
    import applause from '@/assets/jeu-taquin/sons/CRWDApls_Applaudissements 1 (ID 2363)_LS.mp3';
    import {useMusic} from "@/composable/volumes.js";
    import { useRouter } from 'vue-router';
    
    import Bravo from '@/components/Bravo.vue'
    import Dommage from '@/components/Dommage.vue'
    
    import { volumeStore } from '@/stores/volume';
    
    const router = useRouter()
    const {switchAudio, pause, resume} = useMusic();
    switchAudio(ambiance);

    
    
    const minuteurRef = ref(null)
    
    const puzzleCompleted = ref(false)
    
    const gameWon = ref(false)
    const gameLost = ref(false)
    const score = ref(0)
    
    const moveCount = ref(0)

    const calculateScore = () => {
        const timeLeft = gameTime.value; // Temps restant en secondes
        const moves = moveCount.value;   // Nombre de coups utilisés
        
        // Paramètres de performance idéale
        const IDEAL_TIME = 45;  // Temps idéal pour score max
        const IDEAL_MOVES = 10; // Nombre de coups idéal
        const MIN_SCORE = 800;  // Score minimum garanti
        
        // Calcul des composantes du score (0 à 1)
        const timeComponent = Math.min(1, timeLeft / IDEAL_TIME);
        const movesComponent = Math.max(0, 1 - (moves - IDEAL_MOVES) / (IDEAL_MOVES * 0.5));
        
        // Pondération (60% temps, 40% coups)
        let score = Math.round((timeComponent * 0.6 + movesComponent * 0.4) * 1000);
        
        // Ajustement des plages selon la performance
        if (timeLeft >= 50 && moves <= 8) {
            // Performance exceptionnelle
            score = 1000;
        } else if (timeLeft >= 40 && moves <= 12) {
            // Très bonne performance
            score = Phaser.Math.Between(950, 1000);
        } else if (timeLeft >= 30 || moves <= 15) {
            // Bonne performance
            score = Phaser.Math.Between(900, 950);
        } else {
            // Performance standard
            score = Phaser.Math.Between(850, 900);
        }
        
        // Garantie de score minimum
        score = Math.max(MIN_SCORE, score);
        
        return Phaser.Math.Clamp(score, MIN_SCORE, 1000);
    }
    
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
    
    // Gestion du temps de jeu
    const TIME_LIMIT = 60
    const gameTime = ref(TIME_LIMIT);
    const gameTimer = ref(null)
    const isGamePaused = ref(false)
    
    const volumes = volumeStore()
    if (applauseSound.value) {
        applauseSound.value.volume = volumes.effet_sonore
    }
    // Stocke le temps restant avant la pause
    const remainingTimeBeforePause = ref(0)
    
    // Gestion du temps de jeu
    const startGameTimer = () => {
        gameTimer.value = setInterval(() => {
            if (!isGamePaused.value && gameTime.value > 0) {
                gameTime.value--
            }
            // Vérifier si le temps est écoulé
            if (gameTime.value <= 0) {
                clearInterval(gameTimer.value)
                handleGameOver()
            }
        }, 1000)
    }
    
    const handlePause = () => {
        isGamePaused.value = true
        remainingTimeBeforePause.value = gameTime.value // Sauvegarde le temps restant
        minuteurRef.value.pauseTimer() // Mettre en pause le minuteur
        
        // Mettre en pause la scène Phaser si elle existe
        if (phaserScene.value) {
            phaserScene.value.scene.pause()
        }
    }
    
    const handleUnpause = () => {
        isGamePaused.value = false
        gameTime.value = remainingTimeBeforePause.value // Restaure le temps restant
        minuteurRef.value.startTimer() // Redémarre le minuteur
        resume() // Reprendre la musique

        // Reprendre la scène Phaser si elle existe
        if (phaserScene.value) {
            phaserScene.value.scene.resume()
        }
    }

    const handleRetry = () => {
        // Réinitialisation complète
        clearInterval(gameTimer.value)
        
        gameWon.value = false
        gameLost.value = false
        puzzleCompleted.value = false
        showModal.value = false
        showClassement.value = false
        
        resetPuzzle()
        gameTime.value = TIME_LIMIT
        isGamePaused.value = false
        remainingTimeBeforePause.value = TIME_LIMIT

        // Redémarre le timer
        startGameTimer()
        resume()

        // Reprendre la scène Phaser
        if (phaserScene.value) {
            phaserScene.value.scene.restart()
        }
    }

    const handleLeave = () => {
        // Arrêter le timer et la musique
        clearInterval(gameTimer.value)
        router.push('home')
    }
    
    const handleGameOver = () => {
        if (gameWon.value) return;
        
        gameLost.value = true;
        score.value = calculateScore();
        
        // Pause Phaser
        if (phaserScene.value?.scene) {
            phaserScene.value.scene.pause();
        }
        
        // Stop timer
        if (minuteurRef.value?.stopTimer) {
            minuteurRef.value.stopTimer();
        } else {
            clearInterval(gameTimer.value);
        }
        
        isGamePaused.value = true;
    }

    // Fonction d'initialisation de Phaser
    const initPhaser = () => {
        class MainScene extends Phaser.Scene {
            constructor() {
                super({key: 'MainScene'})
            }
        
            shuffleTiles() {
                generateSolvablePuzzle()
            }
            // Fonction appelée une fois le puzzle terminé
            showFinalTile() {
                puzzleCompleted.value = true
                
                if (this.sound && !this.sound.get('applause')) {
                    this.sound.add('applause', applause).play()
                } else if (applauseSound.value) {
                    applauseSound.value.play()
                }

                const finalScore = calculateScore()
                const textStyle = {
                    font: '24px Arial',
                    fill: '#ffffff',
                    backgroundColor: '#000000'
                }
                
                // Animation de la dernière pièce
                const finalTile = this.add.image(
                    this.cameras.main.width / 2,
                    -100,
                    'finalTile'
                ).setDisplaySize(150, 150)

                this.tweens.add({
                    targets: finalTile,
                    y: this.cameras.main.height / 2 - 50,
                    duration: 800,
                    ease: 'Bounce.easeOut',
                    onComplete: () => {
                    // Afficher le score
                    this.add.text(
                        this.cameras.main.width / 2,
                        this.cameras.main.height / 2 + 50,
                        `Score: ${finalScore}\nCoups: ${moveCount.value}`,
                        textStyle
                    ).setOrigin(0.5)
                    
                    gameWon.value = true
                    score.value = finalScore
                    clearInterval(gameTimer.value)
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
                try {
                    swishSound.value = this.sound.add('swish')
                    applauseSound.value = this.sound.add('applause')
                    // Réglez les volumes initiaux si nécessaire
                    const volumes = volumeStore()
                    if (applauseSound.value) applauseSound.value.volume = volumes.effet_sonore
                } catch (e) {
                    console.error("Erreur d'initialisation des sons:", e)
                }
                
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
                    moveCount.value++
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
                if (row === 2 && col === 3) continue
                const tile = grid.value[row][col]
                if (!tile) return false
                if (tile.originalRow !== row || tile.originalCol !== col) {
                    return false
                }
            }
        }

        if (phaserScene.value?.sound?.get('applause')) {
            phaserScene.value.sound.play('applause')
        } else if (applauseSound.value) {
            applauseSound.value.play()
        }

        gameWon.value = true
        score.value = calculateScore()
        if (phaserScene.value) {
            phaserScene.value.scene.pause()
        }
        return true
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
        // Nettoyer le timer
        if (gameTimer.value) {
            clearInterval(gameTimer.value)
    }

    if (game.value) {
        game.value.destroy(true) // Nettoyage du jeu quand le composant est détruit
    }
    window.removeEventListener('resize', resizeGame)
    })
  
    const generateSolvablePuzzle = () => {
        if (!phaserScene.value) return;

        const scene = phaserScene.value;
        
        // Réinitialisation
        grid.value.flat().forEach(tile => tile?.destroy());
        grid.value = [];
        emptyPos.value = { row: 2, col: 3 };
        scene.createGrid();

        // Génère un puzzle avec un nombre contrôlé de mouvements (8-12 coups)
        const targetMoves = Phaser.Math.Between(8, 12);
        const moveHistory = [];
        
        for (let i = 0; i < targetMoves; i++) {
            const movableTiles = scene.getMovableTiles();
            if (movableTiles.length === 0) break;

            // Évite le mouvement inverse du précédent
            const lastMove = moveHistory[moveHistory.length - 1];
            const availableTiles = lastMove 
            ? movableTiles.filter(tile => tile !== lastMove)
            : movableTiles;

            const tileToMove = availableTiles.length > 0
            ? Phaser.Utils.Array.GetRandom(availableTiles)
            : Phaser.Utils.Array.GetRandom(movableTiles);
            
            scene.tryMove(tileToMove);
            moveHistory.push(tileToMove);
            
            // Garde seulement les 2 derniers mouvements en mémoire
            if (moveHistory.length > 2) {
            moveHistory.shift();
            }
        }
    }
    watch(gameTime, (newVal) => {
        if (newVal <= 0 && !gameWon.value && !gameLost.value) {
            handleGameOver();
        }
    });
</script>
  
<style scoped>
#phaser-container {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: calc(100vh - 5em); /* Réduire la hauteur de 2em */
    overflow: hidden;
    position: relative;
    top: 5em; /* Décaler vers le bas de 2em */
}


#reset-button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.timer-position {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    padding: 5px;
    width: 3.25em;
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

/* Ajoutez ceci dans la section <style> */
.dommage-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Au-dessus de tout */
}

.dommage-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 80%;
  text-align: center;
}

.dommage-enter-active,
.dommage-leave-active {
  transition: all 0.5s ease;
}
.dommage-enter-from,
.dommage-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.minuteur-fixed {
  font-size: 32px;
  text-align: center;
  background-color: #c4c4c448;
  border-radius: 10px;
  filter: drop-shadow(0px 4px 4px #00000040);
  padding: 5px;
  margin-left: 9em;
  margin-top: 5px;
  position: relative;
  z-index: 100;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.red {
  color: #cf0000;
}
</style>