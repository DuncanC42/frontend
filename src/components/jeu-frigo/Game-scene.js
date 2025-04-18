import Phaser from "phaser";

import epeeSound from '@/assets/fruit-ninja/sons/Epée.mp3'
import splashSound from '@/assets/fruit-ninja/sons/Splash.mp3'

import coupeDiagonaleDroite from '@/assets/fruit-ninja/images/coupe_daigonale_droite.png';
import coupeDiagonaleGauche from '@/assets/fruit-ninja/images/coupe_diagonale_gauche.png';
import coupeHorizontale from '@/assets/fruit-ninja/images/coupe_horizontale.png';
import coupeVerticale from '@/assets/fruit-ninja/images/coupe_verticale.png';

import frite1 from '@/assets/fruit-ninja/images/frite_1.png';
import frite2 from '@/assets/fruit-ninja/images/frite_2.png';
import frite3 from '@/assets/fruit-ninja/images/frite_3.png';
import frite4 from '@/assets/fruit-ninja/images/frite_4.png';
import frite5 from '@/assets/fruit-ninja/images/frite_5.png';
import frite6 from '@/assets/fruit-ninja/images/frite_6.png';

import frites from '@/assets/fruit-ninja/images/frites.png';
import paquetFrites from '@/assets/fruit-ninja/images/paquet_de_frites.png';

import hamburger from '@/assets/fruit-ninja/images/hamburger.png';
import hambugerFromage from '@/assets/fruit-ninja/images/hamburger_fromage.png';
import hamburgerSalade from '@/assets/fruit-ninja/images/hamburger_salade.png';
import hamburgerTomate from '@/assets/fruit-ninja/images/hamburger_tomate_1.png';
import hambugerOignonDroite from '@/assets/fruit-ninja/images/hamburger_oignon_droite.png';
import hambugerOignonGauche from '@/assets/fruit-ninja/images/hamburger_oignon_gauche.png';
import hamburgerPartieHaut from '@/assets/fruit-ninja/images/hamburger_pain_dessus.png';
import hamburgerPartieBas from '@/assets/fruit-ninja/images/hamburger_pain_bas.png';
import hamburgerSteak from '@/assets/fruit-ninja/images/hamburger_steak_hache.png';

import kebab from '@/assets/fruit-ninja/images/KEBAB.png';
import kebabPartieHaut from '@/assets/fruit-ninja/images/kebab_partie_haut.png';
import kebabPartieBas from '@/assets/fruit-ninja/images/kebab_partie_bas.png';

import pizza from '@/assets/fruit-ninja/images/PIZZA.png';
import pizza1 from '@/assets/fruit-ninja/images/pizza_part_1.png';
import pizza2 from '@/assets/fruit-ninja/images/pizza_part_2.png';
import pizza3 from '@/assets/fruit-ninja/images/pizza_part_3.png';
import pizza4 from '@/assets/fruit-ninja/images/pizza_part_4.png';
import pizza5 from '@/assets/fruit-ninja/images/pizza_part_5.png';
import pizza6 from '@/assets/fruit-ninja/images/pizza_part_6.png';
import pizza7 from '@/assets/fruit-ninja/images/pizza_part_7.png';
import pizza8 from '@/assets/fruit-ninja/images/pizza_part_8.png';
import pizza9 from '@/assets/fruit-ninja/images/pizza_part_9.png';

import soda1 from '@/assets/fruit-ninja/images/soda_1.png';
import soda2 from '@/assets/fruit-ninja/images/soda_2.png';
import sodaCasse1 from '@/assets/fruit-ninja/images/soda_casse_1.png';
import sodaCasse2 from '@/assets/fruit-ninja/images/soda_casse_2.png';

