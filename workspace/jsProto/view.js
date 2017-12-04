import 'pixi';
import 'p2';
import 'phaser';

import { Schlange } from './schlange';

//Kontrollerklasse für die Implementation des Views
export default class View {

	constructor(game, canvasWidth, canvasHeight, schlange) {
        this.game = game;

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.spielergroesse = 60;
        this.startX = this.spielergroesse;
        this.startY = this.spielergroesse;

        this.einheitX = this.canvasWidth / 15;	//60px
		this.einheitY = this.canvasHeight / 11; 	//60px

        this.schlange = schlange;
    }

    /** 
    * Startschlange
    * bisher nur 1 Kopf
    */
    zeichneSchlange() {
    	this.schlange.first.image = this.game.add.image(this.startX, this.startY, 'spieler');
    }

    /** 
    * Erzeugt neuen Kopf 
    * an der übergebenen Position
    */
    neuerKopf(x, y) {
        var neuerKopf = new Object(); // objekt erzeugen
        // dem objekt sprite mit position zuweisen
        neuerKopf.image = this.game.add.image(x, y, 'spieler'); // dem kopf-objekt das item-bild hinzufügen
        neuerKopf.next = null; // zeiger zum nächsten steht auf null
        this.schlange.first.next = neuerKopf; // zeiger next vom aktuellen kopf zeigt auf den neuen kopf
        this.schlange.first = neuerKopf;
    }

    entferneLetzten() {
        this.schlange.last.image.destroy();
        this.schlange.last = this.schlange.first;
    }

}