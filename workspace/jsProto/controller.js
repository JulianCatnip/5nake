import 'pixi';
import 'p2';
import 'phaser';

import { View } from './view';
import { Schlange } from './schlange';
import { Einzelobjekt} from './einzelobjekt';
import { Gegner } from './gegner';

/**
* Controller
* Steuert die Objekte
*/
export default class Controller {

    /**
    * Constructor
    * @param game : Phaser.Game-Objekt
    * @param view : View-Objekt
    * @param canvasWidth : Canvas-Breite
    * @param canvasHeight : Canvas-Höhe
    */
	constructor(game, view, canvasWidth, canvasHeight) {

        /** 
        * Phaser.Game Objekt 
        * Wird benötigt um auf jegliche Funktionen des Frameworks zuzugreifen.
        */
        this.game = game;

        /**
        * View-Objekt
        */
		  this.view = view;
		
        /**
        * Größe eines Einzelobjektes
        */
	  	  this.objektGroesse = 60; // increment um 60

        /**
        * Canvas Höhe und Breite
        */
		  this.canvasWidth = canvasWidth/this.objektGroesse;
		  this.canvasHeight = canvasHeight/this.objektGroesse;

        /**
        * Richtung
        */
		  this.richtungen = Object.freeze({up: 0, down: 1, right: 2, left: 3}); // freeze: verhindert das Hinzufügen von neuen Eigenschaften zum Objekt
		
        /**
        * Laufrichtung der Schlange
        */
        this.laufrichtung;
		
			/**
			* SchlangenObjekt */
		  let Schlange = require('./schlange.js').default;
		  this.schlange = new Schlange();
		  //this.schlange.initSchlange();
		
			/**
			Objektebehälter Array für Gegner */
		   let Gegner = require('./gegner.js').default;
			var gegner = new Gegner(this.canvasWidth, this.canvasHeight, 'stein');
		
        /**
        * x- und y-Koordinate
        */
		  //this.x = this.view.startX + (2 * this.objektGroesse);
		  //this.y = this.view.startY;

        /**
        * Speichert eine Zahl je nach derzeitiger Laufrichtung
        */
        //this.changeId;

    }

    /** Getter für die Cursor Keys */
    getCursor() {
        return this.game.input.keyboard.createCursorKeys();
    }

    /** Ändert die Laufrichtung */
    updateLaufrichtung() {

        if (this.getCursor().right.isDown && this.laufrichtung != this.richtungen.left) {

            this.laufrichtung = this.richtungen.right; // richtung rechts

        }
        if (this.getCursor().left.isDown && this.laufrichtung != this.richtungen.right) {

            this.laufrichtung = this.richtungen.left; // richtung links

        }
        if (this.getCursor().up.isDown && this.laufrichtung != this.richtungen.down) { 

            this.laufrichtung = this.richtungen.up; // richtung oben

        }
        if (this.getCursor().down.isDown && this.laufrichtung != this.richtungen.up) { 

            this.laufrichtung = this.richtungen.down; // richtung unten

        }

    }

    /** 
    * Aus der derzeitigen Position werden neue Koordinaten berechnet (von 1 Schritt weiter)
    * und an der neu berechneten Position ein neuer Kopf erzeugt.
    */
    bewegeSchlange(){
		 
		 //Hol informationen des Kopfes
		 var kopf = this.schlange.getInfo()[0];

        /** Berechnung der neuen Koordinaten */
        if (this.laufrichtung == this.richtungen.right) { // wenn richtung rechts ist

			  this.schlange.move(kopf.positionX + 1, kopf.positionY);
			  

        } else if (this.laufrichtung == this.richtungen.left) { // wenn richtung links ist

            this.schlange.move(kopf.positionX - 1, kopf.positionY);

        } else if (this.laufrichtung == this.richtungen.up) { // wenn richtung oben ist

            this.schlange.move(kopf.positionX, kopf.positionY - 1);

        } else if (this.laufrichtung == this.richtungen.down) { // wenn richtung unten ist

            this.schlange.move(kopf.positionX, kopf.positionY + 1);

        }

        /**
        * Schlange läuft gegen den Rand des Canvas und kommt 
        * an der anderen Seite wieder raus.
        * Brauchen wir nicht wenn wir eine Wand machen, 
        * dann wird eine Kollision stattdessen implementiert.
        */
        if (kopf.positionX <= 0 - 1) { // wenn x position kleiner/gleich 0 - spielerbreite ist

            kopf.positionX = this.canvasWidth - 1; // position x = canvas-breite - spielerbreite

        } else if (kopf.positionX >= this.canvasWidth) { // wenn position x größer als canvas-breite

            kopf.positionX = 0;

        } else if (kopf.positionY <= 0 - 1) { // wenn position y kleiner/gleich 0 - spielerhöhe ist

            kopf.positionY = this.canvasHeight - 1; // position y = canvas höhe - spielerhöhe

        } else if (kopf.positionY >= this.canvasHeight) { // wenn position y größer als canvas-höhe ist

            kopf.positionY = 0; // y = 0

        }

    }

	
	/** Befehl für das Spawnen eines Gegenstandes (Gegner)
	@param Anzahl*/
	spawneGegner(){
		//this.gegner = [new Einzelobjekt(8,8,'stein')];
	}
	
	/** Despawne alle Objekte ausser Schlange*/
	despawnAll(){
		this.gegner = [];
	}
	
	/** Zeichne Objekte */
	zeichneObjekte(){
		//Zunächst Schlangen zeichnung beauftragen
		var schlangeninfo = this.schlange.getInfo();
		//update Länge der Schlange
		this.view.laengenAnzeige(schlangeninfo.length);
		for(var i = 0; i < schlangeninfo.length; i++){
			this.view.draw(schlangeninfo[i]);
		}
		var gegnerinfo = this.gegner.getInfo();
		for(var i = 0; i < gegnerinfo.length; i++){
			this.view.draw(gegnerinfo[i]);
		}
	}

}