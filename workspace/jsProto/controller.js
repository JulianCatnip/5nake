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
        * umgerechnet in Einheiten
        */
		this.canvasWidth = canvasWidth / this.objektGroesse; // Pixelbreite des Canvas wird in Einheiten aufgeteilt (15 Einheiten)
		this.canvasHeight = canvasHeight / this.objektGroesse; // Pixelhöhe des Canvas wird in Einheiten aufgeteilt (11 Einheiten)

        /**
        * Richtung
        */
		this.richtungen = Object.freeze({up: 0, down: 1, right: 2, left: 3}); // freeze: verhindert das Hinzufügen von neuen Eigenschaften zum Objekt
		
        /**
        * Laufrichtung der Schlange
        */
        this.laufrichtung;
		
		/**
		* Schlangen-Objekt 
		*/
		let Schlange = require('./schlange.js').default;
		this.schlange = new Schlange();
		
		/**
		* Objektebehälter Array für Gegner
		*/
		let Gegner = require('./gegner.js').default;
		this.gegner = new Gegner(this.canvasWidth, this.canvasHeight, 'feind'); 
		// canvashöhe und -breite werden für die Berechnung der zufälligen Position übergeben
		
		/**
		* Objektebehälter für Upgrades 
		*/
		//this.boons = new Gegner(this.canvasWidth, this.canvasHeight, '');
		
		/**
		* Objektebehälter Pickup 
		*/
		this.pickup = new Gegner(this.canvasWidth, this.canvasHeight, 'item');
		
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
    bewegeSchlange() {
		 
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
	
	/** 
	* Befehl für das Spawnen eines Gegenstandes (Gegner)
	*/
	erhoeheGegnerzahl() {
		var pickupkol = this.pickup.getInfo();
		pickupkol = pickupkol[0];
		this.gegner.add(pickupkol);
	}
	
	/** 
	* Setzt bei Pickup alle Objekte die neu verteilt werden sollen auf neue Positionen
	*/
	respawnAll() {
		var kopf = this.schlange.getInfo();
		kopf = kopf[0];
		this.pickup.respawn(kopf);
		var pickupkol = this.pickup.getInfo();
		pickupkol = pickupkol[0];
		this.gegner.respawn(pickupkol);		
	}
	
	/** 
	* Kollisionsabfragen mit dem Kopf der Schlange
	* @return gibt typ der Kollision als String wieder
	* : pickup, feind(sowie verfolger als auch stein), boon(upgrade)
	* falls eine Kollision stattfindet
	* : frei
	* falls keine Kollision stattfindet
	*/
	kollision() {

		/**
		* Durch Schlangen-Liste iterieren und prüfen 
		* ob die Position des Kopf-Objekts [0] mit einem 
		* Verfolger-Objekt in der Schlange kollidiert
		*/
		var schlangeninfo = this.schlange.getInfo(); // getter für die Liste in Schlange
		for(var i = 2; i < schlangeninfo.length; i++){
			//Kopf mit Körperteil Position testen, hierbei muss erst beim 3. angefangen werden
			if(schlangeninfo[0].getPositionX() == schlangeninfo[i].getPositionX()){
				//falls X wert Stimmt Y wert überprüfen
				if(schlangeninfo[0].getPositionY() == schlangeninfo[i].getPositionY()){
					console.log('KörperteilKollision An Körperteil: ' + i);
					return 'feind'; // return typ der kollision
				}
			}
		}
		
		/**
		* Durch Gegner-Liste iterieren und prüfen 
		* ob die Position des Kopf-Objekts [0] mit einem 
		* Objekt der Gegner-Liste kollidiert
		*/
		var gegnerinfo = this.gegner.getInfo(); // getter für die Liste in Gegner
		for(var i = 0; i < gegnerinfo.length; i++){
			// Kopf mit Gegner Positionsvergleich X
			if(schlangeninfo[0].getPositionX() == gegnerinfo[i].getPositionX()){
				//falls X wert Stimmt Y wert überprüfen
				if(schlangeninfo[0].getPositionY() == gegnerinfo[i].getPositionY()){
					console.log('Gegnerkollision an Gegner: ' + i);
					return 'feind'; // return typ der kollision
				}
			}
		}
		
		/**
		* Durch Pickup-Liste iterieren und prüfen 
		* ob die Position des Kopf-Objekts [0] mit einem 
		* Objekt der Pickup-Liste kollidiert
		*/
		var pickupinfo = this.pickup.getInfo(); // getter für die Liste in Pickup
		// kopf position X mit item position X vergleichen 
		if(schlangeninfo[0].getPositionX() == pickupinfo[0].getPositionX()) {
			//falls X wert Stimmt Y wert überprüfen
			if(schlangeninfo[0].getPositionY() == pickupinfo[0].getPositionY()) {
					console.log('Pickup wurde aufgehoben' + i);
					return 'pickup'; // return typ der kollision
			}
		}
		
		// falls nichts zutrifft frei wiedergeben
		return 'frei'; // keine kollision
	}
	
	/** Vergrößert die Schlange */
	vergroessereSchlange() {
		this.schlange.add();
	}
	
	/** Verkleinert die Schlange */
	verkuerzeSchlange() {
		var zutoeten = this.schlange.delete(0);
		if(zutoeten != undefined){
			this.view.draw(zutoeten, true);
		}
	}
	
	
	/**
	* Zeichne Objekte
	* Iteriert durch Objekt-Listen und lässt diese durch View zeichnen.
	* Lässt außerdem die Schlangenlänge durch View anzeigen.
	*/
	zeichneObjekte() {

		/**
		* Durch Schlangen-Liste iterieren und deren 
		* Objekte von View zeichnen lassen 
		*/
		var schlangeninfo = this.schlange.getInfo(); // getter für die Liste in Schlange
		for(var i = 0; i < schlangeninfo.length; i++){
			this.view.draw(schlangeninfo[i], false); // objekt, kill=false
		}

		/** Länge der Schlange in View anzeigen lassen */
		this.view.laengenAnzeige(schlangeninfo.length);

		/**
		* Durch Gegner-Liste iterieren und deren 
		* Objekte von View zeichnen lassen 
		*/
		var gegnerinfo = this.gegner.getInfo(); // getter für die Liste in Gegner
		for(var i = 0; i < gegnerinfo.length; i++){
			this.view.draw(gegnerinfo[i], false); // objekt, kill=false
		}

		/**
		* Durch Item-Liste iterieren und deren 
		* Objekte von View zeichnen lassen 
		*/
		var pickupinfo = this.pickup.getInfo(); // getter für die Liste in Pickup
		for(var i = 0; i < pickupinfo.length; i++){
			this.view.draw(pickupinfo[i], false); // objekt, kill=false
		}

	}

}