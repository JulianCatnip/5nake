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
			this.gegner = new Gegner(this.canvasWidth, this.canvasHeight, 'stein');
		
			/**
			* Objektebehälter für Upgrades */
			//this.boons = new Gegner(this.canvasWidth, this.canvasHeight, '');
		
		   /**
			* Objektebehälter Pickup */
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
        
        /** Speichert ob und womit es eine Kollision gab, setzen der IV durch aufruf von setMethoden in Main*/
        this.kollisionMitVerfolger = false;
        
        this.kollisionMitFeind = false;
        
        this.kollisionMitWand = false;

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
	erhoeheGegnerzahl(){
		var pickupkol = this.pickup.getInfo();
		pickupkol = pickupkol[0];
		this.gegner.add(pickupkol);
	}
	
	/** Setzt bei Pickup alle Objekte die neu verteilt werden sollen auf neue Positionen*/
	respawnAll(){
		var kopf = this.schlange.getInfo();
		kopf = kopf[0];
		this.pickup.respawn(kopf);
		var pickupkol = this.pickup.getInfo();
		pickupkol = pickupkol[0];
		this.gegner.respawn(pickupkol);		
	}
	
	/** Kollisionsabfragen mit dem Kopf der Schlange
	*@ return gibt typen der Kollision als String wieder
		: pickup, feind(sowie verfolger als auch stein), boon(upgrade)
		falls eine Kollision stattfindet
		: frei
		falls keine Kollision stattfindet*/
	kollision(){
		//schlangeninfo holen
		var schlangeninfo = this.schlange.getInfo();
		//durch Schlange iterieren
		for(var i = 2; i < schlangeninfo.length; i++){
			//Kopf mit KörperteilPosition testen, hierbei muss erst beim 3. angefangen werden
			if(schlangeninfo[0].getPositionX() == schlangeninfo[i].getPositionX()){
				//falls X wert Stimmt Y wert überprüfen
				if(schlangeninfo[0].getPositionY() == schlangeninfo[i].getPositionY()){
					console.log('KörperteilKollision An Körperteil: ' + i);
					return 'feind';
				}
			}
		}
		
		//durch Gegner Iterieren
		var gegnerinfo = this.gegner.getInfo();
		for(var i = 0; i < gegnerinfo.length; i++){
			//Kopf mit Gegnern
			if(schlangeninfo[0].getPositionX() == gegnerinfo[i].getPositionX()){
				//falls X wert Stimmt Y wert überprüfen
				if(schlangeninfo[0].getPositionY() == gegnerinfo[i].getPositionY()){
					console.log('Gegnerkollision an Gegner: ' + i);
					return 'feind';
				}
			}
		}
		
		//Pickup testen
		var pickupinfo = this.pickup.getInfo();
		if(schlangeninfo[0].getPositionX() == pickupinfo[0].getPositionX()){
			if(schlangeninfo[0].getPositionY() == pickupinfo[0].getPositionY()){
					console.log('Pickup wurde aufgehoben' + i);
					return 'pickup';
			}
		}
		
		//falls nichts zutrifft frei wiedergeben
		return 'frei';
	}
	
	/** Vergrößert die Schlange */
	vergroessereSchlange(){
		this.schlange.add();
	}
	
	/** Verkleinert die Schlange */
	verkuerzeSchlange(){
		
	}
	
	/** Zeichne Objekte */
	zeichneObjekte(){
		//Zunächst Schlangen zeichnung beauftragen
		var schlangeninfo = this.schlange.getInfo();
		//update Länge der Schlange
		this.view.laengenAnzeige(schlangeninfo.length);
		for(var i = 0; i < schlangeninfo.length; i++){
			this.view.draw(schlangeninfo[i], false);
		}
		var gegnerinfo = this.gegner.getInfo();
		for(var i = 0; i < gegnerinfo.length; i++){
			this.view.draw(gegnerinfo[i], false);
		}
		var pickupinfo = this.pickup.getInfo();
		for(var i = 0; i < pickupinfo.length; i++){
			this.view.draw(pickupinfo[i], false);
		}
	}
    
    loescheSchlange_2(){
        //Zunächst Schlangen zeichnung beauftragen
		var schlangeninfo = this.schlange.getInfo();
		//update Länge der Schlange
		this.view.laengenAnzeige(schlangeninfo.length);
		for(var i = 0; i < schlangeninfo.length; i++){
			this.view.draw(schlangeninfo[i], true);
            console.log('lösche Schlangenteil ' + i);
		}
		var gegnerinfo = this.gegner.getInfo();
		for(var i = 0; i < gegnerinfo.length; i++){
			this.view.draw(gegnerinfo[i], true);
            console.log('lösche gegnerteil ' + i);
		}
		var pickupinfo = this.pickup.getInfo();
		for(var i = 0; i < pickupinfo.length; i++){
			this.view.draw(pickupinfo[i], true);
            console.log('lösche pickupteil ' + i);
		}
    }
    
    /** Löscht Schlange bis auf Kopf */
	loescheSchlange(){
        for(var i = this.schlange.getLength(); i > 0 ; i--){
            var zutoeten = this.schlange.delete(0);
            if(zutoeten != undefined){
                this.view.draw(zutoeten, true);
            }
            //zutoeten.image.destroy();
        }
    }
    
    zeichneSchlange_LVL1(){
        let Schlange = require('./schlange.js').default;
        this.schlange = new Schlange();
    }
    
    zeichneGOScreen(){
        this.view.zeichneGOScreen();
    }
    

}