import pomme1 from '@/assets/fruit-ninja/images/pomme_1.png';
import pomme2 from '@/assets/fruit-ninja/images/pomme_2.png';
import pomme1Droite from '@/assets/fruit-ninja/images/pomme_1_droite.png';
import pomme2Droite from '@/assets/fruit-ninja/images/pomme_2_droite.png';
import pomme1Gauche from '@/assets/fruit-ninja/images/pomme_1_gauche.png';
import pomme2Gauche from '@/assets/fruit-ninja/images/pomme_2_gauche.png';

import banane from '@/assets/fruit-ninja/images/BANANE.png';
import bananePartieBas from '@/assets/fruit-ninja/images/BANANE_.png';
import bananePartieHaut from '@/assets/fruit-ninja/images/BANANE_PARTIE_HAUT.png';

import brocoli from '@/assets/fruit-ninja/images/brocoli.png';
import brocoliPartieHaut from '@/assets/fruit-ninja/images/brocoli_coupe_haut.png';
import brocoliPartieBas from '@/assets/fruit-ninja/images/brocoli_coupe_bas.png';

import carotte from '@/assets/fruit-ninja/images/carotte.png';
import carottePartieHaut from '@/assets/fruit-ninja/images/Carotte_coupee_haut.png';
import carottePartieBas from '@/assets/fruit-ninja/images/carotte_coupee_bas.png';

export default class GameScene extends Phaser.Scene {
    constructor(config) {
        super({ key: "GameScene" });
        this.score = 0;
        this.trailPoints = [];
        this.trailGraphics = null;
        this.currentTime = Date.now();

        this.difficulty = 'normal';

        // Vérifier si la config contient la difficulté
        if (config && config.difficulty) {
            this.difficulty = config.difficulty;
        }

        // Utiliser this.difficulty pour le reste de la configuration
        if (this.difficulty === 'normal') {
            this.baseSpawnRate = 800;
            this.baseSpeedMultiplier = 1.0;
        } else if (this.difficulty === 'hard') {
            this.baseSpawnRate = 600;
            this.baseSpeedMultiplier = 1.2;
        }
        console.log("Difficulté choisie:", this.difficulty);
        this.gameTime = 60;
        this.currentDifficultyStage = 0; // 0: normal, 1: +25%, 2: +50%
        this.spawnTimers = []; // Pour stocker les références des timers
        if (this.difficulty === 'normal') {
            this.baseSpawnRate = 800; // Intervalle entre chaque apparition en ms
            this.baseSpeedMultiplier = 1.0; // Vitesse normale
        } else if (this.difficulty === 'hard') {
            this.baseSpawnRate = 600; // Plus rapide en mode difficile
            this.baseSpeedMultiplier = 1.2; // 20% plus rapide
        }

        this.speedMultiplier = this.baseSpeedMultiplier;
    }

