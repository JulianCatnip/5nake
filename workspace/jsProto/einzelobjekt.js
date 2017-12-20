/**
* Einzelobjekt erstellen, von dem andere Objekte erben können
* Einzelobjekt: Spieler, Verfolger, Pickup(+randomspawn), Stein, Feind(+randomspawn)
*/
export default class Einzelobjekt {
	
	/** 
	* Constructor
	* @param x-Koordinate eines Objektes
	* @param y-Koordinate eines Objektes
	* @param typ Typ des Objektes (spieler / verfolger / pickup / stein / feind), Spritename
	*/
	constructor(positionX, positionY, typ) {

		/** Wichtig für die Sprite zuordnung */
		this.positionX = positionX;
		this.positionY = positionY;
		this.typ = typ; // typ == spritename!

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
}
