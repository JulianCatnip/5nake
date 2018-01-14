import 'pixi';
import 'p2';
import 'phaser';

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////** VIEW **//////////////////////////////////
//////////// Zur Dastellung des Spiels auf dem Canvas oder DOM. /////////////
/////////////////////////////////////////////////////////////////////////////
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
        * Screen für Spielstand-Screens (start, anleitung, pause, gameover)
        */
        this.screen = undefined;

		/**
		* Größe der einzelnen Einheiten
		*/
		this.objektGroesse = 60;

        /**
        * Geschwindigkeit der Animation (Rennen).
        */
        this.frameSpeed = 3;

    }

    /////////////////////////////////////////////////////////////////////////////
    //////////////////////////////** DOM ANZEIGE **//////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Längenanzeige der Schlange mit DOM (ohne Kopf)
    * @param laenge : Anzahl der Verfolger in der Schlange
    */
    laengenAnzeige(laenge) {

        var tag = document.getElementById("length");
        tag.innerHTML = laenge;

    }
    
    /** 
    * Zeitanzeige des Spiels mit DOM.
    * @param seconds : Zeit in Sekunden
    */
    zeitAnzeige(seconds) {

        var tag =  document.getElementById("time");
        var output = '00:00';

        if (seconds >= 0) {
            var m = Math.floor((seconds % 3600) / 60);
            var s = seconds % 60;
            output = this.leadingzero(m) + ':' + this.leadingzero(s);
        }

        tag.innerHTML = output;

    }

    leadingzero(number) {
        return (number < 10) ? '0' + number : number;
    }
    
    /** 
    * Anzeige des Punktestands mit DOM.
    * @param punkte : Punktestand
    */
    punkteAnzeige(punkte) {
        var tag = document.getElementById("points");
        tag.innerHTML = punkte;
    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////////** ZEICHNEN DER EINZELOBJEKTE AUF DEM CANVAS **///////////////
    /////////////////////////////////////////////////////////////////////////////

	/**
    * Zeichnet oder löscht die Sprites der Einzelobjekte.
	* @param objekt : Einzelobjekt, dessen Sprite gezeichnet oder gelöscht werden soll.
    * @param kill : false, falls es gezeichnet, true falls es gelöscht werden soll.
	*/
	draw(objekt, kill){

		if(!kill) { // wenn objekt nicht gelöscht werden soll

            // wenn objekt kein Sprite besitzt
            if(objekt.getImage() == undefined) {

                // Sprite zuordnen
                objekt.setImage(this.game.add.sprite(objekt.getPositionX() * this.objektGroesse, objekt.getPositionY() * this.objektGroesse, objekt.getTyp()));
                this.addAnimation(objekt);

                // Jedes mal wenn für ein Pickup-Objekt ein neues Sprite gezeichnet werden muss
                if(objekt.getTyp() == 'item') {
                    this.frameSpeed += 1; // Framerate erhöhen (Animationsgeschwindigkeit)
                }

            }

            // Wenn Objekt Spieler oder Verfolger ist, muss bei Richtungswechsel die Animation gewechselt werden.
            // Allerdings nur wenn Laufrichtung sich geändert hat.
            if(objekt.getTyp() == 'spieler' && objekt.getChangedDirection() || objekt.getTyp() == 'verfolger' && objekt.getChangedDirection()) {
                this.updateAnimation(objekt); // animation wechseln bei richtungswechsel
            }

            // Wenn Animationsgeschwindigkeit unter 10 ggf. erhöhen bei Typ Verfolger oder Spieler.
            if(this.frameSpeed < 10 && objekt.getTyp() == 'verfolger' || this.frameSpeed < 10 && objekt.getTyp() == 'spieler') {
                this.updateAnimationSpeed(objekt);
            }

            // Das Sprite an die neue Position setzen. 
            objekt.setImageX(objekt.getPositionX() * this.objektGroesse);
            objekt.setImageY(objekt.getPositionY() * this.objektGroesse);

		} else { // wenn objekt gelöscht werden soll

			if(objekt.getImage() != undefined) {
				objekt.destroyImage(); // sprite löschen
                objekt.setImage(undefined); // image ist undefiniert
			}

		}

	}

    /////////////////////////////////////////////////////////////////////////////
    //////////////////////////////** ANIMATIONEN **//////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Animation zuordnen.
    * @param objekt : das Einzelobjekt dem eine Animation zugeordnet werden soll.
    */
    addAnimation(objekt) {

        // Je nach Objekt-Typ eine andere Animation anwenden.
        if(objekt.getTyp() == 'spieler') {

            // dem Objekt mögliche Animationen zuordnen
            objekt.getImage().animations.add('player_walk_up', [1, 2], 5, true);
            objekt.getImage().animations.add('player_walk_right', [4, 5], 5, true);
            objekt.getImage().animations.add('player_walk_down', [7, 8], 5, true);
            objekt.getImage().animations.add('player_walk_left', [10, 11], 5, true);

            // entsprechende animation je nach laufrichtung abspielen
            switch(objekt.getLaufrichtung()) {
                case 'up': objekt.getImage().animations.play('player_walk_up'); // abspielen
                            break;
                case 'right': objekt.getImage().animations.play('player_walk_right'); // abspielen
                            break;
                case 'down': objekt.getImage().animations.play('player_walk_down'); // abspielen
                            break;
                case 'left': objekt.getImage().animations.play('player_walk_left'); // abspielen
                            break;
                default: objekt.getImage().frame = 3; // wenn laufrichtung undefiniert
            }

        } else if(objekt.getTyp() == 'verfolger') {

            // 1 Einzelobjekt bekommt zufälliges Charakter-Design (1 von 4)
            var randomCharacter = objekt.getRandomId();

            // Verfolger hat verschiedene Charakter-Designs
            switch(randomCharacter){

                // Charakter 1
                case 1: this.redAnimation = [
                            objekt.getImage().animations.add('black_walk_up', [1, 2], 5, true),
                            objekt.getImage().animations.add('black_walk_right', [13, 14], 5, true),
                            objekt.getImage().animations.add('black_walk_down', [25, 26], 5, true),
                            objekt.getImage().animations.add('black_walk_left', [37, 38], 5, true)
                        ];

                        switch(objekt.getLaufrichtung()) { // je nach laufrichtung
                            case 'up': objekt.getImage().animations.play('black_walk_up'); // abspielen
                                break;
                            case 'right': objekt.getImage().animations.play('black_walk_right'); // abspielen
                                break;
                            case 'down': objekt.getImage().animations.play('black_walk_down'); // abspielen
                                break;
                            case 'left': objekt.getImage().animations.play('black_walk_left'); // abspielen
                                break;
                            default: objekt.getImage().frame = 12;
                        }
                        break;

                // Charakter 2
                case 2: objekt.getImage().animations.add('red_walk_up', [4, 5], 5, true);
                        objekt.getImage().animations.add('red_walk_right', [16, 17], 5, true);
                        objekt.getImage().animations.add('red_walk_down', [28, 29], 5, true);
                        objekt.getImage().animations.add('red_walk_left', [40, 41], 5, true);

                        switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('red_walk_up');
                                    break;
                            case 'right': objekt.getImage().animations.play('red_walk_right');
                                    break;
                            case 'down': objekt.getImage().animations.play('red_walk_down');
                                    break;
                            case 'left': objekt.getImage().animations.play('red_walk_left');
                                    break;
                            default: objekt.getImage().frame = 15;
                        }
                        break;

                // Charakter 3
                case 3: objekt.getImage().animations.add('blonde_walk_up', [7, 8], 5, true);
                        objekt.getImage().animations.add('blonde_walk_right', [19, 20], 5, true);
                        objekt.getImage().animations.add('blonde_walk_down', [31, 32], 5, true);
                        objekt.getImage().animations.add('blonde_walk_left', [43, 44], 5, true);

                        switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('blonde_walk_up');
                                    break;
                            case 'right': objekt.getImage().animations.play('blonde_walk_right');
                                    break;
                            case 'down': objekt.getImage().animations.play('blonde_walk_down');
                                    break;
                            case 'left': objekt.getImage().animations.play('blonde_walk_left');
                                    break;
                            default: objekt.getImage().frame = 18;
                        }
                        break;

                // Charakter 4
                case 4: objekt.getImage().animations.add('brown_walk_up', [10, 11], 5, true);
                        objekt.getImage().animations.add('brown_walk_right', [22, 23], 5, true);
                        objekt.getImage().animations.add('brown_walk_down', [34, 35], 5, true);
                        objekt.getImage().animations.add('brown_walk_left', [46, 47], 5, true);

                        switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('brown_walk_up');
                                    break;
                            case 'right': objekt.getImage().animations.play('brown_walk_right');
                                    break;
                            case 'down': objekt.getImage().animations.play('brown_walk_down');
                                    break;
                            case 'left': objekt.getImage().animations.play('brown_walk_left');
                                    break;
                            default: objekt.getImage().frame = 21;
                        }

            }

        } else if(objekt.getTyp() == 'feind') {

            // 1 Einzelobjekt bekommt zufälliges Charakter-Design (1 von 4)
            var randomCharacter = objekt.getRandomId();

            // Feind dreht sich und hat 1 zufälliges Aussehen
            switch(randomCharacter) {

                // Charakter 1
                case 1: objekt.getImage().animations.add('black_rotate', [0, 4, 8, 12], 1, true);
                        objekt.getImage().animations.play('black_rotate');
                        break;

                // Charakter 2
                case 2: objekt.getImage().animations.add('red_rotate', [1, 5, 9, 13], 1, true);
                        objekt.getImage().animations.play('red_rotate');
                        break;

                // Charakter 3
                case 3: objekt.getImage().animations.add('blonde_rotate', [2, 6, 10, 14], 1, true);
                        objekt.getImage().animations.play('blonde_rotate');
                        break;

                // Charakter 4
                case 4: objekt.getImage().animations.add('brown_rotate', [3, 7, 11, 15], 1, true);
                        objekt.getImage().animations.play('brown_rotate');

            }

        }

    }

    /**
    * Bei Objekttyp Spieler oder Verfolger muss ggf. die Animation gewechelt werden.
    * @param Objekt dessen Animation gewechselt werden muss.
    */
    updateAnimation(objekt) {

        if(objekt.getTyp() == 'spieler') {

            objekt.getImage().animations.stop(); // animation stoppen

            // animation je nach laufrichtung wechseln
            switch(objekt.getLaufrichtung()) {
                case 'up': objekt.getImage().animations.play('player_walk_up');
                            break;
                case 'right': objekt.getImage().animations.play('player_walk_right');
                            break;
                case 'down': objekt.getImage().animations.play('player_walk_down');
                            break;
                case 'left': objekt.getImage().animations.play('player_walk_left');
                            break;
                default: objekt.getImage().frame = 3;
            }

        } else if(objekt.getTyp() == 'verfolger') {

            // 1 Einzelobjekt bekommt zufälliges Charakter-Design (1 von 4)
            var randomCharacter = objekt.getRandomId();

            objekt.getImage().animations.stop(); // animation stoppen

            // Verfolger hat verschiedene Charakter-Designs 
            switch(randomCharacter){

                // Charakter 1
                case 1: switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('black_walk_up');
                                break;
                            case 'right': objekt.getImage().animations.play('black_walk_right');
                                break;
                            case 'down': objekt.getImage().animations.play('black_walk_down');
                                break;
                            case 'left': objekt.getImage().animations.play('black_walk_left');
                                break;
                            default: objekt.getImage().frame = 12;
                        }
                        break;

                // Charakter 2
                case 2: switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('red_walk_up');
                                    break;
                            case 'right': objekt.getImage().animations.play('red_walk_right');
                                    break;
                            case 'down': objekt.getImage().animations.play('red_walk_down');
                                    break;
                            case 'left': objekt.getImage().animations.play('red_walk_left');
                                    break;
                            default: objekt.getImage().frame = 15;
                        }
                        break;

                // Charakter 3
                case 3: switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('blonde_walk_up');
                                    break;
                            case 'right': objekt.getImage().animations.play('blonde_walk_right');
                                    break;
                            case 'down': objekt.getImage().animations.play('blonde_walk_down');
                                    break;
                            case 'left': objekt.getImage().animations.play('blonde_walk_left');
                                    break;
                            default: objekt.getImage().frame = 18;
                        }
                        break;

                // Charakter 4
                default: switch(objekt.getLaufrichtung()) {
                            case 'up': objekt.getImage().animations.play('brown_walk_up');
                                    break;
                            case 'right': objekt.getImage().animations.play('brown_walk_right');
                                    break;
                            case 'down': objekt.getImage().animations.play('brown_walk_down');
                                    break;
                            case 'left': objekt.getImage().animations.play('brown_walk_left');
                                    break;
                            default: objekt.getImage().frame = 21;
                        }

            }

        }

        objekt.setChangedDirection(false); // Abfrage ob Animation geändert werden muss auf false (da nun angepasst)

    }

    /**
    * Animationsgeschwindigkeit erhöhen.
    * @param objekt : Einzelobjekt dessen Animationsgeschwindigkeit erhöht werden soll.
    */
    updateAnimationSpeed(objekt) {
        if(objekt.getImage().animations.currentAnim != null) { // wenn Animation vorhanden
            objekt.getImage().animations.currentAnim.speed = this.frameSpeed;
        }
    }

    /**
    * Animationsgeschwindigkeit zurücksetzen.
    */
    resetAnimationSpeed() {
        this.frameSpeed = 3;
    }

    /**
    * Stoppt die Animation eines Objektes.
    * @param objekt : Einzelobjekt dessen Animation gestoppt werden soll.
    */
    stopAnimation(objekt) {
        if(objekt.getImage() != undefined){
            objekt.getImage().animations.stop();
        }
    }

    /** 
    * Gibt eine zufällige zahl von .. bis zurück. 
    * (Für die zufällige Zuordnung der Character-Designs)
    * @param min, max : von bis
    * @return zufällige zahl von bis
    */
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // random 1-4
    }

    /////////////////////////////////////////////////////////////////////////////
    //////////////////////////** SPIEL-STAND SCREENS **//////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Zeichnet Start-Screen.
    */
    drawStartScreen() {
        if(this.screen == undefined) {
            this.screen = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'startscreen');
            this.screen.anchor.set(0.5); // in die Mitte setzen
        }
    }

    /**
    * Zeichnet Anleitungs-Screen.
    */
    drawManualScreen() {
        if(this.screen == undefined) {
            this.screen = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'anleitung');
            this.screen.anchor.set(0.5);
        }
    }

	/**
	* Zeichnet Pause-Screen.
    */
	drawPauseScreen() {
		if(this.screen == undefined) {
            this.screen = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pause');
            this.screen.anchor.set(0.5);
        }
	}

    /**
    * Zeichnet Gameover-Screen.
    */
    drawGameOverScreen() {
        if(this.screen == undefined) {
            this.screen = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gameover');
            this.screen.anchor.set(0.5);
        }
    }

    /** 
    * Löscht Bild- oder Text-Screens vom Canvas.
    */
    removeContent() {
        if(this.screen != undefined) {
            this.screen.destroy();
            this.screen = undefined;
        }
    }

}
