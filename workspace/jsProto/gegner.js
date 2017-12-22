import { Einzelobjekt } from './einzelobjekt';
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
		  this.maxX = _maxX;
		  this.maxY = _maxY;
		 
		  /**
	     Initialisieren vom Array */
		  this.list = [new Einzelobjekt(
								Math.round(1 + this.maxX * Math.random()),		Math.round(1 + this.maxY * Math.random()), 
							   this.typ)];
		 console.log("Gegner wurde aufgerufen" + this.list[0].typ);
	 }
	
	/** gibt die informationen über alle Gegner als Array zurück */
	getInfo(){
		console.log("GegnerInformation");
		return this.list;
	}
    
    
}
