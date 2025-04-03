<template>
  <div class="game-container" @touchmove="preventScroll">
    <MinuteurDent 
      v-if="!gameLost"
      ref="minuteur"
      couleur="white" 
      :duree="60"
      :isPaused="isGamePaused || !timerReady"
      @timeUpdate="updateTime"
    />

    <div v-if="gameLost" class="minuteur-fixed red">
      00'00
      <font-awesome-icon :icon="['fas', 'stopwatch']" class="red" />
    </div>
    

    <PagePause 
      :time="currentTime" 
      @pause="pauseGame" 
      @unpause="unpauseGame" 
      @leave="handleLeave"
      @retry="handleRetry">
    </PagePause>

    <div class="mouth-container">

      <img :src="mouthImage" alt="Bouche" class="mouth" />
      <!-- Canvas pour les dents jaunes -->
      <canvas ref="dentsCanvas" class="dents-canvas"></canvas>

      <img
        v-if="isBrushingActive"
        ref="toothbrush"
        src="@/assets/Jeu5/brosse_a_dent_en_mouvement.png"
        alt="Brosse à dents"
        class="toothbrush"
        :style="brushPosition"
        @touchstart="startBrush"
        @touchmove="moveBrush"
        @touchend="stopBrush"
        @mousedown="startBrush"
        @mousemove="moveBrush"
        @mouseup="stopBrush"
      />

      <!-- Caries, microbes, mousse, etc. -->
      <img v-for="(microbe, index) in microbes"
        :key="'microbe-' + index"
        :src="microbe.src"
        alt="Microbe"
        class="microbe"
        :style="{ left: microbe.x + 'px', top: microbe.y + 'px', position: 'absolute', width: microbe.currentSize + '%', height: 'auto' }" />

        <img v-for="(carie, index) in caries"
          :key="'carie-' + index"
          :src="carie.src"
          alt="Carie"
          class="carie"
          :style="{
              left: carie.x + 'px',
              top: carie.y + 'px',
              position: 'absolute',
              width: carie.src.includes('carie_haut') ? '3%' : '10%' // 15% pour carieHaut, 10% pour les autres
          }" />
        
      <img v-for="(foam, index) in foamImages"
        :key="foam.id"
        :src="foam.src"
        alt="Mousse"
        class="foam"
        :style="{
          left: foam.x + 'px',
          top: foam.y + 'px',
          width: foam.size + '%',
          transform: `rotate(${foam.rotation}deg)`}" /> 
    </div>

    <!-- Dentifrice en bas à gauche -->
    <img 
      src="@/assets/Jeu5/dentifrice.png" 
      alt="Dentifrice" 
      class="dentifrice" 
      @click="applyToothpaste"
    />

    <!-- Brosse à dents fixe (transformée au toucher) -->
    <img 
      :src="toothbrushFixedImage" 
      alt="Brosse à dents fixe" 
      class="toothbrush-fixed" 
      v-if="!isBrushingActive"
      @touchstart="activateBrushing"
      @mousedown="activateBrushing"
    />
    <Bravo 
      v-if="gameWon" 
      :score="score" 
      :jeu="5"
      message="L'Assurance Maladie offre des rendez-vous de prévention avec le dentiste appelés « M'T dents » aux jeunes de âgés de 18, 21 et 24 ans !"
      @retry="handleRetry" 
      @quit="handleLeave" 
    />
    <Dommage 
      v-if="gameLost" 
      message="L'Assurance Maladie offre des rendez-vous de prévention avec le dentiste appelés « M'T dents » aux jeunes de âgés de 18, 21 et 24 ans !"
      @retry="handleRetry" 
      @quit="handleLeave" />
  </div>
</template>

<script>
import bouchePropre from '@/assets/Jeu5/bouche_propre.png';

import carieDroite from '@/assets/Jeu5/carie_droite.png';
import carieGauche from '@/assets/Jeu5/carie_gauche.png';
import carieHaut from '@/assets/Jeu5/carie_haut.png';


import microbe1 from '@/assets/Jeu5/microbe_1.png';
import microbe2 from '@/assets/Jeu5/microbe_2.png';
import microbe3 from '@/assets/Jeu5/microbe_3.png';
import microbe4 from '@/assets/Jeu5/microbe_4.png';
import microbe5 from '@/assets/Jeu5/microbe_5.png';
import microbe6 from '@/assets/Jeu5/microbe_6.png';
import microbe7 from '@/assets/Jeu5/microbe_7.png';
import microbe8 from '@/assets/Jeu5/microbe_8.png';

