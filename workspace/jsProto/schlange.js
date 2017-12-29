let Einzelobjekt = require('./einzelobjekt.js').default; // Klassenimport Einzelobjekt
/** 
* Die Schlange soll ihre Körperteile wie die Liste ihre Nodes verwalten.
*/
export default class Schlange {
    
    /** Constructor */
    constructor() {

        /** Schlange besteht aus einer Liste */
        this.list = [
            new Einzelobjekt(3, 1, 'spieler'), // x, y, typ des einzelobjektes
            new Einzelobjekt(2, 1, 'verfolger'),
            new Einzelobjekt(1, 1, 'verfolger'),
            new Einzelobjekt(0, 1, 'verfolger')
		];

        /**
        * Ein Einzelobjekt ist 1x1 Einheiten (60px) groß)
        */
        this.objektGroesse = 1;

        /**
        * Startpunkt der Schlange P(1 Einheit; 1 Einheit)
        */
        this.startX = 1;
        this.startY = 1;

    }
    
    /** Körperteil zur Schlange hinzufügen */
    add() {
        // Erweitert das Array durch ein Einzelobjekt
        var neuesItem = new Einzelobjekt(this.list[this.list.length-1].getPositionX(), this.list[this.list.length-1].getPositionY(), 'verfolger');
        this.list.push(neuesItem);
    }
    
    /** 
    * Körperteil aus Schlange entfernen
    * @return das getötete Objekt dessen sprite gelöscht werden muss
    */
    delete() {
        if(this.list.length > 2) {
            var zutoeten = this.list[this.list.length - 1];
            this.list = this.list.slice(0, this.list.length - 1);
            return zutoeten;
        }
    }
    
    /** Gibt die Länge der Schlange in Form eines Zahlenwertes zurück */
    getLength() {
        return this.list.length;
    }
    
    /** Weist dem Schlangenkopf eine neue Position zu */
    move(newX, newY) {
        
        //Speicher für die alte Position X
        var oldX;
        //Speicher für die alte Position Y
        var oldY;

        for(var i = 0; i < this.list.length; i++){
            // Alte Position Speichern
            oldX = this.list[i].getPositionX();
            oldY = this.list[i].getPositionY();
            
            // Neue Position setzen
            this.list[i].setPositionX(newX);
            this.list[i].setPositionY(newY);

            // new neu besetzen
            newX = oldX;
            newY = oldY;
		  }
    }
	
	/** gibt die informationen über alle Körperteile als Array zurück */
	getInfo(){
		return this.list;
	}
    
}