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
        //this.schlange = schlange;
		
			/**
			* Größe der einzelnen Einheiten
			*/
			this.objektGroesse = 60;

    }

    /** 
    * Startschlange
    * 1 Kopf mit 2 Verfolgern
    */
    //zeichneSchlange() {

        /** Schlange initialisieren */
        //this.schlange.initSchlange();

        /** Durch Schlange iterieren und den Objekten das Entsprechende Sprite zurodnen */
       // for(var i = this.schlange.getLength()-1; i >= 0; i--){
        /*    if(i == 0){
                this.schlange.list[i].image = this.game.add.sprite(this.schlange.list[i].objekt.getPositionX()*this.objektGroesse, this.schlange.list[i].objekt.getPositionY()*this.objektGroesse, this.schlange.list[i].objekt.getTyp());
                this.schlange.list[i].image.frame = 3;
            } else {
                this.schlange.list[i].image = this.game.add.image(this.schlange.list[i].objekt.getPositionX()*this.objektGroesse, this.schlange.list[i].objekt.getPositionY()*this.objektGroesse, this.schlange.list[i].objekt.getTyp());
            }
        }
  
    }*/

    /** 
    * Längenanzeige der Schlange mit DOM
    */
    laengenAnzeige(laenge) {
        var tag = document.getElementById("length");
        tag.innerHTML = laenge;
    }

    /** 
    * Bewegt die Schlange 
    * zu der übergebenen Position
    * @param x : neue x-Koordinate für den Kopf
    * @param y : neue y-Koordinate für den Kopf
    * @param changeId : Id der Richtung der Bewegung um das richtige Sprite zu setzen
    */
   // updatePosition(objekt, changeId) {

        



        ///////////////////// ALT /////////////////////
        /** Koordinaten der Vorgänger speichern 
        // Koordinaten des ehemaligen Vorletzten
        var last_x = this.schlange.lvl1[1].image.world.x; 
        var last_y = this.schlange.lvl1[1].image.world.y;

        // Koordinaten Kopfes vor der Bewegung
        var x_alt = this.schlange.lvl1[0].image.world.x;
        var y_alt = this.schlange.lvl1[0].image.world.y;

        /** Durch alle Schlangenglieder iterieren 
        for(var i = 0; i < this.schlange.lvl1.length; i++) {

            this.schlange.lvl1[i].image.destroy(); // vorherige Sprites löschen

            /** Je nach Schlangenglied Sprite an neuer Position erzeugen 
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

        }*/

   // }
	
	/** Update Position
	Übernimmt ein Objekt, liest dessen Daten aus und zeichnet passend einen Sprite
	@param Objekt das gezeichnet werden soll
	*/
	draw(objekt, kill){
		if(objekt.image != null){
			objekt.image.destroy();
		}
		if(!kill){
			objekt.image = this.game.add.sprite(objekt.positionX*this.objektGroesse, objekt.positionY*this.objektGroesse, objekt.typ);
			if(objekt.typ == 'spieler'){
				objekt.image.frame = 3;
			}
		}
	}

}