import mousse1 from '@/assets/Jeu5/mousse_1.png';
import mousse2 from '@/assets/Jeu5/mousse_2.png';
import mousse3 from '@/assets/Jeu5/mousse_3.png';
import mousse4 from '@/assets/Jeu5/mousse_4.png';
import mousse5 from '@/assets/Jeu5/mousse_5.png';
import mousse6 from '@/assets/Jeu5/mousse_6.png';

import dentsJaunes from '@/assets/Jeu5/dents_extraites.png';

import brossefixe from '@/assets/Jeu5/brosse_a_dent_fixe.png';
import brossefixedentifrice from '@/assets/Jeu5/brosse_a_dent_fixe_dentifrice.png';

import PagePause from '../PagePause.vue';

import Bravo from '@/components/Bravo.vue';
import Dommage from '@/components/Dommage.vue';
import MinuteurDent from '../temps/MinuteurDent.vue';

import brossageSound from '@/assets/Jeu5/brosseDentBruitage.mp3';
import amibanceJeu from '@/assets/Jeu5/sonAmbiance.mp3';

import { volumeStore } from '@/stores/volume';
import { useMusic } from '@/composable/volumes';
import { watch } from 'vue';
 
import applauseSound from '@/assets/Jeu5/applaudissementFin.mp3';

