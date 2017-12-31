import 'pixi';
import 'p2';
import 'phaser';

/**
* HAUPTKLASSE
* Erzeugt Model, View und Controller
* Implementiert preload(), create() und update()-Methode für Phaser.Game
*/
export default class Main {

    /**
    * Constructor
    * @param game : Phaser.Game-Objekt
    * @param canvasWidth : Canvas-Breite
    * @param canvasHeight : Canvas-Höhe
    */
    constructor(game, canvasWidth, canvasHeight) {

        /**
        * Phaser.Game Objekt
        * Wird benötigt um auf jegliche Funktionen des Frameworks zuzugreifen.
        */
        this.game = game;

        /**
        * Canvas Höhe und Breite
        */
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        /**
        * Klassenimporte
        */
        let Schlange = require('./schlange.js').default; // klassen import
        this.schlange = new Schlange();

        let View = require('./view.js').default; // klassen import
        this.view = new View(this.game, this.schlange);

        let Controller = require('./controller.js').default; // klassen import
        this.controller = new Controller(this.game, this.view, this.canvasWidth, this.canvasHeight);

        /**
        * Zur Steuerung der Geschwindigkeit in der Game-Loop
        */
        this.frameCounter = 0;
        this.spielgeschwindigkeit = 20;

		/**
        * Steuerung der Spawnlogik von Schlangen-Körperteilen
        */
        this.snekSpawn = 0;

        /**
        * Spielstand
        */
        this.score = 0;

		/**
        * Typ der aktuellen Kollision
        */
        this.kollisionstyp = 'frei';

        /**
        * Spielstatus
        */
        this.gameStatus = 'start';

		/** VERWORFEN

		this.paused = true;
		this.dead = false;


        var gameover_picture;

        var called = false;

        var resetted = false;
        */

    }

    /**
    * PHASER-Methode SPRITES/DATEIEN LADEN
    * Canvas-Einstellungen und Bild-/Audio-Dateien
    */
    preload() {

        /** Boden-Sprite laden */
        this.game.load.image('boden', '../images/boden.png');

        /** Objekt-Sprites laden */
        this.game.load.spritesheet('spieler', '../images/spieler.png', 60, 60, 12);
        this.game.load.spritesheet('verfolger', '../images/verfolger.png', 60, 60, 12);
        this.game.load.spritesheet('feind', '../images/feind.png', 60, 60, 12);
        this.game.load.image('stein', '../images/stein.jpg');
		this.game.load.image('item', '../images/item.jpg');

        /** GAMEOVER-Sprite laden */
        this.game.load.image('go_screen', '../images/go_screen.jpg');
        // usw...
    }

    /**
    * PHASER-Methode OBJEKTE ERZEUGEN
    * Hier werden die benötigten Objekte und die Steuerung erzeugt.
    */
    create() {

        /** Canvas-Hintergrund setzen */
        this.game.add.tileSprite(0, 0, 900, 660, 'boden');
        this.controller.resetKeyboardKeys();

        /** GAME START */
        this.controller.zeichneObjekte();
        //this.gameStatus = 'start';
    }

