import 'pixi';
import 'p2';
import 'phaser';

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
        * Text für tot und PauseScreen
        */
        this.text = undefined;

		/**
		* Größe der einzelnen Einheiten
		*/
		this.objektGroesse = 60;

        this.gameover_picture;

    }

    /**
    * Längenanzeige der Schlange mit DOM
    */
    laengenAnzeige(laenge) {
        var tag = document.getElementById("length");
        tag.innerHTML = laenge;
    }

	/**
    * Zeichet Objekte
    * Übernimmt ein Objekt, liest dessen Daten aus
    * löscht ggf. vorhandenen Sprite und zeichnet einen neuen Sprite an passender Stelle
	* @param Objekt das gezeichnet werden soll
    * @param kill, überprüfung ob es gelöscht wurde
    * @param richtung, blickrichtung des objekts
	*/
	draw(objekt, kill){

		if(!kill) { // wenn objekt nicht gelöscht wurde

			if(objekt.image != undefined){ // wenn objekt bereits ein Sprite besitzt
				//oldx = objekt.image.x;
				//oldy = objekt.image.y;
				//Alten Sprite löschen
				objekt.image.destroy(); // Sprite löschen
			}

            /** Dem Objekt ein Sprite hinzufügen */
			objekt.image = this.game.add.sprite(objekt.getPositionX() * this.objektGroesse, objekt.getPositionY() * this.objektGroesse, objekt.typ);

            /** Je nach Objekt-Typ andere Animation anwenden */
			if(objekt.typ == 'spieler' || objekt.typ == 'verfolger') {

                // animation je nach laufrichtung wechseln
                switch(objekt.laufrichtung) {
                    case 'up': objekt.image.animations.add('walk', [1, 2], 5, true);
                            break;
                    case 'right': objekt.image.animations.add('walk', [4, 5], 5, true);
                            break;
                    case 'down': objekt.image.animations.add('walk', [7, 8], 5, true);
                            break;
                    case 'left': objekt.image.animations.add('walk', [10, 11], 5, true);
                            break;
                    default: objekt.image.frame = 3;
                }
                objekt.image.animations.play('walk');

			} else if(objekt.typ == 'feind') {

                // random 1-4
                var random = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

                /** Feind blickt in zufällige Richtungen */
                switch(random){
                    case 1: objekt.image.frame = 3;
                        break;
                    case 2: objekt.image.frame = 6;
                        break;
                    case 3: objekt.image.frame = 9;
                        break;
                    default: objekt.image.frame = 0;
                }

            }

		} else { // wenn objekt gelöscht wurde

			if(objekt.image != undefined) { // sprite löschen
				objekt.image.destroy();
			}

		}
	}

    /**
    * Stoppt die Animation eines Objektes
    */
    stopAnimation(objekt) {
        objekt.image.animations.stop('walk', false);
    }

    /**
    * Zeichnet STartbildschirm der auf enter Knopfdruck verschwindet
    */
    drawStartScreen() {

        if(this.text == undefined) {

            this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- START -\nPress ENTER to Start");
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

	/**
	* Zeichnet Pausebildschirm der auf down Knopfdruck verschwindet
    */
	drawPauseScreen() {

		if(this.text == undefined) {

            this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- PAUSED -\nUse CURSOR to Continue");
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

    /**
    * Schreibt bei Kollision game over auf den screen
    */
    drawGameOverText() {

        if (this.text == undefined) {

            this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- GAME OVER -\nPress ENTER to Restart");
            //  Centers the text
            this.text.anchor.set(0.5);
            this.text.align = 'center';

            //  Our font + size
            this.text.font = 'Arial';
            //this.text.zIndex = 10;
            this.text.fontWeight = 'bold';
            this.text.fontSize = 30;
            this.text.fill = '#101010';
        }

    }

    /** Lässt text verschwinden */
    removeText() {
        // this.game.world.remove(this.text);
        this.text.destroy();
        this.text = undefined;
    }

    /** 
    Lässt text verschwinden
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

    } */

}
