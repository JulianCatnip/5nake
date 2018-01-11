//import { Einzelobjekt } from './einzelobjekt';
let Einzelobjekt = require('./einzelobjekt.js').default;

/**
* Taucht zufällig im Spielfeld auf
* Game Over bei Kollision mit Schlange
*/
export default class Gegner {
    
    /** Constructor */
    constructor(_maxX,_maxY, _typ) {

    	/**
    	* max-X Koordinate
    	*/
    	this.maxX = _maxX - 1; // 14

    	/**
    	* max-Y Koordinate
    	*/
		this.maxY = _maxY - 1; // 10

		/**
    	* Typ
    	*/
		this.typ = _typ; // 'feind'

		/**
    	* Gegner als Liste initialisieren
    	*/
    	let Einzelobjekt = require('./einzelobjekt.js').default; // Klassenimport Einzelobjekt
		this.list = [
			new Einzelobjekt(
				Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2, // zufällige x-Platzierung
			  	Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, // zufällige y-Platzierung
				this.typ // Typ für Zuweisung des Sprites
			)
		];
	}
	
	/**
	* Fügt ein weiteres Objekt dem Array zu 
	* @param gegenstand mit dem nicht kollidiert werden darf
	*/
	add(gegenstand) {
		this.list.push(
			new Einzelobjekt(
				Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2,
			  	Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, 
				this.typ
			)
		);
		this.stackVerhindern(gegenstand);
	}
	
	/**
	* Testet ob die Objekte dieser Liste mit dem auf einem anderen Objekt kollidieren
	* (zb: Verhindert dass Gegner auf Pickups spawnen)
	*/
	stackVerhindern(gegenstand) {
		var gleich = true;
		for(var i = 0; i < this.list.length; i++){
			while(gleich) {

				// x-Koordinate überprüfen
				if(this.list[i].getPositionX() == gegenstand.getPositionX()){
					// y-Koordinate überprüfen
					if(this.list[i].getPositionY() == gegenstand.getPositionY()){
						// Bei Gleichheit respawnen
						this.reset(this.list[i]);
					} else {
						gleich = false;
					}
				} else {
					gleich = false;
				}
			}

		}
	}
	
	/**
	* Setzt alle Inhalte auf neue zufällige Positionen 
	*/
	respawn(gegenstand) {
		for(var i = 0; i < this.list.length; i++){
			//this.reset(this.list[i]);
			this.list[i] = new Einzelobjekt(
				Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2,
				Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2,
				this.typ
			);
		}
		this.stackVerhindern(gegenstand);
	}
	
	/** 
	* Setzt ein Einzelobjekt auf neue Position (um 1 verrückt)
	*/
	reset(objekt) {
		objekt.setPositionX((objekt.positionX +1)%this.maxX );
		objekt.setPositionY((objekt.positionY +1)%this.maxY );
        console.log("POSITION GEÄNDERT");
	}
	
	/** Gibt die informationen über alle Gegner als Array zurück */
	getInfo() {
		return this.list;
	}
    
}
