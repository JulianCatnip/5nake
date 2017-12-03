import 'pixi';
import 'p2';
import 'phaser';

import { Schlange } from './schlange';

//Kontrollerklasse für die Implementation des Views
export default class View {

	constructor(game, canvasWidth, canvasHeight, schlange) {
        this.game = game;

        this.spielergroesse = 60;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.startX = this.spielergroesse;
        this.startY = this.spielergroesse;
        this.einheitX = this.canvasWidth / 15;	//60px
		this.einheitY = this.canvasHeight / 11; 	//60px

        this.schlange = schlange;
    }

    zeichneSchlange() {
    	this.schlange.first.image = this.game.add.image(this.startX, this.startY, 'spieler');
    }

    /** Erzeugt neuen Kopf */
    neuerKopf(x, y) {
        var neuerKopf = new Object(); // objekt erzeugen
        neuerKopf.image = game.add.image(x, y, 'spieler'); // dem kopf-objekt das item-bild hinzufügen
        neuerKopf.next = null; // zeiger zum nächsten steht auf null
  		//this.schlange.follower = this.schlange.first;
  		//this.schlange.follower.image = game.add.image(x, y, 'verfolger');
        this.schlange.first.next = neuerKopf; // zeiger next vom aktuellen kopf zeigt auf den neuen kopf
        this.schlange.first = neuerKopf;

        var tag = document.getElementById("test");
		tag.innerHTML = "x = " + x + "; y = " + y;
    }

    update() {

    }

    test() {

    	var canvas = document.getElementsByTagName('canvas')[0];

		
		canvas.innerHTML = "Fuck Fuck Fuck";

    }

    // dem objekt position 
    // und sprite zuweisen

}