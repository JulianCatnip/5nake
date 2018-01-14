let Einzelobjekt = require('./einzelobjekt.js').default; // Klassenimport Einzelobjekt

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////** SCHLANGE **////////////////////////////////
////////////// Soll ihre Körperteile in einer Liste verwalten. //////////////
/////////////////////////////////////////////////////////////////////////////
export default class Schlange {
    
    /** 
    * Constructor 
    */
    constructor() {

        /** 
        * Schlange besteht aus einer Liste.
        */
        this.list = [
            new Einzelobjekt(3, 1, 'spieler'), // x, y, typ des einzelobjektes (für die Sprite zuordnung)
            new Einzelobjekt(2, 1, 'verfolger'),
            new Einzelobjekt(1, 1, 'verfolger'),
            new Einzelobjekt(0, 1, 'verfolger')
		];

        /**
        * Ein Einzelobjekt ist 1x1 Einheiten (60px) groß.
        */
        this.objektGroesse = 1;

        /**
        * Startpunkt der Schlange P(1 Einheit; 1 Einheit)
        */
        this.startX = 1;
        this.startY = 1;

    }

    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////** GETTER & SETTER **////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /** 
    * Gibt die Schlangen-Liste zurück.
    * @return Schlangen-Liste
    */
    getList() {
        return this.list;
    }

    /** 
    * Gibt die Länge der Schlangen-Liste zurück.
    */
    getLength() {
        return this.list.length;
    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////////** VERWALTUNG LISTE **////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    
    /** 
    * Körperteil zur Schlangen-Liste hinzufügen.
    */
    add() {

        // Erweitert das Array durch ein Einzelobjekt
        let neuesItem = new Einzelobjekt(this.list[this.list.length-1].getPositionX(), this.list[this.list.length-1].getPositionY(), 'verfolger');
        this.list.push(neuesItem);

    }
    
    /** 
    * Körperteil aus Schlange entfernen.
    * @return das gekillte Objekt dessen Sprite noch gelöscht werden muss.
    */
    delete() {

        if(this.list.length > 2) {

            let zutoeten = this.list[this.list.length - 1]; // letztes Objekt speichern
            this.list = this.list.slice(0, this.list.length - 1); // Array verkürzen

            return zutoeten;

        }

    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////** BEWEGUNG **////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    
    /** 
    * Weist den Objekten in der Schlangen-Liste neue Positionen zu.
    * @param newX, newY : neue Position
    */
    move(newX, newY) {
        
        let oldX; // Speicher für die alte Position X
        let oldY; // Speicher für die alte Position Y

        for(let i = 0; i < this.list.length; i++) { // für jedes Objekt der Liste

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
    * Weist den Objekten in der Schlangen-Liste neue Laufrichtungen zu.
    * Das aktuelle Objekt muss den Vorgänger verfolgen!
    * @param kopfRichtung : Laufrichtung des Spielers
    */
    updateObjektLaufrichtung(neueKopfRichtung) {

        // zur Speicherung des Kopfes
        var kopf = this.list[0];

        // zur Speicherung von aktuellem und vorgänger Objekt 
        var aktueller;
        var vorgaenger;

        // zur Speicherung von Positionsabfragen (boolean)
        var horizontal;
        var vertikal;
        var hinter;
        var vor;
        var unter;
        var ueber;

        // muss nur angepasst werden wenn neue vorhanden
        if(kopf.getLaufrichtung() != neueKopfRichtung) {
            kopf.setLaufrichtung(neueKopfRichtung);
            kopf.setChangedDirection(true);
        }

        // durch liste iterieren
        for(var i = 1; i < this.list.length; i++) {

            aktueller = this.list[i];

            var j = i - 1;
            vorgaenger = this.list[j];

            // Der Aktuelle und der Vorgaenger sind _____ angebunden. 
            horizontal = vorgaenger.getPositionY() == aktueller.getPositionY();
            vertikal = vorgaenger.getPositionX() == aktueller.getPositionX();

            // Der Aktuelle ist _____ dem Vorgaenger. 
            hinter = vorgaenger.getPositionX() < aktueller.getPositionX();
            vor = vorgaenger.getPositionX() > aktueller.getPositionX();
            unter = vorgaenger.getPositionY() < aktueller.getPositionY();
            ueber = vorgaenger.getPositionY() > aktueller.getPositionY();

            if(horizontal && hinter) {
                if(aktueller.getLaufrichtung() != 'left') {
                    aktueller.setLaufrichtung('left');
                    aktueller.setChangedDirection(true); // Richtung wurde geändert (für den Wechsel der Animation)
                }
            } else if(horizontal && vor) {
                if(aktueller.getLaufrichtung() != 'right') {
                    aktueller.setLaufrichtung('right');
                    aktueller.setChangedDirection(true); // Richtung wurde geändert (für den Wechsel der Animation)
                }
            } else if(vertikal && unter) {
                if(aktueller.getLaufrichtung() != 'up') {
                    aktueller.setLaufrichtung('up');
                    aktueller.setChangedDirection(true); // Richtung wurde geändert (für den Wechsel der Animation)
                }
            } else if(vertikal && ueber) {
                if(aktueller.getLaufrichtung() != 'down') {
                    aktueller.setLaufrichtung('down');
                    aktueller.setChangedDirection(true); // Richtung wurde geändert (für den Wechsel der Animation)
                }
            }

        }

    }
    
}