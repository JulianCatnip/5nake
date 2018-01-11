/**
* Einzelobjekt erstellen, von dem andere Objekte erben können
* Einzelobjekt: Spieler, Verfolger, Pickup, Feind
*/
export default class Einzelobjekt {
	
	/** 
	* Constructor
	* @param x-Koordinate eines Objektes
	* @param y-Koordinate eines Objektes
	* @param typ Typ des Objektes (spieler / verfolger / pickup / stein / feind), Spritename
	* Gibt eine Laufrichtung an (rauf, runter, links, rechts)
	*/
	constructor(positionX, positionY, typ) {

		/** Wichtig für die Sprite zuordnung */
		this.positionX = positionX;
		this.positionY = positionY;
		this.typ = typ; // typ == spritename!
		
		this.laufrichtung;
		this.changedDirection = false; // prüft ob laufrichtung des objekts gändert wurde

		/** Vergibt bei Bedarf eine RandomId von 1-4 für die Character-Zuordnung der Sprites */
		const zufallszahl = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		this.randomId = zufallszahl;

		//this.image = null;
		
	}
	
	/** Gibt X-Koordinate der Position zurück */
	getPositionX() {
		return this.positionX;
	}
	
	/** Gibt Y-Koordinate der Position zurück */
	getPositionY() {
		return this.positionY;
	}
	
	/** Gibt Typ des Objekts zurück */
	getTyp() {
		return this.typ;
	}
	
	/** Ändert die X-Koordinate der Position */
	setPositionX(newX){
		if(newX < this.positionX){
			this.laufrichtung = 'links';
		} else if (newX > this.positionX){
			this.laufrichtung = 'rechts';
		}
		this.positionX = newX;
	}
	
	/** Ändert die Y-Koordinate der Position */
	setPositionY(newY){
		if(newY < this.positionY){
			this.laufrichtung = 'rauf';
		} else if (newY > this.positionY){
			this.laufrichtung = 'runter';
		}
		this.positionY = newY;
	}

	/** Gibt die zufällige Id des Objektes zurück */
	getRandomId() {
		return this.randomId;
	}
}
