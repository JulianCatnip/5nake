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

        let Sound = require('./sound.js').default; // klassen import
        this.sound = new Sound(this.game);

        let Controller = require('./controller.js').default; // klassen import
        this.controller = new Controller(this.game, this.view, this.sound, this.canvasWidth, this.canvasHeight);

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
        * Typ der aktuellen Kollision
        */
        this.kollisionstyp = 'frei';

        /**
        * Spielstatus
        */
        this.gameStatus = 'start';

        /** Timer und Spielsekunden */
        this.timer;
        this.seconds = 0;

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
        this.game.load.spritesheet('verfolger', '../images/verfolger.png', 60, 60, 48);
        this.game.load.spritesheet('feind', '../images/feind.png', 60, 60, 16);
		this.game.load.image('item', '../images/gummiente.png');

        /** Sound */
        this.game.load.audio('play', ['../audio/a_journey_awaits.mp3', '../audio/a_journey_awaits.ogg']);
        this.game.load.audio('gameover', ['../audio/gameover.mp3']);
        this.game.load.audio('pickup', ['../audio/pling.wav']);
        this.game.load.audio('crash', ['../audio/crash.wav']);

        /** GAMEOVER-Sprite laden */
        this.game.load.image('gameover', '../images/gameover.jpg');
        // usw...
    }

    /**
    * PHASER-Methode OBJEKTE ERZEUGEN
    * Hier werden die benötigten Objekte und die Steuerung erzeugt.
    */
    create() {

        /** Canvas-Hintergrund setzen */
        this.game.add.tileSprite(0, 0, 900, 660, 'boden');

        /** Keyboard Browservoreinstellungen reseten */
        this.controller.resetKeyboardKeys();

        /** Sound initialisieren */
        this.controller.createSound();

        /** Alle Objekte zu Start zeichnen */
        this.controller.zeichneObjekte();

        /** Timer initiieren */
        this.timer = this.game.time.create(false);

        /** Funktion zum Aktualisierend er Zeitanzeige initiieren */
        var updateTime = function() {
                this.seconds ++;
                this.view.zeitAnzeige(this.seconds);
            }

        /**  TimeEvent jede Sekunde ausführen lassen */
        this.timer.loop(1000, updateTime, this);

    }

    /*updateTime() {
    this.seconds ++;
    this.view.zeitAnzeige(this.seconds);
    }*/

    /**
    * PHASER-Methode GAMELOOP
    * Hier wird die Spiele-Logik durchlaufen!!!
    */
    update() {

        /** Spielstatus STARTBILDSCHIRM */
        if(this.gameStatus == 'start') {

            this.controller.started(); // startscreen

            /** Alle Objekte die zu Start benötigt werden zeichnen (Schlange, Pickup, Gegner) */

            if(this.controller.getEnterKey().isDown) { // Enter-Taste für Spiel-Start drücken
                this.controller.played();
                this.gameStatus = 'play';
                // Timer für Zeitanzeige wird gestartet, sobald das Spiel anfängt
                this.timer.start();
            }

        }
        /** Spielstatus SPIELEND */
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

                                        this.gameStatus = 'dead'; // Spielstatus wechseln

                                        break;

                        case 'boon':    /** Kollision mit Upgrade-Item? */
                                        /** TODO: Apply Boon;*/
                                        console.log('BOON');
                                        break;

                        case 'pickup':  /** Kollision mit Pickup */
                                        this.controller.respawnAll();
                                        this.controller.verkuerzeSchlange();
                                        if (this.spielgeschwindigkeit <= 10) {
                                            this.spielgeschwindigkeit = 10;
                                        } else {
														 this.spielgeschwindigkeit -= 1;
													 }
                                        break;

                    }
                }

                // HIER WERDEN DIE EINZELENEN KOMPONENTEN NEU GEZEICHNET
                this.controller.zeichneObjekte(); // alle objekte neuzeichnen

                this.controller.notifySoundStats(this.kollisionstyp, this.spielgeschwindigkeit); // aktualisierung der musik

                // Schlange vergrößern, Punktestand aktualisieren
                this.snekSpawn++;
    			this.snekSpawn %= 10;
    			if(this.snekSpawn == 0){
                    this.controller.vergroessereSchlange();
                    //pro Zeittaktung automatisches update der Punkte
                    this.controller.updateScoreOverTime();
    			}

                this.frameCounter = 0;

            } // ENDE BEWEGUNGS-LOOP


            // Wenn P gedrückt wird pausieren
            if(this.controller.getPauseKey().isDown) {
                this.gameStatus = 'paused';
            }

        }
        /** Spielstatus GAME OVER */
        else if(this.gameStatus == 'dead') {

            this.controller.gameover();

            // Zeit stoppen
            this.timer.stop(false);

            if(this.controller.getEnterKey().isDown) { // Enter-Taste für Neustart drücken

                this.resetGame(); // kollisionstyp auf frei setzen
                this.gameStatus = 'start'; // spielstatus auf start setzen

                // Sekundenzahl zurücksetzen
                this.seconds = 0;
                this.view.zeitAnzeige(this.seconds);
            }

            // Erhöhen des Counters alle 20 Frames, unabhängig von der Spielgeschwindigkeit
            if (this.framecounter == 20){
                //Erhöhen des logik counters
                this.snekSpawn++;
                this.snekSpawn %= 10;
                    if(this.snekSpawn == 0){
                        this.controller.vergroessereSchlange();
                }
            }

        }
        /** Spielstatus PAUSIEREND */
        else if(this.gameStatus == 'paused') {

            this.controller.paused(); // pause screen und gestoppte animation
            this.timer.stop(false);

            // Getter für Cursor-Keys
            var up = this.controller.getCursor().up.isDown;
            var down = this.controller.getCursor().down.isDown;
            var left = this.controller.getCursor().left.isDown;
            var right = this.controller.getCursor().right.isDown;

            // Wenn der Cursor gedrückt wird wieder spielen
            if(up || down || left || right) {
                this.view.removeText();
                this.gameStatus = 'play';
                this.timer.start();
			}

        }

    } // Ende update()-Loop

    /**
    * Setzt neue Schlange für den Controller und resettet alle stats
    */
    resetGame() {

        // neue schlange initialisieren
        // laufrichtung resetten
        // Startposition des Spielers setzen
        this.controller.reset();

        // Geschwindigkeit reseten
        this.spielgeschwindigkeit = 20;

        this.controller.zeichneObjekte(); // objekte neuzeichnen

        //Pause-Screen zeichnen
        //this.view.drawPauseScreen();
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
