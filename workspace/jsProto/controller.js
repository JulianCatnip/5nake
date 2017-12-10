import 'pixi';
import 'p2';
import 'phaser';

import { View } from './view';

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
        * Canvas Höhe und Breite
        */
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

        /**
        * Richtung
        */
		this.richtungen = Object.freeze({up: 0, down: 1, right: 2, left: 3}); // freeze: verhindert das Hinzufügen von neuen Eigenschaften zum Objekt
		
        /**
        * Laufrichtung der Schlange
        */
        this.laufrichtung;

        /**
        * Größe eines Einzelobjektes
        */
		this.objektGroesse = 60; // increment um 60

        /**
        * x- und y-Koordinate
        */
		this.x = this.view.startX + (2 * this.objektGroesse);
		this.y = this.view.startY;

        /**
        * Speichert eine Zahl je nach derzeitiger Laufrichtung
        */
        this.changeId;

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

        /** Berechnung der neuen Koordinaten */
        if (this.laufrichtung == this.richtungen.right) { // wenn richtung rechts ist

            this.x += this.objektGroesse; // position x + breite des spielers
            this.changeId = 0;

        } else if (this.laufrichtung == this.richtungen.left) { // wenn richtung links ist

            this.x -= this.objektGroesse; // position x - breite des spielers
            this.changeId = 1;

        } else if (this.laufrichtung == this.richtungen.up) { // wenn richtung oben ist

            this.y -= this.objektGroesse; // position y - höhe des spielers
            this.changeId = 2;

        } else if (this.laufrichtung == this.richtungen.down) { // wenn richtung unten ist

            this.y += this.objektGroesse; // position y + höhe des spielers
            this.changeId = 3;

        }

        /**
        * Schlange läuft gegen den Rand des Canvas und kommt 
        * an der anderen Seite wieder raus.
        * Brauchen wir nicht wenn wir eine Wand machen, 
        * dann wird eine Kollision stattdessen implementiert.
        */
        if (this.x <= 0 - this.objektGroesse) { // wenn x position kleiner/gleich 0 - spielerbreite ist

            this.x = this.canvasWidth - this.objektGroesse; // position x = canvas-breite - spielerbreite

        } else if (this.x >= this.canvasWidth) { // wenn position x größer als canvas-breite

            this.x = 0; // x = 0

        } else if (this.y <= 0 - this.objektGroesse) { // wenn position y kleiner/gleich 0 - spielerhöhe ist

            this.y = this.canvasHeight - this.objektGroesse; // position y = canvas höhe - spielerhöhe

        } else if (this.y >= this.canvasHeight) { // wenn position y größer als canvas-höhe ist

            this.y = 0; // y = 0

        }

        /** Schlange bewegen */
        if (this.laufrichtung != undefined) { // wenn Laufrichtung bestimmt ist

            /** 
            * Übergibt neue Koordinaten für das Spieler-Objekt
            * und die Id der derzeitigen Richtung 
            */
            this.view.updatePosition(this.x, this.y, this.changeId); // Schlange um 1 Einheit weiter bewegen

        }

    }

}