import 'pixi';
import 'p2';
import 'phaser';

/////////////////////////////////////////////////////////////////////////////
///////////////////////////** HAUPTKLASSE MAIN **////////////////////////////
//////////////////// Erzeugt Model, View und Controller. ////////////////////
// Implementiert preload(), create() und update()-Methode für Phaser.Game ///
/////////////////////////////////////////////////////////////////////////////
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
        * Steuerung der Spawnlogik von Schlangen-Körperteilen.
        */
        this.snekSpawn = 0;

		/**
        * Typ der Kollision
        */
        this.kollisionstyp = 'frei';

        /**
        * Spielstatus
        */
        this.gameStatus = 'start';

        /** 
        * Timer und Spielsekunden 
        */
        this.timer;
        this.seconds = 0;

    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////** PHASER.GAME METHODEN **////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * PHASER-Methode SPRITES/DATEIEN LADEN
    * Canvas-Einstellungen und Bild-/Audio-Dateien
    */
    preload() {

        // Boden-Sprite laden
        this.game.load.image('boden', '../images/boden.png');

        // Objekt-Sprites laden
        this.game.load.spritesheet('spieler', '../images/spieler.png', 60, 60, 12);
        this.game.load.spritesheet('verfolger', '../images/verfolger.png', 60, 60, 48);
        this.game.load.spritesheet('feind', '../images/feind.png', 60, 60, 16);
		this.game.load.image('item', '../images/gummiente.png');

        // Sound laden 
        this.game.load.audio('play', ['../audio/a_better_world.mp3']);
        this.game.load.audio('paused', ['../audio/a_journey_awaits.mp3', '../audio/a_journey_awaits.ogg']);
        this.game.load.audio('gameover', ['../audio/gameover.mp3']);
        this.game.load.audio('pickup', ['../audio/pling.wav']);
        this.game.load.audio('crash', ['../audio/crash.wav']);

        // Spielstand-Screens laden
        this.game.load.image('startscreen', '../images/start.png');
        this.game.load.image('anleitung', '../images/anleitung.png');
        this.game.load.image('pause', '../images/pause.png');
        this.game.load.image('gameover', '../images/gameover.png');

    }

    /**
    * PHASER-Methode ERZEUGEN
    * Hier werden die benötigten Objekte für den Start erzeugt.
    */
    create() {

        this.game.add.tileSprite(0, 0, 900, 660, 'boden'); // Canvas-Hintergrund setzen
        
        this.controller.resetKeyboardKeys(); // Keyboard Browser-Voreinstellungen entfernen
        this.controller.createSound(); // Sound initialisieren
        this.controller.zeichneObjekte(); // Alle Objekte zu Start zeichnen

        // Timer initiieren
        this.timer = this.game.time.create(false);
        
        this.timer.loop(1000, this.updateEverySecond, this); // TimeEvent jede Sekunde ausführen lassen

    }

    /**
    * PHASER-Methode GAMELOOP
    * Hier wird die Spiele-Logik durchlaufen!!!
    */
    update() {

        // SPIELSTATUS START 
        if(this.gameStatus == 'start') {

            this.controller.started(); // startscreen

            if(this.controller.getEnterKey().isDown) { // Enter-Taste für Play-Status drücken
                this.gameStatus = 'play'; // Spielstand wechseln
                this.controller.played(this.gameStatus); // Aktionen beim Spiel-Status
                this.timer.start(); // Timer für Zeitanzeige starten
            } else if(this.controller.getManualKey().isDown) { // A-Taste für Anleitung drücken
                this.controller.zeigeAnleitung();
            }

        }
        // SPIELSTATUS PLAY
        else if(this.gameStatus == 'play') {

            this.controller.updateLaufrichtung(); // Laufrichtung aktualisieren
            this.frameCounter++;

            // Diese Abfrage regelt die Geschwindigkeit des Spiels, da die
            // update()-Methode aus Phaser ein sehr schneller und unendlicher Loop ist.
            // Diese Loop läuft also durch unendlich viele "Frames" und durch frameCounter und spielgeschwindigkeit wird es
            // nun so eingestellt das alle 20 Frames 1 Aktion ausgeführt wird und der Loop dann wieder von vorne beginnt.
            if (this.frameCounter == this.spielgeschwindigkeit) {

                this.controller.bewegeSchlange(); // Spieler mit mit Cursor bewegen

                this.kollisionstyp = this.controller.kollision(); // Kollisonen Abfragen
                if(this.kollisionstyp != 'frei') { 

                    switch(this.kollisionstyp) { // je nach Kollisionstyp reagieren
                        // bei Kollision mit Gegner oder Körperteil
                        case 'feind':   this.controller.died(this.gameStatus);
                                        this.gameStatus = 'dead'; // Spielstatus wechseln   
                                        break;
                        // bei Kollision mit Pickup 
                        case 'pickup':  this.controller.respawnAll();
                                        this.controller.verkuerzeSchlange();

                                        if (this.spielgeschwindigkeit <= 10) { // Spielgeschwindigkeit erhöhen (bis max. 10)
                                            this.spielgeschwindigkeit = 10;
                                        } else {
                                            this.spielgeschwindigkeit -= 1;
                                        }

                    }

                }

                this.controller.zeichneObjekte(); // Objekte neu zeichnen
                this.controller.notifySoundStats(this.kollisionstyp);

                // Schlange vergrößern & Punktestand aktualisieren
                this.snekSpawn++;
    			this.snekSpawn %= 10;
    			if(this.snekSpawn == 0){
                    this.controller.vergroessereSchlange();
                    // pro Zeittaktung automatisches update der Punkte
                    this.controller.updateScoreOverTime();
    			}

                this.frameCounter = 0;

            }

            if(this.controller.getPauseKey().isDown) { // Wenn P gedrückt wird pausieren
                this.controller.paused(this.gameStatus);
                this.gameStatus = 'paused';
            }

        }
        // SPIELSTATUS GAMEOVER (DEAD)
        else if(this.gameStatus == 'dead') {

            this.controller.gameover();

            this.timer.stop(false); // Zeit stoppen

            if(this.controller.getEnterKey().isDown) { // Enter-Taste für Neustart drücken
                this.resetGame(); // spiel zurücksetzen
                this.gameStatus = 'start';
            } else if(this.controller.getStartKey().isDown) { // S-Taste Startseite drücken
                this.resetGame(); // spiel zurücksetzen
                this.gameStatus = 'start';
            }

        }
        // SPIELSTATUS PAUSED
        else if(this.gameStatus == 'paused') {

            this.controller.stopAnimation(); // sprite-animationen stoppen
            this.timer.stop(false); // zeit anhalten

            // Getter für Cursor-Keys
            var up = this.controller.getCursor().up.isDown;
            var down = this.controller.getCursor().down.isDown;
            var left = this.controller.getCursor().left.isDown;
            var right = this.controller.getCursor().right.isDown;

            // Wenn der Cursor gedrückt wird wieder spielen
            if(up || down || left || right) {
                this.controller.played(this.gameStatus);
                this.gameStatus = 'play';
                this.timer.start();
			}

        }

    }

    /////////////////////////////////////////////////////////////////////////////
    //////////////////////////** ANDERE METHODEN **//////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /** 
    * Funktion, die die Sekundenanzahl hochzählt und den 
    * Aufruf jede Sekunde an den Controller weitergibt.
    */
    updateEverySecond() { 
        this.seconds++;
        this.controller.updateTime(this.seconds);
    }

    /**
    * Setzt Variablen auf ihre Anfangswerte zurück und lässt Objekte neu zeichnen.
    */
    resetGame() {

        this.seconds = 0; // Sekundenzahl zurücksetzen
        this.spielgeschwindigkeit = 20; // Geschwindigkeit zurücksetzen
        this.frameCounter = 0; //FrameCounter zurücksetzen

        this.controller.reset(this.seconds); // Startposition des Spielers setzen
        this.controller.zeichneObjekte(); // Objekte neuzeichnen

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
