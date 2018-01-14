import 'pixi';
import 'p2';
import 'phaser';

import { View } from './view';
import { Sound } from './sound';
import { Schlange } from './schlange';
import { Einzelobjekt} from './einzelobjekt';
import { Gegner } from './gegner';

/////////////////////////////////////////////////////////////////////////////
//////////////////////////////** CONTROLLER **///////////////////////////////
/////////////////////// Steuert Objekte und Anzeige. ////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default class Controller {

    /**
    * Constructor
    * @param game : Phaser.Game-Objekt
    * @param view : View-Objekt
    * @param sound : Sound-Objekt
    * @param canvasWidth : Canvas-Breite
    * @param canvasHeight : Canvas-Höhe
    */
	constructor(game, view, sound, canvasWidth, canvasHeight) {

        /**
        * Phaser.Game Objekt
        * Wird benötigt um auf jegliche Funktionen des Frameworks zuzugreifen.
        */
        this.game = game;

        /**
        * View-Objekt
        */
		this.view = view;

		/**
        * Sound-Objekt
        */
		this.sound = sound;

        /**
        * Größe eines Einzelobjektes
        */
	  	this.objektGroesse = 60; // 60 x 60 px

        /** 
        * Punktestand 
        */
        this.score = 0;

        /**
        * Canvas Höhe und Breite umgerechnet in Einheiten.
        */
		this.canvasWidth = canvasWidth / this.objektGroesse; // Pixelbreite des Canvas wird in Einheiten aufgeteilt (15 Einheiten)
		this.canvasHeight = canvasHeight / this.objektGroesse; // Pixelhöhe des Canvas wird in Einheiten aufgeteilt (11 Einheiten)

        /**
        * Richtungen
        */
		this.richtungen = Object.freeze({up: 0, down: 1, right: 2, left: 3}); // freeze: verhindert das Hinzufügen von neuen Eigenschaften zum Objekt

        /**
        * Aktuelle Laufrichtung der Schlange
        */
        this.laufrichtung = this.richtungen.right;

		/**
		* Ob Laufrichtung in diesem Intervall noch geändert werden darf.
		*/
		this.laufrichtungsIntervall = true;

		/**
		* Schlangen-Objektliste
		*/
		let Schlange = require('./schlange.js').default;
		this.schlange = new Schlange();

		/**
		* Gegner-Objektliste
		*/
		let Gegner = require('./gegner.js').default;
		this.gegner = new Gegner(this.canvasWidth, this.canvasHeight, 'feind'); // Canvashöhe und -breite werden für die Berechnung der zufälligen Position übergeben.

		/**
		* Pickup-Objektliste
		*/
		this.pickup = new Gegner(this.canvasWidth, this.canvasHeight, 'item');

    }


    /////////////////////////////////////////////////////////////////////////////
	/////////////////////////////** KEYBOARD KEYS **/////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

    /** 
    * Enfernt Browser-Voreinstellungen zu den Eingabentasten.
    */
    resetKeyboardKeys() {
    	this.game.input.keyboard.addKeyCapture(
    		[ 
    			Phaser.Keyboard.LEFT, 
    			Phaser.Keyboard.RIGHT, 
    			Phaser.Keyboard.UP, 
    			Phaser.Keyboard.DOWN, 
    			Phaser.Keyboard.SPACEBAR, 
    			Phaser.Keyboard.ENTER 
    		]
    	);
    }

    /** Getter für die Cursor-Keys */
    getCursor() {
        return this.game.input.keyboard.createCursorKeys();
    }

    /** Getter für den P-Key */
    getPauseKey() {
        return this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    }

    /** Getter für den Enter-Key */
    getEnterKey() {
        return this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    }

    /** Getter für den A-Key */
    getManualKey() {
        return this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    }

    /** Getter für den S-Key */
    getStartKey() {
        return this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    }

    /** Getter für die Laufrichtung des Spielers */
    getLaufrichtung() {
    	return this.laufrichtung;
    }

    /////////////////////////////////////////////////////////////////////////////
	///////////////////////////////** SOUND **///////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

    /** Sound hinzufügen */
    createSound() {
    	this.sound.addMusic(); // Sound initialisieren
    	this.sound.play(); // Start-Soundtrack abspielen
    }

    /////////////////////////////////////////////////////////////////////////////
	///////////////////////////** SPIEL-STATUS **////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

    /**
	* Aktionen beim Start-Status.
	* Blendet den Start-Screen ein.
	*/
	started() {
		this.view.drawStartScreen(); // Start-Screen zeichnen
	}

	/** 
	* Aktionen beim Spiel-Status.
	* @param gamestatus : Spiel-Status
	*/
	played(gamestatus) {

		this.view.removeContent(); // vorherigen Screen löschen

		if(gamestatus == 'play') { // beim Spiel-Status 'play'
			this.sound.restart(gamestatus); // startet Play-Soundtrack neu
		} 
		else if(gamestatus == 'paused'){ // andenfalls bei Spiel-Status 'paused'
			this.sound.pause(gamestatus); // Pausen-Soundtrack pausieren
			this.sound.resume('play'); // Play-Soundtrack weiterspielen
		}

	}	

	/**
	* Aktionen beim Pause-Status.
	* @param oldSound : Soundtrack der pausiert werden soll.
	*/
	paused(oldSound) {

		this.view.drawPauseScreen(); // blendet den Pause-Screen ein
		this.sound.pause(oldSound); // pausiert Play-Soundtack
		this.sound.paused(); // Pausen-Soundtrack abspielen

	}

	/**
	* Aktionen beim Start-Status zur Darstellung der Anleitung.
	*/
	zeigeAnleitung() {
		this.view.removeContent(); // vorherigen Screen löschen
		this.view.drawManualScreen(); // blendet den Anleitungs-Screen ein
	}

	/** 
	* Animation der Sprites von Gegner und Schlange stoppen.
	*/
	stopAnimation() {

		// Durch Schlangen-Liste iterieren und deren Animation von View stoppen lassen.
		for(var i = 0; i < this.schlange.getLength(); i++){
			this.view.stopAnimation(this.schlange.getList()[i]);
		}

		// Durch Gegner-Liste iterieren und deren Animationen von View stoppen lassen.
		for(var i = 0; i < this.gegner.getLength(); i++){
			this.view.stopAnimation(this.gegner.getList()[i]);
		}

	}

	/** 
	* Aktionen im Play-Status sobald eine Kollision stattgefunden hat.
	* @param oldSound : Soundtrack der gestoppt werden soll.
	*/
	died(oldSound) {

		this.view.drawGameOverScreen(); // Gameover-Screen darstellen
		this.sound.stop(oldSound); // stoppt Play-Soundtrack
		this.sound.gameover(); // startet Geameover-Soundtrack

	}

	/**
	* Aktionen beim Gameover(dead)-Status
	* Löscht ALLE Sprites in den Objekt-Listen (Gegner, Items, Schlange).
	*/
	gameover() {

		// Durch Schlangen-Liste iterieren und deren Sprites löschen
		for(var i = 0; i < this.schlange.getLength(); i++){
			this.view.draw(this.schlange.getList()[i], true); // Sprite löschen (kill == true)
		}

		// Durch Gegner-Liste iterieren und deren Images löschen
		for(var i = 0; i < this.gegner.getLength(); i++){
			this.view.draw(this.gegner.getList()[i], true); // Sprite löschen (kill == true)
		}

		// Durch Item-Liste iterieren und deren Images löschen
		for(var i = 0; i < this.pickup.getLength(); i++){
			this.view.draw(this.pickup.getList()[i], true); // Sprite löschen (kill == true)
		}

	}

	/** 
	* Setzt Variablen auf ihre Anfangswerte zurück oder initialisiert diese neu.
	* @param seconds : Zeitwert auf den die Zeit-Anzeige zurückgesetzt wird
	*/
	reset(seconds) {
		
        this.view.removeContent(); // Gameover-Screen löschen
        this.view.zeitAnzeige(seconds); // Zeitanzeige auf 0 setzen
        this.view.resetAnimationSpeed(); // Animationsgeschwindigkeit zurücksetzen

        this.sound.reset(); // Sound zurücksetzen
        this.createSound(); // Sound initialisieren

        this.laufrichtung = this.richtungen.right; // Laufrichtung zurücksetzen
        this.score = 0; // Punktestand zurücksetzen

		// Neue Schlange initialisieren
		let Schlange = require('./schlange.js').default;
		this.schlange = new Schlange();

		// Startposition setzen
		this.schlange.startX = 1;
		this.schlange.startY = 1;
        
        // Neue Gegner-Liste initialisieren
        let Gegner = require('./gegner.js').default;
		this.gegner = new Gegner(this.canvasWidth, this.canvasHeight, 'feind');

        this.spawnKollisionVerhindern(); // Verhindern, dass übereinander gespawned wird
        
    }

    /////////////////////////////////////////////////////////////////////////////
	////////////////////////** BEWEGUNG DER SCHLANGE *///////////////////////////
	/////////////////////////////////////////////////////////////////////////////

    /**
    * Ändert die Laufrichtung bei Verwendung des Cursors
    */
    updateLaufrichtung() {

		// Überprüft ob Laufrichtung in diesem Zeichenintervall bereits geändert wurde
		if(this.laufrichtungsIntervall){

			if (this.getCursor().right.isDown && this.laufrichtung != this.richtungen.left) {
            	this.laufrichtung = this.richtungen.right; // richtung rechts
				this.laufrichtungsIntervall = false;
			}

        	if (this.getCursor().left.isDown && this.laufrichtung != this.richtungen.right) {
        		this.laufrichtung = this.richtungen.left; // richtung links
        		this.laufrichtungsIntervall = false;
        	}

        	if (this.getCursor().up.isDown && this.laufrichtung != this.richtungen.down) {
        		this.laufrichtung = this.richtungen.up; // richtung oben
        		this.laufrichtungsIntervall = false;
        	}

        	if (this.getCursor().down.isDown && this.laufrichtung != this.richtungen.up) {
        		this.laufrichtung = this.richtungen.down; // richtung unten
        		this.laufrichtungsIntervall = false;
        	}

        }

    }

    /**
    * Aus der derzeitigen Position werden neue Koordinaten berechnet (von 1 Schritt weiter)
    * und an der neu berechneten Position ein neuer Kopf erzeugt.
    */
    bewegeSchlange() {

		let kopf = this.schlange.getList()[0]; // Kopf-Objekt der Schlange speichern

        // Setzen der neuen Koordinaten
        if (this.laufrichtung == this.richtungen.right) { // wenn richtung rechts ist
			this.schlange.move(kopf.getPositionX() + 1, kopf.getPositionY());
			this.schlange.updateObjektLaufrichtung('right');
        } 
        else if (this.laufrichtung == this.richtungen.left) { // wenn richtung links ist
            this.schlange.move(kopf.getPositionX() - 1, kopf.getPositionY());
            this.schlange.updateObjektLaufrichtung('left');
        } 
        else if (this.laufrichtung == this.richtungen.up) { // wenn richtung oben ist
            this.schlange.move(kopf.getPositionX(), kopf.getPositionY() - 1);
            this.schlange.updateObjektLaufrichtung('up');
        } 
        else if (this.laufrichtung == this.richtungen.down) { // wenn richtung unten ist
            this.schlange.move(kopf.getPositionX(), kopf.getPositionY() + 1);
            this.schlange.updateObjektLaufrichtung('down');
        }

        /**
        * Schlange läuft gegen den Rand des Canvas und kommt
        * an der anderen Seite wieder raus.
        */
        if (kopf.getPositionX() <= 0 - 1) { // wenn x position kleiner/gleich 0 - spielerbreite ist
            kopf.setPositionX(this.canvasWidth - 1); // position x = canvas-breite - spielerbreite
        } 
        else if (kopf.getPositionX() >= this.canvasWidth) { // wenn position x größer als canvas-breite
            kopf.setPositionX(0);
        } 
        else if (kopf.getPositionY() <= 0 - 1) { // wenn position y kleiner/gleich 0 - spielerhöhe ist
            kopf.setPositionY(this.canvasHeight - 1); // position y = canvas höhe - spielerhöhe
        } 
        else if (kopf.getPositionY() >= this.canvasHeight) { // wenn position y größer als canvas-höhe ist
            kopf.setPositionY(0); // y = 0
        }

    }

    /////////////////////////////////////////////////////////////////////////////
	////////////////////////** SPAWN VERFOLGER / ALL *///////////////////////////
	/////////////////////////////////////////////////////////////////////////////

	/**
	* Spawn eines weiteren Gegners
	*/
	erhoeheGegnerzahl() {

		let pickupkol = this.pickup.getList()[0]; // Erstes Pickup-Objekt speichern

		this.gegner.add(pickupkol); // Anhängen eines neuen Objektes an die Gegner-Liste
        this.spawnKollisionVerhindern(); // Überlagerung verhindern

	}

	/**
	* Setzt bei Pickup alle Objekte die neu verteilt werden sollen auf neue Positionen.
	*/
	respawnAll() {

		// Schlangen-Kopf speichern um Überlagerungen beim Spawn zu verhindern.
		let kopf = this.schlange.getList()[0];

		// Durch Item-Liste iterieren und deren Objekt-Sprites von View löschen lassen
		for(var i = 0; i < this.pickup.getLength(); i++){
			this.view.draw(this.pickup.getList()[i], true); // Sprite löschen (kill == true)
		}

		this.pickup.respawn(kopf); // Pickup respawn

		// Erstes Objekt der Pickup-Liste speichern um Überlagerungen beim Spawn zu verhindern
		let pickupkol = this.pickup.getList()[0];

		// Durch Gegner-Liste iterieren und deren Objekt-Sprites von View löschen lassen 
		for(var i = 0; i < this.gegner.getLength(); i++){
			this.view.draw(this.gegner.getList()[i], true); // Sprite löschen (kill == true)
		}

		// Durch Gegner-Liste iterieren und deren Objekte neu spawnen lassen
        for(var i = 0; i < this.gegner.getLength(); i++){
			this.gegner.respawn(this.gegner.getList()[i]);
		}
		this.gegner.respawn(kopf); // respawn
        
        this.spawnKollisionVerhindern(); // Überlagerung verhindern

	}
    
    /** 
    * Verhindert, dass ein Gegner auf dem Kopf der Schlange oder einem Pickup spawned. 
    */
    spawnKollisionVerhindern() {

        let kopf = this.schlange.getList()[0]; // Kopf der Schlange

        let pickupkol = this.pickup.getList()[0]; // Pickup
        
        // Überlagerungen verhindern
        this.gegner.stackVerhindern(kopf);
        this.gegner.stackVerhindern(pickupkol);
        this.gegner.stackVerhindern(kopf);

    }

	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////** KOLLISIONEN *////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

	/**
	* Kollisionsabfragen mit dem Kopf der Schlange
	* @return Typ der Kollision als String 'frei', 'feind' oder 'pickup'
	*/
	kollision() {

		// Durch Schlangen-Liste iterieren und prüfen ob die Position des Kopf-Objekts[0] mit 
		// einem Verfolger-Objekt in der Schlange kollidiert.
		for(var i = 2; i < this.schlange.getLength(); i++){
			// Kopf mit Körperteil Position testen, hierbei muss erst beim 3. angefangen werden
			if(this.schlange.getList()[0].getPositionX() == this.schlange.getList()[i].getPositionX()){
				// falls x-Wert stimmt, y-Wert überprüfen
				if(this.schlange.getList()[0].getPositionY() == this.schlange.getList()[i].getPositionY()){
					return 'feind'; // return Typ der Kollision
				}
			}
		}

		// Durch Gegner-Liste iterieren und prüfen ob die Position des Kopf-Objekts [0] mit 
		// einem Objekt der Gegner-Liste kollidiert.
		for(var i = 0; i < this.gegner.getLength(); i++){
			// Kopf mit Gegner x-Position vergleichen
			if(this.schlange.getList()[0].getPositionX() == this.gegner.getList()[i].getPositionX()){
				// falls x-Wert stimmt, y-Wert überprüfen
				if(this.schlange.getList()[0].getPositionY() == this.gegner.getList()[i].getPositionY()){
					return 'feind'; // return Typ der Kollision
				}
			}
		}

		// In der Pickup-Liste Objekt prüfen ob die Position des Kopf-Objekts [0] mit 
		// einem Objekt der Pickup-Liste kollidiert.
		// Kopf mit Pickup x-Position vergleichen
		if(this.schlange.getList()[0].getPositionX() == this.pickup.getList()[0].getPositionX()) {
			// falls x-Wert stimmt y-Wert überprüfen
			if(this.schlange.getList()[0].getPositionY() == this.pickup.getList()[0].getPositionY()) {
					return 'pickup'; // return Typ der Kollision
			}
		}

		// falls nichts zutrifft frei wiedergeben
		return 'frei'; // keine Kollision

	}

	/** 
	* Überprüft ob Kollision stattgefunden hat und reagiert mit dem 
	* entsprechenden Soundeffekt.
	*/
	notifySoundStats(kollisionstyp) {
		if(kollisionstyp == 'feind'){
			this.sound.crash(); // crash sound
		} else if(kollisionstyp == 'pickup') {
			this.sound.pickup(); // naknak sound
		}
	}

	/////////////////////////////////////////////////////////////////////////////
	/////////////////** VERGRÖSSERN / VERKLEINERN SCHLANGE */////////////////////
	/////////////////////////////////////////////////////////////////////////////

	/** Vergrößert die Schlange */
	vergroessereSchlange() {
		this.schlange.add();
	}

	/** Verkleinert die Schlange */
	verkuerzeSchlange() {

		let zutoeten = this.schlange.delete();

		if(zutoeten != undefined) { // wenn das letzte Objekt nicht undefiniert ist
			this.view.draw(zutoeten, true); // Sprite löschen (kill == true)
		}

        this.score += 5; // Punktzahl erhöhen

	}


    /////////////////////////////////////////////////////////////////////////////
	/////////////////////////////** VIEW UPDATE *////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

	/**
	* Zeichne Objekte
	* Iteriert durch Objekt-Listen und lässt diese durch View zeichnen.
	* Lässt außerdem die Schlangenlänge durch View anzeigen.
	*/
	zeichneObjekte() {

		// Durch Schlangen-Liste iterieren und deren Objekte von View zeichnen lassen.
		for(var i = 0; i < this.schlange.getLength(); i++){
			this.view.draw(this.schlange.getList()[i], false); // Sprite zeichnen (kill == false)
		}

		// Update HTML-Felder
		this.view.laengenAnzeige(this.schlange.getLength() - 1); // Länge der Schlange (ohne den Kopf)
        this.view.punkteAnzeige(this.score); // Punktestand

		// Durch Gegner-Liste iterieren und deren Objekte von View zeichnen lassen.
		for(var i = 0; i < this.gegner.getLength(); i++){
			this.view.draw(this.gegner.getList()[i], false); // Sprite zeichnen (kill == false)
		}

		// Durch Item-Liste iterieren und deren Objekte von View zeichnen lassen.
		for(var i = 0; i < this.pickup.getLength(); i++){
			this.view.draw(this.pickup.getList()[i], false); // Sprite zeichnen (kill == false)
		}

		// Nachdem alle Objekte gezeichnet wurden, darf Laufrichtung wieder geändert werden.
		this.laufrichtungsIntervall = true;

	}
    
    /** Ruft eine UpdateFunktion in der View auf, die die übergebene Sekundenzahl formatiert darstellt */
    updateTime(seconds){
        this.view.zeitAnzeige(seconds);
    }

	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////** PUNKTESTAND UPDATE **////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

    /** 
    * Wird aufgerufen, um pro Zeitintervall automatisch den Punktestand in 
    * Abhängigkeit der Länge der Schlange zu erhöhen.
    */
    updateScoreOverTime() {

        // wenn die Schlange 3 oder weniger Verfolger hat, bekommt man pro Intervall 3 Punkte
        if(this.schlange.getLength() - 1 <= 3){
            this.score += 3;
        }
        // wenn die Schlange 5 oder weniger Verfolger hat, bekommt man 2 Punkte pro Intervall
        else if(this.schlange.getLength() - 1 <= 5){
        	this.score += 2;
        }
        // wenn die Schlange zu viele Verfolger hat, 1 Punkt fürs Intervall
        else {
        	this.score += 1;
        }

        this.view.punkteAnzeige(this.score); // Punkte-Anzeige aktualisieren

		this.checkGegnerAnzahl(); // Überprüfe ob ein weiterer Gegner erscheinen muss

    }

	/** 
	* Überprüft ob Gegneranzahl Proportional zur Punktzahl sind und passt diese an.
	*/
	checkGegnerAnzahl() {

		if(this.score/100 >= this.gegner.getLength()){
			 this.erhoeheGegnerzahl();
		}

	}


}
