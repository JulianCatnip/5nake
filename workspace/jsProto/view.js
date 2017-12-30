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
		
		 /** Text für tot und PauseScreen */
			this.text = undefined;

        /**
        * Schlangen-Objekt
        */
		
			/**
			* Größe der einzelnen Einheiten
			*/
			this.objektGroesse = 60;
        
        /** Text für Game-Over, vorübergehend */
            this.gameOverText = undefined;
        
        this.gameover_picture;
        
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
		if(!kill){
			if(objekt.image != undefined){
				//oldx = objekt.image.x;
				//oldy = objekt.image.y;
				//Alten Sprite löschen
				objekt.image.destroy();
			}
			objekt.image = this.game.add.sprite(objekt.getPositionX()*this.objektGroesse,objekt.getPositionY()*this.objektGroesse,objekt.typ);
			
			///// TODO: RICHTIGE ANIMATION ABSPIELEN ////
			if(objekt.typ == 'spieler'){
				objekt.image.frame = 3;
			}
		} else {
			if(objekt.image != undefined){
				objekt.image.destroy();
			}
		}
	}
    
	/**
	Zeichnet Pausebildschirm der auf down Knopfdruck verschwindet*/
	drawPauseScreen(){
		if(this.text == undefined){
		this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- Press DOWN to Continue -");
		//  Centers the text
    	this.text.anchor.set(0.5);
    	this.text.align = 'center';

    	//  Our font + size
    	this.text.font = 'Arial';
    	this.text.fontWeight = 'bold';
    	this.text.fontSize = 30;
    	this.text.fill = '#101010';
		}
	}
	
	/** Lässt text verschwinden */
	removeText(){
		this.game.world.remove(this.text);
	}

    /**
    Schreibt bei Kollision game over auf den screen
    */
    drawGameOverText() {
        if (this.gameOverText == undefined) {
                this.gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- GAME OVER -");
                //  Centers the text
                this.gameOverText.anchor.set(0.5);
                this.gameOverText.align = 'center';

                //  Our font + size
                this.gameOverText.font = 'Arial';
                this.gameOverText.zIndex = 10;
                this.gameOverText.fontWeight = 'bold';
                this.gameOverText.fontSize = 30;
                this.gameOverText.fill = '#FF0000';
            }
    }
    
    /** Lässt text verschwinden */
	removeGOText(){
		this.game.world.remove(this.gameOverText);
	}
    
    
    zeichneGOScreen(){
        this.gameover_picture = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'go_screen');
        this.gameover_picture.anchor.setTo(0.5, 0.5);

    //  Here we'll create a basic timed event. This is a one-off event, it won't repeat or loop:
    //  The first parameter is how long to wait before the event fires. In this case 4 seconds (you could pass in 4000 as the value as well.)
    //  The next parameter is the function to call ('fadePicture') and finally the context under which that will happen.

        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.fadePicture, this);
    }
    
    fadePicture() {

        //this.game.add.tween(this.gameover_picture).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this.gameover_picture).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);

    }
    
}