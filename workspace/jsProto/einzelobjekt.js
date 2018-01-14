
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////** EINZELOBJEKT **//////////////////////////////
//////////////// Spieler, Pickup, Verfolger & Feind (Gegner) ////////////////
/////////////////////////////////////////////////////////////////////////////
export default class Einzelobjekt {
	
	/** 
	* Constructor
	* @param positionX : x-Koordinate eines Objektes
	* @param positionY : y-Koordinate eines Objektes
	* @param typ : Typ des Objektes (spieler / verfolger / pickup / stein / feind), Spritename
	*/
	constructor(positionX, positionY, typ) {

		/** 
		* Wichtig für die Sprite zuordnung 
		*/
		this.positionX = positionX;
		this.positionY = positionY;
		this.typ = typ; // typ == spritename!
		
		/**
		* Laufrichtung eines Objekts.
		*/
		this.laufrichtung;
		this.changedDirection = false; // prüft ob Laufrichtung des Objekts gändert wurde

		/**
		* Vergibt bei Bedarf eine RandomId von 1-4 für die zufällige Character-Zuordnung der Sprites.
		*/
		const zufallszahl = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		this.randomId = zufallszahl;

		/**
		* Sprite des Objektes
		*/
		this.image = undefined;
		
	}

	/////////////////////////////////////////////////////////////////////////////
    ////////////////////////////** GETTER & SETTER **////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
	
	/** Gibt x-Koordinate der Position zurück */
	getPositionX() {
		return this.positionX;
	}
	
	/** Gibt y-Koordinate der Position zurück */
	getPositionY() {
		return this.positionY;
	}
	
	/** Gibt Typ des Objekts zurück */
	getTyp() {
		return this.typ;
	}

	/** Gibt Laufrichtung des Objekts zurück */
	getLaufrichtung() {
		return this.laufrichtung;
	}

	/** Gibt Richtungswechsel des Objekts zurück */
	getChangedDirection() {
		return this.changedDirection;
	}

	/** Gibt Image des Objekts zurück */
	getImage() {
		return this.image;
	}

	/** Gibt die zufällige Id des Objektes zurück */
	getRandomId() {
		return this.randomId;
	}
	
	/** Ändert die x-Koordinate der Position */
	setPositionX(newX){
		if(newX < this.positionX){
			this.laufrichtung = 'links';
		} else if (newX > this.positionX){
			this.laufrichtung = 'rechts';
		}
		this.positionX = newX;
	}
	
	/** Ändert die y-Koordinate der Position */
	setPositionY(newY){
		if(newY < this.positionY){
			this.laufrichtung = 'rauf';
		} else if (newY > this.positionY){
			this.laufrichtung = 'runter';
		}
		this.positionY = newY;
	}


	/** Setzt die das Image des Objektes */
	setImage(newImage) {
		this.image = newImage;
	}

	/** Setzt die x-Position des Image */
	setImageX(newXPosition) {
		this.image.x = newXPosition;
	}

	/** Setzt die y-Position des Image */
	setImageY(newYPosition) {
		this.image.y = newYPosition;
	}

	/** Setzt boolean changedDirection */
	setChangedDirection(changed) {
		this.changedDirection = changed;
	}

	/** Setzt Laufrichtung */
	setLaufrichtung(newLaufrichtung) {
		this.laufrichtung = newLaufrichtung;
	}

	/** Zerstört Image */
	destroyImage() {
		this.image.destroy();
	}


}
