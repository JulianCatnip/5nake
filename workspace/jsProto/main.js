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
		  * Steuerung der Spawnlogik von SchlangenKörperteilen*/
		  this.snekSpawn = 0;
		 
		  /**
		  * SpielStand */
		  //this.score = 0;
		 
		  /**
		  * Typ der aktuellen Kollision */
		  this.kollisionstyp = 'frei';
		 
		  /**
		  * Ist das spiel pausiert oder nicht
		  * fängt mit true an (Press any Key to continue)*/
		  this.paused = true;
		 
		  /**
		  * Ist der Spieler tot oder nicht */
		  this.dead = false;

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
		  this.game.load.image('item', '../images/item.jpg');
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

    }

    /** 
    * PHASER-Methode GAMELOOP
    * Hier wird die Spiele-Logik durchlaufen!!!
    */
    update() { 
		 
		  //Wenn das Spiel nicht pausiert ist
		  if(!this.paused){

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
			  	
			   if(this.kollisionstyp != 'frei'){
			  	switch(this.kollisionstyp) {
					case 'feind': /** TODO: GAMEOVER;*/ console.log('GAMEOVER');
                                    break;
					case 'boon': /** TODO: Apply Boon;*/ console.log('BOON');
                                    break;
               case 'pickup': this.controller.respawnAll(); 
										this.controller.verkuerzeSchlange();
										//this.score + 10;
                                    break;
               }
				}
			  
            ////////////////// TODO: //////////////////
			  

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
			  	 	// HIER WERDEN DIE EINZELENEN KOMPONENTEN GEZEICHNET
			  		this.controller.zeichneObjekte();
			  	//Erhöhen des logik counters
			  	this.snekSpawn++;
			   this.snekSpawn %= 10; 
			   if(this.snekSpawn == 0){
					this.controller.vergroessereSchlange();
				}

            this.frameCounter = 0;
        }

    } else if(this.dead){ //Was Passiert wenn das Spiel nicht Pausiert sondern zuende ist? (Tot)
		// HIER TOT SCREEN EINFÜGEN
	} else { //Was passiert um das Spiel zu starten bzw was passiert im Pausescreen? 
		this.view.drawPauseScreen();
		//Wenn eine Taste gedrückt ist
		if(this.controller.getCursor().down.isDown){
			this.paused = false;
			this.view.removeText();
            this.controller.calculateSeconds();
			}
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