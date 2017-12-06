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
        this.i = 0;
    }

    /** 
    * Startschlange
    * bisher 1 Kopf mit 2 Verfolgern
    */
    zeichneSchlange_LVL1() {

        this.schlange.lvl1[2].image = this.game.add.image(this.startX, this.startY, 'verfolger');
        this.schlange.lvl1[1].image = this.game.add.image(this.startX + this.spielergroesse, this.startY, 'verfolger');


        //this.schlange.lvl1[0].image = this.game.add.image(this.startX + (2 * this.spielergroesse), this.startY, 'spieler');

        this.schlange.lvl1[0].image = this.game.add.sprite(this.startX + (2 * this.spielergroesse), this.startY, 'spieler');
        this.schlange.lvl1[0].image.frame = 3; // sprite schaut nach rechts
  
    }

    /*addAnimation() {
        for(var i = 0; i < this.schlange.lvl1.length; i++) {
            this.schlange.lvl1[i].image.animations.add('walk', [1, 2], 5, true);
        }
    }*/

    /** 
    * Bewegt die Schlange 
    * an der übergebenen Position
    */
    bewegeSpieler(x, y, changeId) {

        var last_x = this.schlange.lvl1[1].image.world.x;
        var last_y = this.schlange.lvl1[1].image.world.y;

        var x_alt = this.schlange.lvl1[0].image.world.x;
        var y_alt = this.schlange.lvl1[0].image.world.y;

        for(var i = 0; i < this.schlange.lvl1.length; i++) {
            this.schlange.lvl1[i].image.destroy();

            switch(i) {
                case 0:     this.schlange.lvl1[i].image = this.game.add.sprite(x, y, 'spieler');
                            switch(changeId) {
                                case 0: this.schlange.lvl1[i].image.animations.add('walk', [4, 5], 5, true);
                                    break;
                                case 1: this.schlange.lvl1[i].image.animations.add('walk', [10, 11], 5, true);
                                    break;
                                case 2: this.schlange.lvl1[i].image.animations.add('walk', [1, 2], 5, true);
                                    break;
                                case 3: this.schlange.lvl1[i].image.animations.add('walk', [7, 8], 5, true);
                                    break;
                            }
                            this.schlange.lvl1[i].image.animations.play('walk');
                    break;
                case 1:     this.schlange.lvl1[i].image = this.game.add.image(x_alt, y_alt, 'verfolger');
                    break;
                case 2:     this.schlange.lvl1[i].image = this.game.add.image(last_x, last_y, 'verfolger');
            }
        }

    }

}