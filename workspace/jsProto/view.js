import 'pixi';
import 'p2';
import 'phaser';

import { Schlange } from './schlange';

/** 
* View
* Zur Dastellung des Spiels auf dem Canvas
*/
export default class View {

    /**
    * Constructor
    * @param game : Phaser.Game-Objekt
    * @param schlange : Schlangen-Objekt
    */
	constructor(game, schlange) {

        /** 
        * Phaser.Game Objekt 
        * Wird benötigt um auf jegliche Funktionen des Frameworks zuzugreifen.
        */
        this.game = game;

        /**
        * Schlangen-Objekt
        */
        this.schlange = schlange;

        /**
        * Der Spieler (und alle anderen Einzelobjekte sind 60x60 groß)
        */
        this.objektGroesse = 60;

        /**
        * Startpunkt der Schlange P(60;60)
        */
        this.startX = this.objektGroesse;
        this.startY = this.objektGroesse;

    }

    /** 
    * LVL 1 Startschlange
    * 1 Kopf mit 2 Verfolgern
    */
    zeichneSchlange_LVL1() {

        this.schlange.lvl1[2].image = this.game.add.image(this.startX, this.startY, 'verfolger'); // 2. Verfolger
        this.schlange.lvl1[1].image = this.game.add.image(this.startX + this.objektGroesse, this.startY, 'verfolger'); // 1. Verfolger

        this.schlange.lvl1[0].image = this.game.add.sprite(this.startX + (2 * this.objektGroesse), this.startY, 'spieler'); // Kopf
        this.schlange.lvl1[0].image.frame = 3; // Kopf-Sprite schaut nach rechts
  
    }

    /** 
    * Bewegt die Schlange 
    * zu der übergebenen Position
    * @param x : neue x-Koordinate für den Kopf
    * @param y : neue y-Koordinate für den Kopf
    * @param changeId : Id der Richtung der Bewegung um das richtige Sprite zu setzen
    */
    updatePosition(x, y, changeId) {

        /** Koordinaten der Vorgänger speichern */
        // Koordinaten des ehemaligen Vorletzten
        var last_x = this.schlange.lvl1[1].image.world.x; 
        var last_y = this.schlange.lvl1[1].image.world.y;

        // Koordinaten Kopfes vor der Bewegung
        var x_alt = this.schlange.lvl1[0].image.world.x;
        var y_alt = this.schlange.lvl1[0].image.world.y;

        /** Durch alle Schlangenglieder iterieren */
        for(var i = 0; i < this.schlange.lvl1.length; i++) {

            this.schlange.lvl1[i].image.destroy(); // vorherige Sprites löschen

            /** Je nach Schlangenglied Sprite an neuer Position erzeugen */
            switch(i) {
                case 0:     this.schlange.lvl1[i].image = this.game.add.sprite(x, y, 'spieler');

                            // Animation: Wechselt Sprite bei Richtungswechsel
                            switch(changeId) {
                                case 0: this.schlange.lvl1[i].image.animations.add('walk', [4, 5], 5, true);
                                    break;
                                case 1: this.schlange.lvl1[i].image.animations.add('walk', [10, 11], 5, true);
                                    break;
                                case 2: this.schlange.lvl1[i].image.animations.add('walk', [1, 2], 5, true);
                                    break;
                                case 3: this.schlange.lvl1[i].image.animations.add('walk', [7, 8], 5, true);
                            }

                            // Animation abspielen
                            this.schlange.lvl1[i].image.animations.play('walk');

                    break;

                case 1:     this.schlange.lvl1[i].image = this.game.add.image(x_alt, y_alt, 'verfolger');

                    break;

                case 2:     this.schlange.lvl1[i].image = this.game.add.image(last_x, last_y, 'verfolger');
            }

        }

    }

}