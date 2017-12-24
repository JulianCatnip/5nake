//import { Einzelobjekt } from './einzelobjekt';
let Einzelobjekt = require('./einzelobjekt.js').default;
/**
* Taucht zufällig im Spielfeld auf
* Game Over bei Kollision mit Schlange
*/
export default class Gegner{
    
    /** Constructor */
    constructor(_maxX,_maxY, _typ) {

        /** Gegner besteht aus einer Liste */
		  let Einzelobjekt = require('./einzelobjekt.js').default;
		  this.typ = _typ;
		  this.maxX = _maxX - 1;
		  this.maxY = _maxY - 1;
		 
		  /**
	     Initialisieren vom Array */
		  this.list = [new Einzelobjekt(
			  					Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2,
			  					Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, 
							   this.typ)];
	 }
	
	/**
	* Fügt ein weiteres Objekt dem Array zu 
	@param gegenstand mit dem nicht kollidiert werden darf*/
	add(gegenstand){
		this.list.push(new Einzelobjekt(
								Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2,
			  					Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2, 
							   this.typ));
		this.stackVerhindern(gegenstand);
	}
	
	/**
	* Testet ob die Objekte dieser Liste mit dem auf einem anderen Objekt kollidieren
	* (zb: Verhindert dass Gegner auf Pickups spawnen)*/
	stackVerhindern(gegenstand){
		var gleich = true;
		for(var i = 0; i < this.list.length; i++){
			while(gleich){
				//XKoordinate überprüfen
				if(this.list[i].getPositionX() == gegenstand.getPositionX()){
					//YKoordinate überprüfen
					if(this.list[i].getPositionY() == gegenstand.getPositionY()){
						//Bei Gleichheit respawnen
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
	* Setzt alle Inhalte auf neue zufällige Positionen */
	respawn(gegenstand){
		for(var i = 0; i < this.list.length; i++){
			this.reset(this.list[i]);
		}
		this.stackVerhindern(gegenstand);
	}
	
	/**
	* Setzt ein Einzelobjekt auf neue Position */
	reset(objekt){
		objekt.setPositionX(Math.floor(Math.random() * (this.maxX - 2 + 1)) + 2);
		objekt.setPositionY(Math.floor(Math.random() * (this.maxY - 2 + 1)) + 2);
	}
	
	/** gibt die informationen über alle Gegner als Array zurück */
	getInfo(){
		return this.list;
	}
    
    
}