    /**
    * PHASER-Methode GAMELOOP
    * Hier wird die Spiele-Logik durchlaufen!!!
    */
    update() {

        if(this.gameStatus == 'start') {

            this.controller.started(); // startscreen

            /** Alle Objekte die zu Start benötigt werden zeichnen (Schlange, Pickup, Gegner) */

            if(this.controller.getEnterKey().isDown) { // Enter-Taste für Spiel-Start drücken
                this.view.removeText();
                this.gameStatus = 'play';
            }

        } // ENDE START

        else if(this.gameStatus == 'play') {

            this.controller.updateLaufrichtung(); // Laufrichtung aktualisieren

            this.frameCounter++;

            /**
            * Diese if-Abfrage regelt die Geschwindigkeit des Spiels, da die
            * update()-Methode aus Phaser ein sehr schneller und unendlicher Loop ist.
            *
            * Diese update()-Loop läuft also durch unendlich viele "Frames" und durch frameCounter und spielgeschwindigkeit wird es
            * nun so eingestellt das alle 20 Frames 1 Aktion ausgeführt wird und der Loop dann wieder von vorne beginnt.
            */
            if (this.frameCounter == this.spielgeschwindigkeit) {

                // HIER WIRD DIE SCHLANGE MIT DEM CURSOR BEWEGT
                this.controller.bewegeSchlange();

                // OBJEKTE WERDEN AUTOMATISCH IM CONTROLLER INITIALISIERT UND GESPAWNT!

                // HIER WERDEN KOLLISIONEN ABGEFRAGT
                this.kollisionstyp = this.controller.kollision();

                if(this.kollisionstyp != 'frei') {

                    switch(this.kollisionstyp) {

                        case 'feind':   /** Kollision mit Gegner oder Körperteil */
                                        console.log('GAMEOVER!');
                                        this.gameStatus = 'dead'; // Spielstatus wechseln

                                        break;

                        case 'boon':    /** Kollision mit Upgrade-Item? */
                                        /** TODO: Apply Boon;*/
                                        console.log('BOON');
                                        break;

                        case 'pickup':  /** Kollision mit Pickup */
                                        this.controller.respawnAll();
                                        this.controller.verkuerzeSchlange();
                                        this.score + 10;
                                        this.spielgeschwindigkeit -= 2; 
                                        if (this.spielgeschwindigkeit <= 5) { 
                                            this.spielgeschwindigkeit = 5;
                                        }
                                        break;

                    }
                }

                ////////////////// VERWORFEN: //////////////////
                /*if (this.controller.kollisionMitVerfolger || this.controller.kollisionMitFeind || this.controller.kollisionMitWand) {
                    // Game over...-Meldung
                    //this.view.drawGameOverText();


                    // schlange löschen
                    this.controller.loescheSchlange();

                    //Spiel pausieren
                    this.paused = true;

                    // zeichne gameover screen nach 0.05 Sekunden
                    //this.game.time.events.add(Phaser.Timer.SECOND * 0.05, this.controller.zeichneGOScreen, this);
                    this.controller.zeichneGOScreen();

                    // Reset game nach 0.05 Sekunden
                    this.game.time.events.add(Phaser.Timer.SECOND * 1, this.resetGame, this);


                    //this.game.time.events.add(Phaser.Timer.SECOND * 3, this.setUnPaused, this);

                    this.controller.kollisionMitVerfolger = false;
                    this.controller.kollisionMitFeind = false;
                    this.controller.kollisionMitWand = false;

                }*/

                // HIER WERDEN DIE EINZELENEN KOMPONENTEN NEU GEZEICHNET
                this.controller.zeichneObjekte(); // alle objekte neuzeichnen

                // Schlange vergrößern
                this.snekSpawn++;
    			this.snekSpawn %= 10;
    			if(this.snekSpawn == 0){
                    this.controller.vergroessereSchlange();
    			}

                this.frameCounter = 0;

            } // ENDE BEWEGUNGS-LOOP

            // Wenn space gedrückt wird pausieren
            if(this.controller.getSpaceBar().isDown) {
                this.gameStatus = 'paused';
            }

        } // ENDE PLAY

        else if(this.gameStatus == 'dead') { // Was Passiert wenn das Spiel nicht Pausiert sondern zuende ist? (Tot)

            console.log('ENDE');

            /**
            * Gameover Screen einblenden und alle objekt.images löschen
            */
            this.controller.gameover();

            if(this.controller.getEnterKey().isDown) { // Space-Taste für Neustart drücken

                //this.controller.zeichneObjekte();
                this.view.removeText();
                this.resetGame(); // kolisionstyp auf frei setzen
                this.gameStatus = 'start';
            }


              /////////////////////////TODO////////////////////////////////
              // Erhöhen des Counters alle 20 Frames, unabhängig von der Spielgeschwindigkeit
              if (this.framecounter == 20){
                    //Erhöhen des logik counters
                    this.snekSpawn++;
                    this.snekSpawn %= 10;
                    if(this.snekSpawn == 0){
                        this.controller.vergroessereSchlange();
                    }
                }



        } // ENDE DEAD

        else if(this.gameStatus == 'paused') {

            this.controller.paused(); // pause screen und gestoppte animation

            var up = this.controller.getCursor().up.isDown;
            var down = this.controller.getCursor().down.isDown;
            var left = this.controller.getCursor().left.isDown;
            var right = this.controller.getCursor().right.isDown;

            // Wenn space gedrückt wird
            if(up || down || left || right) {
                this.view.removeText();
                this.gameStatus = 'play';
			}

        } // ENDE PAUSED

    }

    /**
    * Setzt neue Schlange für den Controller und resettet alle stats
    */
    resetGame() {

        // neue schlange initialisieren
        // laufrichtung resetten
        // start des Spielers reseten
        this.controller.reset();

        //this.controller.respawnAll();

        // Geschwindigkeit reseten
        this.spielgeschwindigkeit = 20;

        // Punktestand reseten
        this.score = 0;

        this.controller.zeichneObjekte();

        //Pause-Screen zeichnen
        /*this.view.drawPauseScreen();
        //Wenn eine Taste gedrückt ist
        if(this.controller.getCursor().down.isDown){
            this.paused = false;
            this.view.removeText();
        }*/
    }

}

/////////////////////////////////////////////////////////////////////////////
/////////////////** Start sobald Browserfenster geladen *////////////////////
/////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', () => {

    /** Einstellungen für das Canvas */
    const canvasWidth = 900;
    const canvasHeight = 660;

    /**
    * PHASER.GAME OBJEKT
    * Erzeugt das Canvas und die Phaser-Methoden die
    * implementiert werden müssen für den Spieleablauf
    */
    let game = new Phaser.Game(
        canvasWidth,    // canvas breite
        canvasHeight,   // canvas höhe
        Phaser.CANVAS,  // rendering-typ
        'game-box',     // id des elternknotens in dem canvas erzeugt werden soll
        {
            // Funktionen die implementiert werden MÜSSEN
            preload: preload, // Dateien laden
            create: create,   // Objekte erzeugen
            update: update    // Gameloop
        }
    );

    /** Hauptklasse */
    let main = new Main(game, canvasWidth, canvasHeight);

    /** PHASER-Methode SPRITES/DATEIEN LADEN */
    function preload() {
        main.preload();
    }

    /** PHASER-Methode OBJEKTE ERZEUGEN */
    function create() {
        main.create();
    }

    /** PHASER-Methode GAMELOOP */
    function update() {
        main.update();
    }

});
