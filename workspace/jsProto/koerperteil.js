/** Das Objekt ist der Prototyp für die Körperteile der Schlange */
class Koerperteil extends Einzelobjekt{
    
    //Constructor-Aufruf wie vorher, nur hier mit "super", um 
    //Vererbung mit Java nachzuempfinden. Tatsächlicher Zugriff durch Prototyping
    /** Aufruf von super-Constructor
    * hinzufügen der Variablen für die Körperteile*/
    constructor(_positionX, _positionY, _typ, vorheriger, naechster){
        super(_positionX, _positionY, _typ);
        this.vorheriger = vorheriger;
        this.naechster = naechster;
	}
    
    /** Funktion fügt ein weiteres Körperteil zur Liste hinzu */
    add(){
        
    }
    
    /** Funkktion entfernt ein Körperteil aus der Liste */
    delete(){
        
    }
    
}