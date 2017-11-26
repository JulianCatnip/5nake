/** Das Objekt ist als "Elternklasse" für Gegner und Pickup gedacht und fügt dem Prototypen Einzelobjekt eine MEthode spawn hinzu */
class RandomSpawn extends Einzelobjekt{
    
    //Constructor-Aufruf wie vorher, nur hier mit "super", um 
    //Vererbung mit Java nachzuempfinden. Tatsächlicher Zugriff durch Prototyping
    /** Aufruf von super-Constructor
    * es werden keine neuen Variablen, sondern nur eine neue MEthode hinzugefügt*/
    constructor(_positionX, _positionY, _typ){
        super(_positionX, _positionY, _typ);
	}
    
    /** */
    spawn(){
        
    }
}