    preload() {

        // Chargement des sons
        this.load.audio("epee", epeeSound);
        this.load.audio("splash", splashSound);

        // Frites
        this.load.image("frite1", frite1);
        this.load.image("frite2", frite2);
        this.load.image("frite3", frite3);
        this.load.image("frite4", frite4);
        this.load.image("frite5", frite5);
        this.load.image("frite6", frite6);
        this.load.image("frites", frites);
        this.load.image("paquet-frites", paquetFrites);

        // Hamburger
        this.load.image("hamburger", hamburger);
        this.load.image("hamburger-fromage", hambugerFromage);
        this.load.image("hamburger-salade", hamburgerSalade);
        this.load.image("hamburger-tomate", hamburgerTomate);
        this.load.image("hamburger-oignon-droite", hambugerOignonDroite);
        this.load.image("hamburger-oignon-gauche", hambugerOignonGauche);
        this.load.image("hamburger-pain-dessus", hamburgerPartieHaut);
        this.load.image("hamburger-pain-bas", hamburgerPartieBas);
        this.load.image("hamburger-steak", hamburgerSteak);

        // Kebab
        this.load.image("kebab", kebab);
        this.load.image("kebab-partie-haut", kebabPartieHaut);
        this.load.image("kebab-partie-bas", kebabPartieBas);

        // Pizza
        this.load.image("pizza", pizza);
        this.load.image("pizza1", pizza1);
        this.load.image("pizza2", pizza2);
        this.load.image("pizza3", pizza3);
        this.load.image("pizza4", pizza4);
        this.load.image("pizza5", pizza5);
        this.load.image("pizza6", pizza6);
        this.load.image("pizza7", pizza7);
        this.load.image("pizza8", pizza8);
        this.load.image("pizza9", pizza9);

        // Boissons
        this.load.image("soda1", soda1);
        this.load.image("soda2", soda2);
        this.load.image("soda-casse-1", sodaCasse1);
        this.load.image("soda-casse-2", sodaCasse2);

        // Fruits
        this.load.image("pomme1", pomme1);
        this.load.image("pomme2", pomme2);
        this.load.image("pomme1-droite", pomme1Droite);
        this.load.image("pomme2-droite", pomme2Droite);
        this.load.image("pomme1-gauche", pomme1Gauche);
        this.load.image("pomme2-gauche", pomme2Gauche);

        // Banane
        this.load.image("banane", banane);
        this.load.image("banane-partie-bas", bananePartieBas);
        this.load.image("banane-partie-haut", bananePartieHaut);

        // Légumes
        this.load.image("brocoli", brocoli);
        this.load.image("brocoli-partie-haut", brocoliPartieHaut);
        this.load.image("brocoli-partie-bas", brocoliPartieBas);

        this.load.image("carotte", carotte);
        this.load.image("carotte-partie-haut", carottePartieHaut);
        this.load.image("carotte-partie-bas", carottePartieBas);
    }

    create() {
        this.foods = this.physics.add.group();

        this.foodTypes = [
            "frites",
            "hamburger",
            "pizza",
            "kebab",
            "soda1", "soda2",
            "pomme1", "pomme2",
            "banane",
            "brocoli",
            "carotte",
        ];

        this.setupSpawnTimer(1.0);

        this.events.on('timeUpdate', this.updateGameDifficulty, this);

        this.input.on('pointerdown', (pointer) => {
            this.startCut(pointer);
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.updateCut(pointer);
            }
        });

        this.input.on('pointerup', () => {
            this.endCut();
        });

        this.trailGraphics = this.add.graphics();

        // Émettre le score initial
        this.events.emit('scoreUpdate', this.score);

        // Afficher le score
        this.scoreText = this.add.text(10, 18, 'Score: 0', {
            fontFamily: 'Segoe UI',
            fontSize: '28px',
            fill: '#000000',
        });
        this.scoreText.setDepth(20);

        this.epeeSound = this.sound.add("epee");
        this.splashSound = this.sound.add("splash");

