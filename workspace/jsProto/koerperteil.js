/////////////// DEPRECATED /////////////////
/** Das Objekt ist der Prototyp für die Körperteile der Schlange */
/** class Koerperteil extends Einzelobjekt{
    
    //Constructor-Aufruf wie vorher, nur hier mit "super", um 
    //Vererbung mit Java nachzuempfinden. Tatsächlicher Zugriff durch Prototyping
    /** Aufruf von super-Constructor
    * hinzufügen der Variablen für die Körperteile*/
    constructor(_positionX, _positionY){
        super(_positionX, _positionY, 'koerperteil');
        this.naechster = undefined;
	}
    
    /** Funktion fügt ein weiteres Körperteil zur Liste hinzu 
    add(){
        if(naechster != undefined){
            naechster.add();
        }
        else{
            naechster = new Koerperteil(this.positionX, this.positionY);
        }
    }
    
    /** Funkktion entfernt ein Körperteil aus der Liste 
    delete(anzahl){
        var deleteinfo = this.naechster.delete(anzahl);
		 if(deleteinfo.sollGeloeschtwerden == true){
			 this.naechster = undefined;
			 return {
				sollGeloeschtwerden : deleteinfo.anzahl - 1 > 0,
				anzahl : deleteinfo.anzahl -1;
			 };
		 }
		 else {
			 return {
				 sollGeloeschtwerden : false,
				 anzahl : 0;
			 };
		 }
    }
    
    /** Rekursives Zählen der vorhandenen Körperteile
    count(){
        if(naechster != undefined){
            return naechster.count()+1;
        }
        else{
            return 1;
        }
    }
    
    /** lässt den Körperteil auf die Position des jeweils vorhergehenden Körperteils in der Liste nachrücken
    move(newX, newY){
        if(this.naechster != undefined){
            naechster.move(this.positionX, this.positionY);
        }
            this.positionX = newX;
            this.positionY = newY;
    }

} 
*/