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

    import eau from '@/assets/fruit-ninja/images/eau.png';

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
    import carottePartieBas from '@/assets/fruit-ninja/images/Carotte_coupee_bas.png';

    export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
        this.score = 0;
    }

    preload() {

        // Chargement des sons
        this.load.audio("epee", epeeSound);
        this.load.audio("splash", splashSound);

       // Effets de coupe
       this.load.image("coupe-diagonale-droite", coupeDiagonaleDroite);
       this.load.image("coupe-diagonale-gauche", coupeDiagonaleGauche);
       this.load.image("coupe-horizontale", coupeHorizontale);
       this.load.image("coupe-verticale", coupeVerticale);
       
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
        this.load.image("eau", eau);
        
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

    create(){
        this.foods = this.physics.add.group();

        this.foodTypes = [
            "frite1",
            "frites",
            "hamburger",
            "pizza",
            "kebab",
            "soda1", "soda2",
            "eau",
            "pomme1", "pomme2",
            "banane",
            "brocoli",
            "carotte",
        ];

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

        this.time.addEvent({
            delay: 800,
            loop: true,
            callback: () => this.launchFood()
        });

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

    startCut(pointer) {
        this.isCutting = true;
        this.cutLine = this.add.line(0, 0, pointer.x, pointer.y, pointer.x, pointer.y, 0xffffff); // à modifier
        this.cutLine.setLineWidth(2);
        this.cutLine.setDepth(15);
        this.cutStartX = pointer.x;
        this.cutStartY = pointer.y;
        this.lastPointerPosition = { x: pointer.x, y: pointer.y };

        if (this.epeeSound) {
            this.epeeSound.play();
        }
    }

    updateCut(pointer) {
        if (this.isCutting) {
            // Mettre à jour la ligne de coupe
            this.cutLine.setTo(this.cutStartX, this.cutStartY, pointer.x, pointer.y);
            
            // Vérifier les collisions avec les aliments
            const dx = pointer.x - this.lastPointerPosition.x;
            const dy = pointer.y - this.lastPointerPosition.y;
            
            // Si le mouvement est assez significatif pour être une coupe
            if (Math.sqrt(dx*dx + dy*dy) > 10) {
                this.checkFoodCollisions(pointer);
                this.lastPointerPosition = { x: pointer.x, y: pointer.y };
            }
        }
    }

    endCut() {
        if (this.cutLine) {
            this.cutLine.destroy();
        }
        this.isCutting = false;
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
        // Déterminer le type de coupe en fonction de la direction
        const dx = pointer.x - this.lastPointerPosition.x;
        const dy = pointer.y - this.lastPointerPosition.y;
        let cutType = "coupe-horizontale";
        
        if (Math.abs(dx) > Math.abs(dy)) {
            cutType = "coupe-horizontale";
        } else if (dx > 0 && dy < 0 || dx < 0 && dy > 0) {
            cutType = "coupe-diagonale-gauche";
        } else {
            cutType = "coupe-diagonale-droite";
        }
        
        // Afficher l'effet de coupe
        const cutEffect = this.add.image(food.x, food.y, cutType);
        cutEffect.setScale(0.5);
        cutEffect.setDepth(5);
        cutEffect.setAlpha(0.8);

        if (this.splashSound) {
            this.splashSound.play();
        }
        
        // Faire disparaître l'effet de coupe après un moment
        this.tweens.add({
            targets: cutEffect,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                cutEffect.destroy();
            }
        });
        
        // Désactiver la nourriture coupée
        food.disableBody(true, true);
        
        // Augmenter le score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // Envoyer le nouveau score aux écouteurs
        this.events.emit('scoreUpdate', this.score);
    }

    launchFood() {

        const foodType = Phaser.Utils.Array.GetRandom(this.foodTypes);
        const x = Phaser.Math.Between(100, 700); // Position aléatoire en X
        const food = this.foods.create(x, 600, foodType); // Création à hauteur de 600px
        food.setScale(0.5); // Modifie la taille des images
        food.setDepth(1); // S'assurer que la nourriture est devant d'autres éléments

        food.setVelocityY(-500); // Propulsion vers le haut
        food.setGravityY(1000); // Applique une gravité
        food.setInteractive(); // Permet de cliquer/couper
    }

    update() {
        // Supprimer les aliments qui sont tombés hors de l'écran
        this.foods.getChildren().forEach(food => {
            if (food.y > this.sys.game.canvas.height + 100) {
                food.destroy();
            }
        });
    }

}