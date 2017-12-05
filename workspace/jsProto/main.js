import 'pixi';
import 'p2';
import 'phaser';

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////** HAUPTKLASSE *////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default class Main {

    constructor(game, canvasWidth, canvasHeight) {
        this.game = game; // Referenz zum Phaser.Game-Objekt
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.gameText; // Test

        this.frameCounter = 0;
        this.spielgeschwindigkeit = 20;

        // Klassenimport
        let Schlange = require('./schlange.js').default; // klassen import
        this.schlange = new Schlange();

        let View = require('./view.js').default; // klassen import
        this.view = new View(this.game, this.canvasWidth, this.canvasHeight, this.schlange);

        let Controller = require('./controller.js').default; // klassen import
        this.controller = new Controller(this.game, this.view, this.canvasWidth, this.canvasHeight);

        this.laufrichtung;

    }

    /** 
    * PHASER-Methode SPRITES/DATEIEN LADEN
    * Canvas-Einstellungen und Bild-/Audio-Dateien
    */
    preload() {
        this.game.stage.backgroundColor = "#FFF";

        this.game.load.image('spieler', '../images/spieler.jpg');
        this.game.load.image('verfolger', '../images/verfolger.jpg');
        this.game.load.image('stein', '../images/stein.jpg');
    }

    /** 
    * PHASER-Methode OBJEKTE ERZEUGEN 
    * Hier werden die benötigten Objekte und die Steuerung erzeugt.
    */
    create() {

        // Schlange aus Kopf und Verfolger erzeugen
        this.view.zeichneSchlange_LVL1();

        // Mauer aus Steinen (Model) erzeugen

        // random pickup (Model) erzeugen

        // Text zum Test (Damit habe ich getestet ob die Steuerung funktioniert)
        // der Text bisher nur eine 0
        this.gameText = this.game.add.text(this.canvasWidth, this.canvasHeight, "0", {
            font: "28px Arial",
            fill: "#000"
        });
        // Platzierung des Textes an die rechte untere Ecke des Feldes
        this.gameText.anchor.setTo(1, 1);
    }

    /** 
    * PHASER-Methode GAMELOOP
    * Hier wird die Spiele-Logik durchlaufen!!!
    */
    // 
    
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
            // die Schlange wird dadurch bewegt, das ein neuer Kopf vorne drangesetzt wird
            this.controller.bewegeSpieler();

            // HIER WERDEN KOLLISIONEN ABGEFRAGT

            //this.controllerTest(); // testet on der Controller funktioniert, wenn ja wird aus der 0 bei up-taste eine 9

            this.frameCounter = 0;
        }

    }

    /** 
    * Test-Methoden 
    */
    controllerTest() {

        if(this.controller.getCursor().up.isDown) {
            this.gameText.text = 9;
        }

        //console.log(this.frameCounter);
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

    /** Testausgabe */
    main.toString();

});