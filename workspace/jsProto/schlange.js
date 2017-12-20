import { Einzelobjekt } from './einzelobjekt';

/** 
* Die Schlange soll ihre Körperteile wie die Liste ihre Nodes verwalten.
*/
export default class Schlange {
    
    /** Constructor */
    constructor() {

        /** Schlange besteht aus einer Liste */
        this.list = [{}, {}, {}];

        /**
        * Ein Einzelobjekt ist 60x60 groß)
        */
        this.objektGroesse = 60;

        /**
        * Startpunkt der Schlange P(60;60)
        */
        this.startX = this.objektGroesse;
        this.startY = this.objektGroesse;

    }

    /** 
    * Initialisiere die Schlange mit 3 Verfolgern 
    * an einer bestimmten Startposition.
    */
    initSchlange() {

        var positionX0 = this.startX + (2 * this.objektGroesse);
        var positionX1 = this.startX + this.objektGroesse;

        let Einzelobjekt = require('./einzelobjekt.js').default;
        this.list[0].objekt = new Einzelobjekt(positionX0, this.startY, 'spieler');
        this.list[1].objekt = new Einzelobjekt(positionX1, this.startY, 'verfolger');
        this.list[2].objekt = new Einzelobjekt(this.startX, this.startY, 'verfolger');
        
    }
    
    /** Körperteil zur Schlange hinzufügen */
    add(){
        first.add();
    }
    
    /** Körperteil aus Schlange entfernen */
    delete(anzahl){
        if(anzahl < getLength()){
            first.delete(anzahl);
        }
        else{
            first.delete(getLength()-1);
        }
    }
    
    /** Gibt die Länge der Schlange in Form eines Zahlenwertes zurück */
    getLength(){
        return this.list.length;
    }
    
    /** Weist dem Schlangenkopf eine neue Position zu */
    move(newX, newY){
        this.first.move(first.positionX + newX, first.positionY + newY);
    }
	
	/** gibt die informationen über alle Körperteile als Array zurück */
	getInfo(){
		var info = new Array(this.getLength());
		
		for(var i = 0; i < this.getLength(); i++){
			var currentNode = this.first;
			info[0] = currentNode;
			if(currentNode.naechster != undefined){
				currentNode = currentNode.naechster;
			} else { break; }
		}
	}
    
}