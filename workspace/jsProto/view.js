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

        this.frameSpeed = 3;

        this.redAnimation = [];

        this.gameover_picture;

    }

    /**
    * Längenanzeige der Schlange mit DOM
    */
    laengenAnzeige(laenge) {
        var tag = document.getElementById("length");
        tag.innerHTML = laenge;
    }
    
    leadingzero (number) {
    return (number < 10) ? '0' + number : number;
    }
    
    /** 
    * Zeitanzeige des Spiels mit DOM
    @param time: Zeit in Sekunden
    */
    zeitAnzeige(seconds){
        var tag =  document.getElementById("time");
        var output = '00:00';
        if (seconds >= 0) {
          var m = Math.floor((seconds % 3600) / 60);
          var s = seconds % 60;
            output=
            this.leadingzero(m) + ':' +
            this.leadingzero(s);
        }
       tag.innerHTML = output;
    }
    
    
    /** 
    * Anzeige des Punktestands mit DOM
    */
    punkteAnzeige(punkte) {
        var tag = document.getElementById("points");
        tag.innerHTML = punkte;
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

		if(!kill) { // wenn objekt nicht gelöscht werden sollte

            // wenn objekt kein Sprite besitzt
            if(objekt.image == undefined) {

                // Sprite zuordnen
                objekt.image = this.game.add.sprite(objekt.getPositionX() * this.objektGroesse, objekt.getPositionY() * this.objektGroesse, objekt.typ);
                this.addAnimation(objekt);

                // jedes mal wenn für ein Pickup objekt ein neues bild gezeichnet werden muss
                if(objekt.typ == 'item') {
                    this.frameSpeed += 1; // framerate erhöhen
                    console.log(this.frameSpeed);
                }

            }

            // wenn objekt spieler oder verfolger ist, müssen bei richtungswechsel die frames geändert werden
            // allerdings nur nötig wenn laurichtung sich geändert hat (!!??)
            if(objekt.typ == 'spieler' && objekt.changedDirection || objekt.typ == 'verfolger' && objekt.changedDirection) {
                this.updateAnimation(objekt); // animation wechseln bei richtungswechsel
            }

            if(this.frameSpeed < 10 && objekt.typ == 'verfolger' || this.frameSpeed < 10 && objekt.typ == 'spieler') {
                this.updateAnimationSpeed(objekt);
            }

            // Das Sprite an die neue Position setzen 
            objekt.image.x = objekt.getPositionX() * this.objektGroesse;
            objekt.image.y = objekt.getPositionY() * this.objektGroesse;

		} else { // wenn objekt gelöscht statt gezeichnet werden soll

			if(objekt.image != undefined) {
				objekt.image.destroy(); // sprite löschen
                objekt.image = undefined; // image ist undefiniert
			}

		}
	}

    addAnimation(objekt) {

        /** Je nach Objekt-Typ andere Animation anwenden */
        if(objekt.typ == 'spieler') {

            // dem Objekt mögliche Animationen zuordnen
            objekt.image.animations.add('player_walk_up', [1, 2], 5, true);
            objekt.image.animations.add('player_walk_right', [4, 5], 5, true);
            objekt.image.animations.add('player_walk_down', [7, 8], 5, true);
            objekt.image.animations.add('player_walk_left', [10, 11], 5, true);

            // entsprechende animation je nach laufrichtung abspielen
            switch(objekt.laufrichtung) {
                case 'up': objekt.image.animations.play('player_walk_up'); // abspielen
                            break;
                case 'right': objekt.image.animations.play('player_walk_right'); // abspielen
                            break;
                case 'down': objekt.image.animations.play('player_walk_down'); // abspielen
                            break;
                case 'left': objekt.image.animations.play('player_walk_left'); // abspielen
                            break;
                default: objekt.image.frame = 3; // wenn laufrichtung undefiniert
            }

        } else if(objekt.typ == 'verfolger') {

            /** 1 Einzelobjekt bekommt zufälliges Charakter-Design (1 von 4) */
            var randomCharacter = objekt.getRandomId();

            /** Verfolger hat verschiedene Charakter-Designs */
            switch(randomCharacter){
                // Charakter 1
                case 1: this.redAnimation = [
                            objekt.image.animations.add('black_walk_up', [1, 2], 5, true),
                            objekt.image.animations.add('black_walk_right', [13, 14], 5, true),
                            objekt.image.animations.add('black_walk_down', [25, 26], 5, true),
                            objekt.image.animations.add('black_walk_left', [37, 38], 5, true)
                        ];

                        switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('black_walk_up'); // abspielen
                                break;
                            case 'right': objekt.image.animations.play('black_walk_right'); // abspielen
                                break;
                            case 'down': objekt.image.animations.play('black_walk_down'); // abspielen
                                break;
                            case 'left': objekt.image.animations.play('black_walk_left'); // abspielen
                                break;
                            default: objekt.image.frame = 12;
                        }
                        break;
                // Charakter 2
                case 2: objekt.image.animations.add('red_walk_up', [4, 5], 5, true);
                        objekt.image.animations.add('red_walk_right', [16, 17], 5, true);
                        objekt.image.animations.add('red_walk_down', [28, 29], 5, true);
                        objekt.image.animations.add('red_walk_left', [40, 41], 5, true);

                        switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('red_walk_up');
                                    break;
                            case 'right': objekt.image.animations.play('red_walk_right');
                                    break;
                            case 'down': objekt.image.animations.play('red_walk_down');
                                    break;
                            case 'left': objekt.image.animations.play('red_walk_left');
                                    break;
                            default: objekt.image.frame = 15;
                        }
                        break;
                // Charakter 3
                case 3: objekt.image.animations.add('blonde_walk_up', [7, 8], 5, true);
                        objekt.image.animations.add('blonde_walk_right', [19, 20], 5, true);
                        objekt.image.animations.add('blonde_walk_down', [31, 32], 5, true);
                        objekt.image.animations.add('blonde_walk_left', [43, 44], 5, true);

                        switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('blonde_walk_up');
                                    break;
                            case 'right': objekt.image.animations.play('blonde_walk_right');
                                    break;
                            case 'down': objekt.image.animations.play('blonde_walk_down');
                                    break;
                            case 'left': objekt.image.animations.play('blonde_walk_left');
                                    break;
                            default: objekt.image.frame = 18;
                        }
                        break;
                // Charakter 4
                case 4: objekt.image.animations.add('brown_walk_up', [10, 11], 5, true);
                        objekt.image.animations.add('brown_walk_right', [22, 23], 5, true);
                        objekt.image.animations.add('brown_walk_down', [34, 35], 5, true);
                        objekt.image.animations.add('brown_walk_left', [46, 47], 5, true);

                        switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('brown_walk_up');
                                    break;
                            case 'right': objekt.image.animations.play('brown_walk_right');
                                    break;
                            case 'down': objekt.image.animations.play('brown_walk_down');
                                    break;
                            case 'left': objekt.image.animations.play('brown_walk_left');
                                    break;
                            default: objekt.image.frame = 21;
                        }
            }

        } else if(objekt.typ == 'feind') {

            /** 1 Einzelobjekt bekommt zufälliges Charakter-Design (1 von 4) */
            var randomCharacter = objekt.getRandomId();

            /** 1 Charakter-Design wechselt zufällig in 1 von 4 Frames */
            //var random = this.getRandom(1, 4);

            /** Feind dreht sich und hat 1 zufälliges Aussehen  */
            switch(randomCharacter) {
                // Charakter 1
                case 1: objekt.image.animations.add('black_rotate', [0, 4, 8, 12], 1, true);
                        objekt.image.animations.play('black_rotate');
                        break;
                // Charakter 2
                case 2: objekt.image.animations.add('red_rotate', [1, 5, 9, 13], 1, true);
                        objekt.image.animations.play('red_rotate');
                        break;
                // Charakter 3
                case 3: objekt.image.animations.add('blonde_rotate', [2, 6, 10, 14], 1, true);
                        objekt.image.animations.play('blonde_rotate');
                        break;
                // Charakter 4
                case 4: objekt.image.animations.add('brown_rotate', [3, 7, 11, 15], 1, true);
                        objekt.image.animations.play('brown_rotate');
            }

        }

    }

    updateAnimation(objekt) {

        if(objekt.typ == 'spieler') {

            objekt.image.animations.stop();

            // animation je nach laufrichtung wechseln
            switch(objekt.laufrichtung) {
                case 'up': objekt.image.animations.play('player_walk_up');
                            break;
                case 'right': objekt.image.animations.play('player_walk_right');
                            break;
                case 'down': objekt.image.animations.play('player_walk_down');
                            break;
                case 'left': objekt.image.animations.play('player_walk_left');
                            break;
                default: objekt.image.frame = 3;
            }

        } else if(objekt.typ == 'verfolger') {

            /** 1 Einzelobjekt bekommt zufälliges Charakter-Design (1 von 4) */
            var randomCharacter = objekt.getRandomId();

            objekt.image.animations.stop();

            /** Verfolger hat verschiedene Charakter-Designs */
            switch(randomCharacter){
                // Charakter 1
                case 1: switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('black_walk_up');
                                break;
                            case 'right': objekt.image.animations.play('black_walk_right');
                                break;
                            case 'down': objekt.image.animations.play('black_walk_down');
                                break;
                            case 'left': objekt.image.animations.play('black_walk_left');
                                break;
                            default: objekt.image.frame = 12;
                        }
                        break;
                // Charakter 2
                case 2: switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('red_walk_up');
                                    break;
                            case 'right': objekt.image.animations.play('red_walk_right');
                                    break;
                            case 'down': objekt.image.animations.play('red_walk_down');
                                    break;
                            case 'left': objekt.image.animations.play('red_walk_left');
                                    break;
                            default: objekt.image.frame = 15;
                        }
                        break;
                // Charakter 3
                case 3: switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('blonde_walk_up');
                                    break;
                            case 'right': objekt.image.animations.play('blonde_walk_right');
                                    break;
                            case 'down': objekt.image.animations.play('blonde_walk_down');
                                    break;
                            case 'left': objekt.image.animations.play('blonde_walk_left');
                                    break;
                            default: objekt.image.frame = 18;
                        }
                        break;
                // Charakter 4
                default: switch(objekt.laufrichtung) {
                            case 'up': objekt.image.animations.play('brown_walk_up');
                                    break;
                            case 'right': objekt.image.animations.play('brown_walk_right');
                                    break;
                            case 'down': objekt.image.animations.play('brown_walk_down');
                                    break;
                            case 'left': objekt.image.animations.play('brown_walk_left');
                                    break;
                            default: objekt.image.frame = 21;
                        }
            }
        }

        //objekt.image.animations.speed = this.frameSpeed;
        objekt.changedDirection = false;
    }

    updateAnimationSpeed(objekt) {
        if(objekt.image.animations.currentAnim != null) {
            objekt.image.animations.currentAnim.speed = this.frameSpeed;
        }
    }

    /**
    * Stoppt die Animation eines Objektes
    */
    stopAnimation(objekt) {
        if(objekt.image != undefined){
            objekt.image.animations.stop();
        }
    }

    /**
    * Zeichnet Startbildschirm der auf enter Knopfdruck verschwindet
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

    resetAnimationSpeed() {
        this.frameSpeed = 3;
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

    /** Gibt eine zufällige zahl von .. bis zurück */
    getRandom(min, max) {
        // random 1-4
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}