export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MinuteurDent,
    PagePause,
    Bravo,
    Dommage
  },
  data() {
    return {
      timeRemaining: 60,
      currentTime: 60,
      isGamePaused: false,
      hasCaries: true,
      brushPosition: { left: '50%', top: '50%' },
      isBrushing: false,
      isTouchingBrush: false,
      foamImages: [],
      microbes: [],
      caries: [],
      patterns: [
        [
          { type: "carie", src: carieGauche, xRatio: 0.09, yRatio: 0.53, hits: 25 },
          { type: "carie", src: carieGauche, xRatio: 0.85, yRatio: 0.54, hits: 25 },
          { type: "carie", src: carieDroite, xRatio: 0.59, yRatio: 0.75, hits: 25 },
          { type: "microbe", src: microbe1, xRatio: 0.8, yRatio: 0.6, hits: 80, initialSize: 14 }, 
          { type: "microbe", src: microbe1, xRatio: 0.35, yRatio: 0.18, hits: 60, initialSize: 8 }, 
          { type: "microbe", src: microbe2, xRatio: 0.1, yRatio: 0.3, hits: 60, initialSize: 12 },
          { type: "microbe", src: microbe3, xRatio: 0.7, yRatio: 0.2, hits: 70, initialSize: 20 },
          { type: "microbe", src: microbe5, xRatio: 0.20, yRatio: 0.75, hits: 70, initialSize: 16 }
        ],
        [
          { type: "carie", src: carieDroite, xRatio: 0.09, yRatio: 0.63, hits: 25 },
          { type: "carie", src: carieGauche, xRatio: 0.5, yRatio: 0.75, hits: 25 },
          { type: "carie", src: carieHaut, xRatio: 0.40, yRatio: 0.16, hits: 25 },
          { type: "microbe", src: microbe4, xRatio: 0.8, yRatio: 0.6, hits: 80, initialSize: 14 },
          { type: "microbe", src: microbe5, xRatio: 0.1, yRatio: 0.3, hits: 60, initialSize: 12 },
          { type: "microbe", src: microbe1, xRatio: 0.5, yRatio: 0.15, hits: 70, initialSize: 10 },
          { type: "microbe", src: microbe1, xRatio: 0.3, yRatio: 0.75, hits: 70, initialSize: 10 },
          { type: "microbe", src: microbe6, xRatio: 0.7, yRatio: 0.2, hits: 70, initialSize: 15 }
        ],
        [
          { type: "carie", src: carieDroite, xRatio: 0.06, yRatio: 0.4, hits: 25 },
          { type: "carie", src: carieDroite, xRatio: 0.3, yRatio: 0.17, hits: 25 },
          { type: "carie", src: carieHaut, xRatio: 0.2, yRatio: 0.73, hits: 25 },
          { type: "microbe", src: microbe7, xRatio: 0.3, yRatio: 0.75, hits: 80, initialSize: 10 },
          { type: "microbe", src: microbe8, xRatio: 0.05, yRatio: 0.55, hits: 60, initialSize: 12 },
          { type: "microbe", src: microbe1, xRatio: 0.7, yRatio: 0.7, hits: 70, initialSize: 14 },
          { type: "microbe", src: microbe7, xRatio: 0.84, yRatio: 0.54, hits: 70, initialSize: 10 },
          { type: "microbe", src: microbe7, xRatio: 0.7, yRatio: 0.2, hits: 70, initialSize: 20 }
        ],
        [
          { type: "carie", src: carieGauche, xRatio: 0.41, yRatio: 0.15, hits: 25 },
          { type: "carie", src: carieDroite, xRatio: 0.82, yRatio: 0.53, hits: 25 },
          { type: "carie", src: carieHaut, xRatio: 0.61, yRatio: 0.17, hits: 25 },
          { type: "microbe", src: microbe1, xRatio: 0.8, yRatio: 0.6, hits: 80, initialSize: 14 },
          { type: "microbe", src: microbe2, xRatio: 0.48, yRatio: 0.78, hits: 80, initialSize: 14 }, 
          { type: "microbe", src: microbe3, xRatio: 0.2, yRatio: 0.7, hits: 60, initialSize: 12 },
          { type: "microbe", src: microbe1, xRatio: 0.17, yRatio: 0.2, hits: 70, initialSize: 11 },
          { type: "microbe", src: microbe8, xRatio: 0.7, yRatio: 0.2, hits: 70, initialSize: 20 }
        ]
      ],
      foamSprites: [mousse1, mousse2, mousse3, mousse4, mousse5, mousse6],
      imgDents: dentsJaunes, 
      minSize: 10, 
      showMovingBrush: false, 
      hasToothpaste: false,
      toothbrushImage: brossefixe, 
      isBrushingActive: false, 
      toothbrushFixedImage: brossefixe, 
      gameWon: false,
      gameLost: false,
      checkCounter: 0,
      lastCheckResult: false,
      requiredCleaningRatio: 1,
      brushSound: null,
      score: 0,
      teethCleanedPercentage: 0,
      enemiesRemaining: 0,
      timerReady: false,
      applauseAudio: null,
      hasPlayedApplause: false,
    };
  },
  computed: {
    mouthImage() {
      return this.hasCaries ? bouchePropre : bouchePropre;
    },
    formattedTime() {
      const minutes = Math.floor(this.currentTime / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (this.currentTime % 60)
        .toString()
        .padStart(2, '0');  
      return `${minutes}'${seconds}`;
    }
  },
  methods: {
    startTimer() {
      this.isPaused = false;
      this.startTime = Date.now();
      if (!this.timerInterval) {
        this.runTimer();
      }
    },
    initGame() {
      // Initialiser le canvas
      const canvas = this.$refs.dentsCanvas;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width; 
        canvas.height = img.height; 
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        this.selectRandomPattern();
      };
      img.src = this.imgDents;

      // Initialiser le son (version corrigée)
      if (this.brushSound) {
        this.brushSound.pause();
        this.brushSound = null;
      }

      // Initialiser le son
      this.brushSound = new Audio(brossageSound);
      this.brushSound.loop = true;
      this.brushSound.volume = volumeStore().effet_sonore;

      // Précharger le son
      this.brushSound.load();

      this.hasToothpaste = false;
      this.toothbrushFixedImage = brossefixe;

      this.timerReady = false;
      this.currentTime = 60; // Réinitialiser le temps
      
      // Si vous avez accès au MinuteurDent, ajoutez cette ligne :
      if (this.$refs.minuteur && this.$refs.minuteur.resetTimer) {
        this.$refs.minuteur.resetTimer();
      }
    },
    resetTimer() {
      this.stopTimer();
      this.timeRemaining = this.duree;
      this.isPaused = true;
    },
    resetGame() {
      // Arrêter le timer
      if (this.$refs.minuteur) {
        this.$refs.minuteur.stopTimer();
      }
      
      // Réinitialiser l'état du jeu
      this.gameWon = false;
      this.gameLost = false;
      this.isGamePaused = false;
      this.foamImages = [];
      this.microbes = [];
      this.caries = [];
      
      // Arrêter les sons
      if (this.brushSound) {
        this.brushSound.pause();
        this.brushSound.currentTime = 0;
      }

      if (this.applauseAudio) {
        this.applauseAudio.pause();
        this.applauseAudio.currentTime = 0;
      }
      this.hasPlayedApplause = false;
    },
    handleLeave() {
      this.$router.push('/home');
    },
    handleTimeUpdate(newTime) {
      this.currentTime = newTime;
      this.timeRemaining = newTime; // Synchronisez avec votre variable existante
    },
    pauseGame() {
      this.isGamePaused = true;
      if (this.$refs.minuteur) {
        this.$refs.minuteur.pauseTimer();
      }
    },  
    unpauseGame() {
      this.isGamePaused = false;
      if (this.$refs.minuteur) {
        this.$refs.minuteur.resumeTimer();
      }
    },
    handleRetry() {
      this.gameWon = false;
      this.gameLost = false;
      // 1. Réinitialiser tous les états du jeu
      this.isGamePaused = false;
      this.hasToothpaste = false;
      this.toothbrushFixedImage = brossefixe;
      this.isBrushingActive = false;
      this.foamImages = [];
      this.microbes = [];
      this.caries = [];

      // 2. Réinitialiser le minuteur
      if (this.$refs.minuteur) {
        this.$refs.minuteur.resetTimer();
        this.$refs.minuteur.resumeTimer();
      }

      // 3. Réinitialiser le canvas des dents
      this.resetTeethCanvas();

      // 4. Recréer les éléments du jeu
      this.$nextTick(() => {
        this.selectRandomPattern();
      });
      if (this.$refs.minuteur) {
        this.$refs.minuteur.resetTimer(); // Réinitialise sans démarrer
      }
    },
    resetTeethCanvas() {
      const canvas = this.$refs.dentsCanvas;
      if (!canvas) return;

      // Réinitialiser les dimensions du canvas
      const img = new Image();
      img.src = this.imgDents;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = "source-over";
      };
    },
    applyToothpaste() {
      this.toothbrushFixedImage = brossefixedentifrice;
      this.hasToothpaste = true;
      this.timerReady = true; 

      if (this.$refs.minuteur) {
        this.$refs.minuteur.startTimer(); // Démarre le minuteur
      }
    },
    togglePause() {
      this.isGamePaused = !this.isGamePaused;
    },
    updateTime(newTime) {
      this.currentTime = newTime;
    },
    activateBrushing(event) {
      if (this.hasToothpaste) {
        const touch = event.touches ? event.touches[0] : event;
        const brushWidth = 80;
        const brushHeight = 80;

        const newLeft = touch.clientX - brushWidth / 2;
        const newTop = touch.clientY - brushHeight / 2;

        this.brushPosition = { left: `${newLeft-60}px`, top: `${newTop-160}px` };
        this.isBrushingActive = true; // Montre la brosse en mouvement
      }
    },
    startBrush() {
    if (!this.isGamePaused) {
      this.isBrushing = true;
      this.isTouchingBrush = true;
      
      // Version robuste avec vérification
      if (this.brushSound) {
        try {
          this.brushSound.pause();
          this.brushSound.currentTime = 0;
          const playPromise = this.brushSound.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              document.addEventListener('click', this.retryPlaySound, { once: true });
            });
          }
        } catch (e) {
          console.error("Erreur audio:", e);
        }
      }
    }
  },
    moveBrush(event) {
      if (this.isBrushing && !this.isGamePaused) {
        if (this.isBrushing) {
          const touch = event.touches ? event.touches[0] : event;
          const brushWidth = 50;
          const brushHeight = 50;
  
          const newLeft = touch.clientX - brushWidth / 2;
          const newTop = touch.clientY - brushHeight / 2;
  
          this.brushPosition = { left: `${newLeft-80}px`, top: `${newTop-200}px` };
  
          this.eraseDents(newLeft-30, newTop-50);
          this.checkCollisions(newLeft-100, newTop-200);
        }
      }
    },
    eraseDents(x, y) {
      const canvas = this.$refs.dentsCanvas;
      const ctx = canvas.getContext("2d");

      if (!canvas || !ctx) {
        return;
      }

      // Obtenir les dimensions réelles du canvas
      const rect = canvas.getBoundingClientRect();

      // Calculer les ratios entre la taille affichée et la taille réelle
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      // Ajuster les coordonnées en fonction du ratio
      const canvasX = (x - rect.left) * scaleX;
      const canvasY = (y - rect.top) * scaleY;

      // Vérifier si la brosse est sur le canvas
      if (canvasX >= 0 && canvasX <= canvas.width && canvasY >= 0 && canvasY <= canvas.height) {
        // Obtenir les données du pixel sous la brosse  
        const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        const pixelData = imageData.data; // Données RGBA du pixel

        // Si le pixel n'est pas transparent (alpha > 0), la brosse efface quelque chose
        if (pixelData[3] > 0) {
          // Effacer les dents jaunes avec un cercle
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, 80, 0, Math.PI * 2); // Rayon de 90 pixels
          ctx.fill();

          // Convertir les coordonnées du canvas en coordonnées de la page
          const foamX = (canvasX / scaleX) + rect.left;
          const foamY = (canvasY / scaleY) + rect.top;

          // Générer de la mousse directement sur la zone effacée
          this.generateSmallFoam(foamX-25, foamY-130);
        }
      }
      if (Math.random() < 0.1) { // 20% de chance de faire une vérification légère
        this.checkWinCondition();
      }
    },
    checkCollisions(brushX, brushY) {
      // Gérer les microbes
      this.microbes = this.microbes.map(microbe => {
        if (Math.abs(brushX - microbe.x) < 30 && Math.abs(brushY - microbe.y) < 30) {
          microbe.strength -= 1; // Réduire la force
          microbe.currentSize = Math.max(microbe.currentSize * 0.8, this.minSize); // Réduire la taille de 20%, mais pas en dessous de minSize
          this.generateFoam(microbe.x, microbe.y);
        }
        return microbe;
      }).filter(microbe => microbe.strength > 0); // Supprimer si strength <= 0

      // Gérer les caries
      this.caries = this.caries.map(carie => {
        if (Math.abs(brushX - carie.x) < 30 && Math.abs(brushY - carie.y) < 30) {
          carie.strength -= 1; // Réduire la force
          this.generateFoam(carie.x, carie.y);
        }
        return carie;
      }).filter(carie => carie.strength > 0); // Supprimer si strength <= 0
    },
    generateFoam(x, y) {
      const randomFoam = this.foamSprites[Math.floor(Math.random() * this.foamSprites.length)];

      const foam = {
        src: randomFoam,
        x: x + (Math.random() * 20 - 10), // Déplacement aléatoire en X
        y: y + (Math.random() * 20 - 10), // Déplacement aléatoire en Y
        id: Date.now(), // Identifiant unique
        size: 10 + (Math.random() * 5), // Taille aléatoire entre 10% et 15%
        rotation: Math.random() * 360, // Rotation aléatoire
      };

      this.foamImages.push(foam);

      // Supprimer la mousse après 1.5 secondes
      setTimeout(() => {
        this.foamImages = this.foamImages.filter(f => f.id !== foam.id);
      }, 500);
    },
    generateSmallFoam(x, y) {
      const randomFoam = this.foamSprites[Math.floor(Math.random() * this.foamSprites.length)];

      // Décalage pour positionner la mousse en haut à gauche de la zone effacée
      const offsetX = -20; // Décalage horizontal (vers la gauche)
      const offsetY = -30; // Décalage vertical (vers le haut)

      const foam = {
        src: randomFoam,
        x: x + offsetX + (Math.random() * 10 - 5), // Déplacement aléatoire en X (plus petit)
        y: y + offsetY + (Math.random() * 10 - 5), // Déplacement aléatoire en Y (plus petit)
        id: Date.now(), // Identifiant unique
        size: 10 + (Math.random() * 2), // Taille aléatoire entre 5% et 8% (plus petit)
        rotation: Math.random() * 360, // Rotation aléatoire
      };

      this.foamImages.push(foam);

      // Supprimer la mousse après 0.8 seconde (plus court)
      setTimeout(() => {
        this.foamImages = this.foamImages.filter(f => f.id !== foam.id);
      }, 800);
    },
    stopBrush() {
      this.isBrushing = false;
      this.isTouchingBrush = false;
      // Arrêter le son
      if (this.brushSound) {
        this.brushSound.pause();
      }
    },
    preventScroll(event) {
      if (this.isTouchingBrush) {
        event.preventDefault();
      }
    },
    selectRandomPattern() {
      const mouthContainer = this.$el.querySelector(".mouth-container");

      if (!mouthContainer) {
        return;
      }

      const mouthRect = mouthContainer.getBoundingClientRect();
      const mouthWidth = mouthContainer.clientWidth;
      const mouthHeight = mouthContainer.clientHeight;

      const randomIndex = Math.floor(Math.random() * this.patterns.length);
      const selectedPattern = this.patterns[randomIndex];

      // Réinitialiser les tableaux
      this.microbes = [];
      this.caries = [];

      selectedPattern.forEach((item) => {
        // Calcule les positions relatives à la bouche
        const x = item.xRatio * mouthWidth;
        const y = item.yRatio * mouthHeight;

        const position = {
          x: x,
          y: y,
          src: item.src,
          strength: item.hits || 5,
          currentSize: item.initialSize || 8,
        };
        if (item.type === "microbe") {
          this.microbes.push(position);
        } else if (item.type === "carie") {
          this.caries.push(position); 
        }
      });
    },
    checkWinCondition() {
      // 1. Vérification prioritaire des ennemis (toujours active)
      if (this.microbes.length > 0 || this.caries.length > 0) {
        // Calcul du score même si la partie n'est pas gagnée
        this.calculateScore();
        return false;
      }

      // 2. Vérification canvas aléatoire (10% de chance de s'activer)
      if (Math.random() > 0.1) {
        // Calcul du score même si la vérification n'est pas activée
        this.calculateScore();
        return false;
      }

      // 3. Vérification canvas précise (seulement dans 10% des cas)
      const canvas = this.$refs.dentsCanvas;
      const ctx = canvas.getContext("2d");
      
      // Paramètres optimisés
      const sampleSize = 100; // Nombre fixe de pixels à vérifier
      const requiredCleanPercent = 100; // Seuil de propreté (100%)
      let cleanCount = 0;

      // Vérification sur des positions aléatoires
      for (let i = 0; i < sampleSize; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        if (pixel[3] === 0) { // Si pixel transparent
          cleanCount++;
        }
      }

      // Calcul du pourcentage de propreté
      const cleanPercent = (cleanCount / sampleSize) * 100;

      if (cleanPercent >= requiredCleanPercent) {
        // Calcul du score final avant de déclarer la victoire
        this.calculateScore();
        this.gameWon = true;
        this.pauseGame();

        if (!this.hasPlayedApplause) {
          this.playApplauseSound();
          this.hasPlayedApplause = true;
        }

        return true;
      }

      // Calcul du score même si la condition de victoire n'est pas remplie
      this.calculateScore();
      return false;
    },
    // Nouvelle méthode pour calculer le score
    calculateScore() {
      // 1. Calcul des composants du score
      const enemiesRemaining = this.microbes.length + this.caries.length;
      const timeBonus = this.currentTime * 10; // 10 points par seconde restante
      const enemiesPenalty = enemiesRemaining * 50; // -50 points par ennemi restant
      
      // 2. Calcul du pourcentage de dents nettoyées
      const canvas = this.$refs.dentsCanvas;
      const ctx = canvas.getContext("2d");
      const sampleSize = 100;
      let cleanCount = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        if (pixel[3] === 0) cleanCount++;
      }
      
      const teethCleanedPercentage = (cleanCount / sampleSize) * 100;
      const cleanlinessBonus = teethCleanedPercentage * 5; // 5 points par % de propreté
      
      // 3. Calcul du score total 
      this.score = Math.max(0, timeBonus + cleanlinessBonus - enemiesPenalty);
      
      // Stockage des valeurs intermédiaires pour le débogage (optionnel)
      this.teethCleanedPercentage = teethCleanedPercentage;
      this.enemiesRemaining = enemiesRemaining;
    },
    playApplauseSound() {
      if (!this.applauseAudio) return;
      
      try {
        this.applauseAudio.currentTime = 0; // Remettre au début
        const playPromise = this.applauseAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Erreur lecture applaudissements:", error);
            // Fallback pour mobile
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
              document.addEventListener('click', this.playApplauseSound, { once: true });
              document.addEventListener('touchstart', this.playApplauseSound, { once: true });
            }
          });
        }
      } catch (e) {
        console.error("Erreur audio:", e);
      }
    },
  },
  mounted() {
    this.initGame();
    const canvas = this.$refs.dentsCanvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width; 
      canvas.height = img.height; 
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = "source-over"; // Mode par défaut

      this.$nextTick(() => {
        this.selectRandomPattern();
      });
    };
    img.src = this.imgDents;

    this.resetTeethCanvas();
    this.$nextTick(() => {
      this.selectRandomPattern();
    });

    this.brushSound = new Audio(brossageSound);
    this.brushSound.loop = true;

    const volumes = volumeStore();
    this.brushSound.volume = volumes.effet_sonore;

    watch(
      () => volumes.effet_sonore,
      (newVolume) => {
        if (this.brushSound) {
          this.brushSound.volume = newVolume;
        }
      }
    );

    const { switchAudio, pause, resume } = useMusic();
    switchAudio(amibanceJeu);

    this.applauseAudio = new Audio(applauseSound);
    this.applauseAudio.volume = volumes.effet_sonore;
    this.applauseAudio.load();
  },
  watch: {
    currentTime(newVal) {
      if (newVal <= 0 && !this.gameWon) {
        this.calculateScore();
        this.gameLost = true;
        this.pauseGame();
        // Version sécurisée qui ne génère pas d'erreur
        if (this.$refs.minuteur && typeof this.$refs.minuteur.stopTimer === 'function') {
          this.$refs.minuteur.stopTimer();
        }
      }
    },
    isActive(newVal) {
      if (newVal) {
        this.initGame();
      } else {
        this.resetGame();
      }
    },
    'volumes.effet_sonore'(newVolume) {
      if (this.applauseAudio) {
        this.applauseAudio.volume = newVolume;
      }
      if (this.brushSound) {
        this.brushSound.volume = newVolume;
      }
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.game-container {
  position: absolute;
  top: 84px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mouth-container {
  position: relative;
  width: 80%;
  height: auto;
}

.mouth {
  width: 100%;
  height: auto;
}

.toothbrush {
  position: absolute;
  width: 100px; /* Plus grand */
  height: auto;
  pointer-events: auto; /* Permet à la brosse d'être interactive */
  z-index: 2;
}

.toothbrush-fixed {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 120px; /* Plus grand */
  height: auto;
  cursor: pointer;
}

.dentifrice {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 100px; /* Plus grand */
  height: auto;
  cursor: pointer;
}

.toothbrush[style] { /* Montre la brosse en mouvement si elle a un style */
  display: block;
}

.carie {
  position: absolute;
  width: 10%;
  height: auto;
}

.hidden {
  display: none;
}

.microbe {
  position: absolute;
  width: 5%;
  height: auto;
}

.foam {
  position: absolute;
  width: 5%;
  height: auto;
}

.timer {
  position: absolute;
  top: 20px;
  font-size: 2rem;  
  color: #fff;
}

.dents-jaunes{
  display: none;
}

.dents-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* Le canvas prend toute la largeur du conteneur */
  height: 100%; /* Le canvas prend toute la hauteur du conteneur */
  pointer-events: none; /* Permet à la brosse à dents de passer à travers */
  margin-top: -2px;
}


@keyframes foamAppear {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes foamDisappear {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

.foam {
  position: absolute;
  height: auto;
  animation: foamAppear 0.2s ease-out, foamDisappear 0.2s ease-in 0.6s; /* Durée plus courte */
}

.game {
    text-align: center;
    font-size: 24px;
}

.pause-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
}

.pause-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
}

.pause-content {
  position: relative;
  z-index: 1002;
  color: white;
  text-align: center;
  width: 80%;
  max-width: 400px;
}

.timer {
  font-size: xx-large;
  margin: 20px 0;
}

.timer span {
  margin-right: 10px;
}

.button-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.menu-button {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button:hover {
  background: rgba(255,255,255,0.3);
}

hr {
  width: 100%;
  height: 2px;
  background-color: white;
  border: none;
  margin: 10px 0;
}

#panel {
  pointer-events: auto;
  z-index: 1001;
}

/* Adaptation des styles existants pour la pause */
.game-paused .mouth-container,
.game-paused .dentifrice,
.game-paused .toothbrush-fixed,
.game-paused .toothbrush {
  pointer-events: none;
  opacity: 0.7;
}

/* Ajoutez ce style à la fin de votre section style */
.bravo-overlay,
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
  z-index: 10000; /* Assurez-vous que c'est plus élevé que tout le reste */
}

.bravo-content,
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

.minuteur {
    position: relative;
    z-index: 100; /* Au-dessus du jeu (z-index inférieur à Dommage) */
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
