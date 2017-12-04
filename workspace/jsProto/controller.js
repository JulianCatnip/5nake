import 'pixi';
import 'p2';
import 'phaser';

import { View } from './view';

//Kontrollerklasse des Spiels
export default class Controller {

	constructor(game, view, canvasWidth, canvasHeight) {
        this.game = game;
		this.view = view;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

        this.cursor;
		this.richtung = Object.freeze({up: 0, down: 1, right: 2, left: 3}); // freeze: verhindert das Hinzufügen von neuen Eigenschaften zum Objekt
		this.laufrichtung;
		this.spielergroesse = 60; // increment um 60

		this.x = this.view.startX;
		this.y = this.view.startY;
    }

    /** Getter für die Cursor Keys */
    getCursor() {
        return this.game.input.keyboard.createCursorKeys();
    }

    /** Ändert die Laufrichtung */
    updateLaufrichtung() {

        if (this.getCursor().right.isDown && this.laufrichtung != this.richtung.left) {

            this.laufrichtung = this.richtung.right; // richtung rechts

        }
        if (this.getCursor().left.isDown && this.laufrichtung != this.richtung.right) {

            this.laufrichtung = this.richtung.left; // richtung links

        }
        if (this.getCursor().up.isDown && this.laufrichtung != this.richtung.down) { 

            this.laufrichtung = this.richtung.up; // richtung oben

        }
        if (this.getCursor().down.isDown && this.laufrichtung != this.richtung.up) { 

            this.laufrichtung = this.richtung.down; // richtung unten

        }

    }

    /** 
    * Aus der derzeitigen Position werden neue Koordinaten berechnet (von 1 Schritt weiter)
    * und an der neu berechneten Position ein neuer Kopf erzeugt.
    */
    bewegeSpieler() {

        if (this.laufrichtung == this.richtung.right) { // wenn richtung rechts ist

            this.x += this.spielergroesse; // position x + breite des spielers

        } else if (this.laufrichtung == this.richtung.left) { // wenn richtung links ist

            this.x -= this.spielergroesse; // position x - breite des spielers

        } else if (this.laufrichtung == this.richtung.up) { // wenn richtung oben ist

            this.y -= this.spielergroesse; // position y - höhe des spielers

        } else if (this.laufrichtung == this.richtung.down) { // wenn richtung unten ist

            this.y += this.spielergroesse; // position y + höhe des spielers

        }

        /**
        * Schlange läuft gegen den Rand des Canvas und kommt 
        * an der anderen Seite wieder raus.
        * Brauchen wir nicht wenn wir eine Wand machen, 
        * dann wird eine Kollision stattdesen implementiert.
        */
        if (this.x <= 0 - this.spielergroesse) { // wenn x position kleiner/gleich 0 - spielerbreite ist

            this.x = this.canvasWidth - this.spielergroesse; // position x = canvas-breite - spielerbreite

        } else if (this.x >= this.canvasWidth) { // wenn position x größer als canvas-breite

            this.x = 0; // x = 0

        } else if (this.y <= 0 - this.spielergroesse) { // wenn position y kleiner/gleich 0 - spielerhöhe ist

            this.y = this.canvasHeight - this.spielergroesse; // position y = canvas höhe - spielerhöhe

        } else if (this.y >= this.canvasHeight) { // wenn position y größer als canvas-höhe ist

            this.y = 0; // y = 0

        }

        if (this.laufrichtung != undefined) { // wenn spieler richtung bestimmt ist

            this.view.neuerKopf(this.x, this.y); // neuen kopf erzeugen

        }

    }

    /** Löscht den hinteren Knoten */
    entferneLetzten() {
        this.view.entferneLetzten();
    }

}