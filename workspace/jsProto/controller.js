import 'pixi';
import 'p2';
import 'phaser';

import { View } from './view';

//Kontrollerklasse des Spiels
export default class Controller {

	constructor(game, cursor, view, canvasWidth, canvasHeight) {
		this.view = view;
		this.cursor = cursor;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.richtung = Object.freeze({up: 0, down: 1, right: 2, left: 3});
		this.laufrichtung;
		this.spielergroesse = 60;
		this.x = view.startX;
		this.y = view.startY;
    }

    updateLaufrichtung() {
        if (this.cursor.right.isDown && this.laufrichtung != this.richtung.left) { // wenn rechts gedrückt ist und nicht links
            this.laufrichtung = this.richtung.right; // richtung ist rechts
        }
        if (this.cursor.left.isDown && this.laufrichtung != this.richtung.right) { // wenn links gedrückt ist und nicht rechts
            this.laufrichtung = this.richtung.left; // richtung ist links
        }
        if (this.cursor.up.isDown && this.laufrichtung != this.richtung.down) { // wenn oben gedrückt ist und nicht unten
            this.laufrichtung = this.richtung.up; // richtung ist oben
        }
        if (this.cursor.down.isDown && this.laufrichtung != this.richtung.up) { // wenn unten gedrückt ist und nicht oben
            this.laufrichtung = this.richtung.down; // richtung ist unten
        }
    }

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

        /** brauchen wir nicht wenn wir eine wand machen */
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

}