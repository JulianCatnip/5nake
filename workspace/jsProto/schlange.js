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
    
    /** Weist den Schlangengliedern neue Positionen zu */
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

    /** 
    * Weist den Schlangengliedern neue Laufrichtungen zu
    * Das aktuelle Objekt muss den Vorgänger verfolgen!
    * @param kopfRichtung Laufrichtung des Spielers
    */
    setObjektLaufrichtung(kopfRichtung) {

        // zur speicherung von aktuellem und vorgänger Objekt 
        var aktueller;
        var vorgaenger;

        // zur speicherung von Positionsabfragen (Boolean)
        var horizontal;
        var vertikal;
        var hinter;
        var vor;
        var unter;
        var ueber;

        this.list[0].laufrichtung = kopfRichtung;

        // durch liste iterieren
        for(var i = 1; i < this.list.length; i++) {

            aktueller = this.list[i];

            var j = i - 1;
            vorgaenger = this.list[j];

            /** Der Aktuelle und der Vorgaenger sind _____ angebunden. */
            horizontal = vorgaenger.getPositionY() == aktueller.getPositionY();
            vertikal = vorgaenger.getPositionX() == aktueller.getPositionX();

            /** Der Aktuelle ist _____ dem Vorgaenger. */
            hinter = vorgaenger.getPositionX() < aktueller.getPositionX();
            vor = vorgaenger.getPositionX() > aktueller.getPositionX();
            unter = vorgaenger.getPositionY() < aktueller.getPositionY();
            ueber = vorgaenger.getPositionY() > aktueller.getPositionY();

            if(horizontal && hinter) {
                aktueller.laufrichtung = 'left';
            } else if(horizontal && vor) {
                aktueller.laufrichtung = 'right';
            } else if(vertikal && unter) {
                aktueller.laufrichtung = 'up';
            } else if(vertikal && ueber) {
                aktueller.laufrichtung = 'down';
            }

        }

    }
	
	/** Gibt die informationen über alle Körperteile als Array zurück */
	getInfo() {
		return this.list;
	}
    
    setLength(value){
        this.list.length = value;
    }
    
}