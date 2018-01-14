let Einzelobjekt = require('./einzelobjekt.js').default; // Klassenimport Einzelobjekt

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////** GEGNER **/////////////////////////////////
//// Spawnt zufällig im Spielfeld und sorgt für Gameover bei Kollision. /////
/////////////////////////////////////////////////////////////////////////////
export default class Gegner {
    
    /** 
    * Constructor
    * @param maxX, maxY : Maximal-Werte für die Platzierung im Canvas
    * @param typ : Typ der Einzelobjekte
    */
    constructor(maxX, maxY, typ) {

    	/**
    	* max-X Koordinate
    	*/
    	this.maxX = maxX - 1; // 14

    	/**
    	* max-Y Koordinate
    	*/
		this.maxY = maxY - 1; // 10

		/**
    	* Typ für die Einzelobjekte
    	*/
		this.typ = typ; // 'feind' beim Gegner

		/**
    	* Gegner als Liste initialisieren
    	*/
		this.list = [
			new Einzelobjekt(
				Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2, // zufällige x-Platzierung
			  	Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, // zufällige y-Platzierung
				this.typ // Typ für Zuweisung des Sprite
			)
		];

	}

	/////////////////////////////////////////////////////////////////////////////
    ////////////////////////////** GETTER & SETTER **////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

	/** 
	* Gibt die Gegner-Liste zurück.
	* @return Gegner-Liste
	*/
	getList() {
		return this.list;
	}

	/** 
    * Gibt die Länge der Gegner-Liste zurück.
    */
    getLength() {
        return this.list.length;
    }

	/////////////////////////////////////////////////////////////////////////////
    ////////////////////////////** VERWALTUNG LISTE **///////////////////////////
    /////////////////////////////////////////////////////////////////////////////
	
	/**
	* Fügt ein weiteres Objekt dem Array zu.
	* @param objekt : mit dem Überlagerung verhindert werden soll.
	*/
	add(objekt) {

		this.list.push(
			new Einzelobjekt(
				Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2, // zufällige x-Platzierung
			  	Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, // zufällige y-Platzierung
				this.typ // Typ für Zuweisung des Sprite
			)
		);

		this.stackVerhindern(objekt); // Überlagerung verhindern

	}

	/////////////////////////////////////////////////////////////////////////////
    /////////////////////////** RESPAWN POSITIONIERUNG **////////////////////////
    /////////////////////////////////////////////////////////////////////////////
	
	/**
	* Testet ob die Objekte dieser Liste beim spawnen mit einem anderen Objekt kollidieren.
	* Verhindert z.B. dass Gegner auf Pickups spawnen.
	* @param objekt : mit dem Überlagerung verhindert werden soll.
	*/
	stackVerhindern(objekt) {

		let gleichePosition = true; // Abfrage auf der gleichen Position auf true

		for(var i = 0; i < this.list.length; i++){ // für alle Objekte der Gegner-Liste

			while(gleichePosition) { // solange gleiche Position
			
				if(this.list[i].getPositionX() == objekt.getPositionX()) { // x-Koordinaten der Objekte vergleichen
					
					if(this.list[i].getPositionY() == objekt.getPositionY()){ // y-Koordinaten der Objekte vergleichen
						
						this.reset(this.list[i]); // bei Gleichheit neu spawnen

					} else {

						gleichePosition = false; // andernfalls gleiche Position ist false

					}

				} else {

					gleichePosition = false; // andernfalls gleiche Position ist false

				}

			}

		}

	}
	
	/**
	* Setzt alle Gegner-Objekte auf neue zufällige Positionen.
	* @param objekt : mit dem Überlagerung verhindert werden soll.
	*/
	respawn(objekt) {

		for(var i = 0; i < this.list.length; i++) { // für alle Objekte der Gegner-Liste

			this.list[i] = new Einzelobjekt( // neues Einzelobjekt
				Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2, // zufällige x-Platzierung
				Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, // zufällige y-Platzierung
				this.typ // Typ für Zuweisung des Sprite
			);

		}

		this.stackVerhindern(objekt); // Überlagerung verhindern
	}
	
	/** 
	* Setzt ein Einzelobjekt auf neue Position (um 1 verrückt).
	* @param objekt : dessen Position um 1 verrückt werden soll.
	*/
	reset(objekt) {
		objekt.setPositionX((objekt.positionX + 1) % this.maxX); // x-Platzierung
		objekt.setPositionY((objekt.positionY + 1) % this.maxY); // y-Platzierung
	}
    
}