        this.epeeSound.volume = 0.7;
        this.splashSound.volume = 0.5;
    }

    // Méthode pour configurer le timer d'apparition
    setupSpawnTimer(difficultyMultiplier = 1.0) {
        // Annuler les timers existants si présents
        this.spawnTimers.forEach(timer => {
            if (timer) timer.remove();
        });
        this.spawnTimers = [];
        
        // Calculer le taux d'apparition basé sur la difficulté de base et le multiplicateur actuel
        const currentSpawnRate = this.baseSpawnRate / difficultyMultiplier;
                
        // Créer le nouveau timer
        const timer = this.time.addEvent({
            delay: currentSpawnRate,
            loop: true,
            callback: this.launchFood,
            callbackScope: this, // Important: conserver le contexte 'this'
            args: [this.speedMultiplier] // Passer le multiplicateur actuel
        });
        
        this.spawnTimers.push(timer);
    }

    // Méthode pour mettre à jour la difficulté en fonction du temps
    updateGameDifficulty(timeString) {
        // Convertir le format "MM'SS" en secondes
        let seconds = 0;

        if (typeof timeString === 'string') {
            // C'est une chaîne, on peut utiliser includes()
            if (timeString.includes("'")) {
                const [minutes, secondsStr] = timeString.split("'");
                seconds = parseInt(minutes) * 60 + parseInt(secondsStr);
            } else if (timeString.includes(":")) {
                const [minutes, secondsStr] = timeString.split(":");
                seconds = parseInt(minutes) * 60 + parseInt(secondsStr);
            } else {
                // Essayer de convertir directement la chaîne en nombre
                seconds = parseInt(timeString);
                if (isNaN(seconds)) {
                    console.warn("Format de temps non reconnu:", timeString);
                    return; // Sortir de la fonction si la conversion échoue
                }
            }
        } else if (typeof timeString === 'number') {
            // C'est déjà un nombre
            seconds = timeString;
        } else {
            // Type non pris en charge
            console.warn("Type de temps non pris en charge:", typeof timeString, timeString);
            return; // Sortir de la fonction
        }
        
        // Stocker le temps actuel
        this.gameTime = seconds;


        if (this.difficulty === 'normal') {
            // Paliers pour le mode normal
            if (seconds <= 15 && this.currentDifficultyStage < 2) {
                this.currentDifficultyStage = 2;
                this.speedMultiplier = this.baseSpeedMultiplier * 1.5;
                this.setupSpawnTimer(1.5);
            } else if (seconds <= 30 && seconds > 15 && this.currentDifficultyStage < 1) {
                this.currentDifficultyStage = 1;
                this.speedMultiplier = this.baseSpeedMultiplier * 1.25;
                this.setupSpawnTimer(1.25);
            }
        } else if (this.difficulty === 'hard') {
            // Paliers pour le mode difficile (plus précoces)
            if (seconds <= 20 && this.currentDifficultyStage < 2) {
                this.currentDifficultyStage = 2;
                this.speedMultiplier = this.baseSpeedMultiplier * 1.5;
                this.setupSpawnTimer(1.5);
            } else if (seconds <= 40 && seconds > 20 && this.currentDifficultyStage < 1) {
                this.currentDifficultyStage = 1;
                this.speedMultiplier = this.baseSpeedMultiplier * 1.25;
                this.setupSpawnTimer(1.25);
            }
        }
    }

    startCut(pointer) {
        this.isCutting = true;

        this.trailPoints = [{
            x: pointer.x,
            y: pointer.y,
            time: Date.now() // Ajouter un timestamp pour l'effet de fondu
        }];

        this.cutStartX = pointer.x;
        this.cutStartY = pointer.y;
        this.lastPointerPosition = { x: pointer.x, y: pointer.y };

        if (this.epeeSound) {
            this.epeeSound.play();
        }
    }

    updateCut(pointer) {
        if (this.isCutting) {

            this.trailPoints.push({
                x: pointer.x,
                y: pointer.y,
                time: Date.now()
            });

            if (this.trailPoints.length > 15) {
                this.trailPoints.shift();
            }

            this.drawTrail();

            // Vérifier les collisions avec les aliments
            const dx = pointer.x - this.lastPointerPosition.x;
            const dy = pointer.y - this.lastPointerPosition.y;

            // Si le mouvement est assez significatif pour être une coupe
            if (Math.sqrt(dx * dx + dy * dy) > 10) {
                this.checkFoodCollisions(pointer);
                this.lastPointerPosition = { x: pointer.x, y: pointer.y };
            }
        }
    }

    drawTrail() {
        this.trailGraphics.clear();

        if (this.trailPoints.length < 2) return;

        const currentPoints = this.trailPoints.filter(point => {
            return this.currentTime - point.time < 300;
        });

        if (currentPoints.length < 2) return;

        const tipPoint = currentPoints[currentPoints.length - 1];
        const prevPoint = currentPoints[currentPoints.length - 2];

        // Calcule pour l'angle de la pointe
        const angle = Math.atan2(tipPoint.y - prevPoint.y, tipPoint.x - prevPoint.x);

        const tipLength = 25;
        const tipWidth = 12;

        const tipX = tipPoint.x + Math.cos(angle) * (tipLength * 0.7);
        const tipY = tipPoint.y + Math.sin(angle) * (tipLength * 0.7);
        
        const leftX = tipPoint.x - Math.cos(angle - Math.PI/2) * tipWidth/2;
        const leftY = tipPoint.y - Math.sin(angle - Math.PI/2) * tipWidth/2;
        
        const rightX = tipPoint.x - Math.cos(angle + Math.PI/2) * tipWidth/2;
        const rightY = tipPoint.y - Math.sin(angle + Math.PI/2) * tipWidth/2;

        // Dessin de l'ombre exterieure
        this.trailGraphics.lineStyle(18, 0x333333, 0.3);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(currentPoints[0].x, currentPoints[0].y);

        for (let i = 1; i < currentPoints.length; i++) {
            this.trailGraphics.lineTo(currentPoints[0].x, currentPoints[0].y);
        }

        this.trailGraphics.strokePath();

        // Contour principale plus petit
        this.trailGraphics.lineStyle(14, 0x666666, 0.5);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(currentPoints[0].x, currentPoints[0].y);
    
        for (let i = 1; i < currentPoints.length; i++) {
            this.trailGraphics.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
    
        this.trailGraphics.strokePath();

        // Dessin de la lame grise métallique
        this.trailGraphics.lineStyle(10, 0xCCCCCC, 0.7);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(currentPoints[0].x, currentPoints[0].y);
        
        for (let i = 1; i < currentPoints.length; i++) {
            this.trailGraphics.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        
        this.trailGraphics.strokePath();

        // Eclat centrail effet métallique
        this.trailGraphics.lineStyle(4, 0xFFFFFF, 0.9);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(currentPoints[0].x, currentPoints[0].y);
        
        for (let i = 1; i < currentPoints.length; i++) {
            this.trailGraphics.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        
        this.trailGraphics.strokePath();

        // Ajouter la pointe triangulaire de la lame
        // Ombre de la pointe
        this.trailGraphics.fillStyle(0x333333, 0.5);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(tipX + Math.cos(angle) * 2, tipY + Math.sin(angle) * 2);
        this.trailGraphics.lineTo(leftX, leftY);
        this.trailGraphics.lineTo(rightX, rightY);
        this.trailGraphics.closePath();
        this.trailGraphics.fillPath();
        
        // Corps métallique de la pointe
        this.trailGraphics.fillStyle(0xB0B0B0, 0.8);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(tipX, tipY);
        this.trailGraphics.lineTo(leftX, leftY);
        this.trailGraphics.lineTo(rightX, rightY);
        this.trailGraphics.closePath();
        this.trailGraphics.fillPath();
        
        // Reflet sur la pointe
        this.trailGraphics.fillStyle(0xFFFFFF, 0.7);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(tipX - Math.cos(angle) * 5, tipY - Math.sin(angle) * 5);
        
        // Point du milieu du reflet (légèrement décalé)
        const mx = tipX - Math.cos(angle) * tipLength * 0.3 + Math.cos(angle + Math.PI/2) * tipWidth * 0.15;
        const my = tipY - Math.sin(angle) * tipLength * 0.3 + Math.sin(angle + Math.PI/2) * tipWidth * 0.15;
        
        this.trailGraphics.lineTo(mx, my);
        this.trailGraphics.lineTo(tipX - Math.cos(angle) * tipLength * 0.6, tipY - Math.sin(angle) * tipLength * 0.6);
        this.trailGraphics.closePath();
        this.trailGraphics.fillPath();

        // Etincelles 
        const latestPoints = currentPoints.slice(-5); // Prendre les 5 derniers points
    
        latestPoints.forEach((point, index) => {
            // Plus d'étincelles à la pointe de la lame
            const sparkCount = index === latestPoints.length - 1 ? 6 : 2;
            
            for (let i = 0; i < sparkCount; i++) {
                // Distance variable selon la position dans la traînée
                const distance = index === latestPoints.length - 1 ? 15 : 8;
                
                const sparkX = point.x + Phaser.Math.Between(-distance, distance);
                const sparkY = point.y + Phaser.Math.Between(-distance, distance);
                
                // Taille variable des étincelles
                const sparkSize = Phaser.Math.FloatBetween(1, index === latestPoints.length - 1 ? 3 : 2);
                
                // Couleur des étincelles: blanc à jaune clair
                const sparkColor = Phaser.Math.Between(0, 1) ? 0xFFFFFF : 0xFFFF99;
                
                // Opacité variable
                const sparkAlpha = Phaser.Math.FloatBetween(0.3, 0.8);
                
                this.trailGraphics.fillStyle(sparkColor, sparkAlpha);
                this.trailGraphics.fillCircle(sparkX, sparkY, sparkSize);
            }

            // Ajouter des étincelles supplémentaires autour de la pointe
            if (index === latestPoints.length - 1) {
                for (let i = 0; i < 5; i++) {
                    const sparkX = tipX + Phaser.Math.Between(-8, 8);
                    const sparkY = tipY + Phaser.Math.Between(-8, 8);
                    const sparkSize = Phaser.Math.FloatBetween(1.5, 3);
                    const sparkColor = Phaser.Math.Between(0, 1) ? 0xFFFFFF : 0xFFFF99;
                    
                    this.trailGraphics.fillStyle(sparkColor, 0.9);
                    this.trailGraphics.fillCircle(sparkX, sparkY, sparkSize);
                }
            }
        });

        // Effet de la trainée / poussière
        if (latestPoints.length > 0) {
            const lastPoint = latestPoints[latestPoints.length - 1];
            
            for (let i = 0; i < 3; i++) {
                const dustX = lastPoint.x + Phaser.Math.Between(-20, 20);
                const dustY = lastPoint.y + Phaser.Math.Between(-20, 20);
                const dustSize = Phaser.Math.FloatBetween(2, 5);
                
                this.trailGraphics.fillStyle(0xCCCCCC, Phaser.Math.FloatBetween(0.1, 0.3));
                this.trailGraphics.fillCircle(dustX, dustY, dustSize);
            }
        }
        
        this.trailGraphics.setDepth(20);
    }

    endCut() {
        this.isCutting = false;

        if (this.trailPoints.length > 0) {
            this.tweens.add({
                targets: this.trailGraphics,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.trailGraphics.clear();
                    this.trailGraphics.alpha = 1;
                    this.trailPoints = [];
                }
            });
        }
    }

    checkFoodCollisions(pointer) {
        const line = new Phaser.Geom.Line(
            this.lastPointerPosition.x,
            this.lastPointerPosition.y,
            pointer.x, pointer.y
        );

        this.foods.getChildren().forEach(food => {
            const foodBounds = food.getBounds();

            if (Phaser.Geom.Intersects.LineToRectangle(line, foodBounds) && food.active) {
                this.cutFood(food, pointer);
            }
        });
    }

    cutFood(food, pointer) {
        //Déterminer le type de coupe en fonction de la direction
        const dx = pointer.x - this.lastPointerPosition.x;
        const dy = pointer.y - this.lastPointerPosition.y;

        const angle = Math.atan2(dy, dx);
        const foodType = food.texture.key;

        if (this.splashSound) {
            this.splashSound.play({
                volume: Phaser.Math.FloatBetween(0.4, 0.6),
                rate: Phaser.Math.FloatBetween(0.9, 1.1)
            });
        }

        // Créer un effet de particules pour le jus/explosion
        const particles = this.add.particles(food.x, food.y, {
            speed: { min: 50, max: 150 },
            scale: { start: 0.2, end: 0 },
            lifespan: 600,
            blendMode: 'ADD',
            tint: [0xFFFFFF, 0xFFFFAA, 0xFFDDAA]
        });

        // Émission brève
        particles.explode(15);

        this.createFoodPieces(food, foodType, angle);

        food.disableBody(true, true);

        // Gestion du score
        const badFoodTypes = ["hamburger", "kebab", "soda1", "soda2", "frites", "pizza"];
        const goodFoodTypes = ["pomme1", "pomme2", "banane", "brocoli", "carotte"];
        let isPositifCut = false;
        let scoreChange = 0;

        if (badFoodTypes.includes(foodType)) {
            scoreChange = +10;
            isPositifCut = true;
            this.score += scoreChange;
        } else if (goodFoodTypes.includes(foodType)) {
            scoreChange = -10
            isPositifCut = false;
            this.score += scoreChange;
        }

        this.scoreText.setText('Score: ' + this.score);

        // Afficher un +10 flottant (test)

        const scoreFlottant = isPositifCut ? '+10' : '-10';
        const scorePopup = this.add.text(food.x, food.y - 30, scoreFlottant, {
            fontFamily: 'Segoe UI',
            fontSize: '24px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });
        scorePopup.setDepth(15);

        // Animation du score
        this.tweens.add({
            targets: scorePopup,
            y: scorePopup.y - 50,
            alpha: 0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => {
                scorePopup.destroy();
            }
        });

        // Envoyer le nouveau score aux écouteurs
        this.events.emit('scoreUpdate', this.score);
    }

    createFoodPieces(food, foodType, angle) {
        const pieces = this.getFoodPieces(foodType);

        if (!pieces) return;

        const velocityX = Math.cos(angle) * 200;
        const velocityY = Math.sin(angle) * 200;

        pieces.forEach((pieceKey, index) => {
            if (!pieceKey) return;

            // Créer la pièce
            const piece = this.physics.add.image(food.x, food.y, pieceKey);
            piece.setScale(food.scale);
            piece.setDepth(food.depth);

            // Direction de la pièce: gauche ou droite
            const directionX = index === 0 ? -velocityX : velocityX;
            const directionY = -100 + velocityY * 0.5; // Toujours un peu vers le haut avec un peu d'influence de l'angle

            // Appliquer la vitesse et la gravité
            piece.setVelocity(directionX, directionY);
            piece.setGravityY(600);

            // Ajouter une rotation basée sur la direction
            piece.setAngularVelocity((index === 0 ? -1 : 1) * Phaser.Math.Between(90, 180));

            // Faire disparaître la pièce après un délai
            this.time.delayedCall(2000, () => {
                this.tweens.add({
                    targets: piece,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => piece.destroy()
                });
            });
        });
    }

    getFoodPieces(foodType) {
        // Définir les correspondances entre les aliments et leurs pièces
        const piecesMap = {
            'hamburger': ['hamburger-pain-dessus', 'hamburger-pain-bas', 'hamburger-steak', 'hamburger-fromage', 'hamburger-salade', 'hamburger-tomate', 'hamburger-oignon-droite', 'hamburger-oignon-gauche'],
            'kebab': ['kebab-partie-haut', 'kebab-partie-bas'],
            'banane': ['banane-partie-haut', 'banane-partie-bas'],
            'brocoli': ['brocoli-partie-haut', 'brocoli-partie-bas'],
            'carotte': ['carotte-partie-haut', 'carotte-partie-bas'],
            'pomme1': ['pomme1-gauche', 'pomme1-droite'],
            'pomme2': ['pomme2-gauche', 'pomme2-droite'],
            'soda1': ['soda-casse-1'],
            'soda2': ['soda-casse-2'],
            'pizza': ['pizza1', 'pizza2'],
            'frites': ['frite1', 'frite2'],
        };

        return piecesMap[foodType];
    }

    getParticleColor(foodType) {
        // Définir les correspondances entre les aliments et les couleurs de leurs particules
        const colorMap = {
            'hamburger': [0xC4A484, 0x8B4513], // Marron
            'kebab': [0xC4A484, 0xFF6347],     // Marron et rouge
            'banane': [0xFFFF00, 0xFFD700],     // Jaune
            'brocoli': [0x00FF00, 0x006400],    // Vert
            'carotte': [0xFFA500, 0xFF4500],    // Orange
            'pomme1': [0xFF0000, 0x8B0000],     // Rouge
            'pomme2': [0x00FF00, 0x006400],     // Vert
            'soda1': [0x8B4513, 0x654321],      // Marron
            'soda2': [0x8B4513, 0x654321],      // Marron
            'pizza': [0xFF6347, 0xFFD700],      // Rouge-orange et jaune
            'frite1': [0xFFD700, 0xF4A460],     // Jaune doré
            'frites': [0xFFD700, 0xF4A460],     // Jaune doré
        };

        return colorMap[foodType] || [0xFFFFFF, 0xFFFFAA];
    }

    launchFood(speedMultiplier) {

        const actualMultiplier = speedMultiplier || this.speedMultiplier;

        const largeurFenetre = this.sys.game.canvas.width;
        const hauteurFenetre = this.sys.game.canvas.height;

        const foodType = Phaser.Utils.Array.GetRandom(this.foodTypes);

        const marge = 50;
        const x = Phaser.Math.Between(marge, largeurFenetre - marge); // Position aléatoire en X dans le cadre de la fenetre
        const y = hauteurFenetre + marge; // Position aléatoire en Y

        const food = this.foods.create(x, y, foodType);

        food.setScale(0.5); // Modifie la taille des images
        food.setDepth(1); // S'assurer que la nourriture est devant d'autres éléments

        const heightFactor = Phaser.Math.FloatBetween(0.8, 1.6) * actualMultiplier;

        const baseVelocity = -Math.max(700, hauteurFenetre * 1.2);
        const velocityY = baseVelocity * heightFactor;
        
        const maxAngle = 15 + (heightFactor - 1) * 5;
        const angle = Phaser.Math.Between(-maxAngle, maxAngle);

        const velocityX = Math.tan(Phaser.Math.DegToRad(angle)) * Math.abs(velocityY) * 
                     (heightFactor > 1.3 ? 0.15 : 0.2); // Réduire l'influence horizontale pour les grandes hauteurs

        food.setVelocityY(velocityY);
        food.setVelocityX(velocityX);

        const gravityFactor = heightFactor * Phaser.Math.FloatBetween(0.95, 1.05);
        const gravity = Math.max(1000, hauteurFenetre * 1.4) * gravityFactor;
        food.setGravityY(gravity);

        const rotationSpeed = Phaser.Math.Between(-120, 120) / Math.max(1, heightFactor * 0.8);
        food.setAngularVelocity(rotationSpeed);

        food.setInteractive(); // Permet de cliquer/couper

        food.setCollideWorldBounds(false);
        food.body.setCircle(food.width / 3, food.width / 3, food.height / 3);
    }

    update() {
        // Supprime les aliments qui sont tombés hors de l'écran
        this.foods.getChildren().forEach(food => {
            if (food.y > this.sys.game.canvas.height + 100) {
                food.destroy();
            }
        });

        // Mettre à jour la traînée si elle est active
        if (this.isCutting && this.trailPoints.length > 0) {
            // Supprimer les points trop anciens (plus de 300ms)
            this.trailPoints = this.trailPoints.filter(point => {
                return (this.currentTime - point.time) < 300;
            });

            // Redessiner la traînée si des points sont encore présents
            if (this.trailPoints.length > 0) {
                this.drawTrail();
            }
        }
    }
}