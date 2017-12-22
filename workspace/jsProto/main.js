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

    }

    /** 
    * PHASER-Methode SPRITES/DATEIEN LADEN
    * Canvas-Einstellungen und Bild-/Audio-Dateien
    */
    preload() {
        this.game.stage.backgroundColor = "#FFF"; // hier später evtl ein Boden-Hintergrundbild

        this.game.load.spritesheet('spieler', '../images/spieler.png', 60, 60, 12);
        this.game.load.image('verfolger', '../images/verfolger.jpg');
        this.game.load.image('stein', '../images/stein.jpg');
        // usw...
    }

    /** 
    * PHASER-Methode OBJEKTE ERZEUGEN 
    * Hier werden die benötigten Objekte und die Steuerung erzeugt.
    */
    create() {

        /** Schlange aus Spieler und Verfolger erzeugen */
        //this.view.zeichneSchlange();
        //this.view.laengenAnzeige();
		  this.controller.zeichneObjekte();

        ////////////////// TODO: //////////////////

        /** Random Pickup erzeugen */
        // this.view.platziereRandomPickup();

        /** Random Feind erzeugen */
        // this.view.platziereRandomFeind();

        /** Random Tisch erzeugen */
        // this.view.platziereRandomTisch();

        /** Wand aus Steinen erzeugen */
        // this.view.zeichneWand();

    }

    /** 
    * PHASER-Methode GAMELOOP
    * Hier wird die Spiele-Logik durchlaufen!!!
    */
    update() { 

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

            ////////////////// TODO: //////////////////

            // HIER WERDEN KOLLISIONEN ABGEFRAGT 
            /*
            if (this.view.kollisionMitVerfolger() || this.view.kollisionMitFeind() || this.view.kollisionMitWand()) {
                // Game over...-Meldung
                // this.view.loescheSchlange(); // schlange löschen

                // this.view.zeichneSchlange_LVL1(); // neue schlange initialisieren
                // this.spielgeschwindigkeit = 20; // Geschwindigkeit reseten
                // laufrichtung reseten
                // start des Spielers reseten
                // Punktestand reseten
            }
            
            if (this.view.kollisionMitPickup()) {
                // Punktestand raufsetzen
                // Pickup löschen
                // this.view.platziereRandomPickup(); // neues Pickup platzieren
                // this.spielgeschwindigkeit--; // spielgeschwindigkeit vergrößern?
                // if (this.spielgeschwindigkeit <= 5) { // geschwindigkeit nie kleiner als 5
                    this.spielgeschwindigkeit = 5;
                }
            }
            */
            // ...

            this.frameCounter = 0;
        }

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