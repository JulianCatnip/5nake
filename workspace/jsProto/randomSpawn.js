// DEPRECATED //
/**import { Einzelobjekt } from './einzelobjekt';

/** Das Objekt ist als "Elternklasse" für Gegner und Pickup gedacht und fügt dem Prototypen Einzelobjekt eine MEthode spawn hinzu 
class RandomSpawn extends Einzelobjekt{
    
    //Constructor-Aufruf wie vorher, nur hier mit "super", um 
    //Vererbung mit Java nachzuempfinden. Tatsächlicher Zugriff durch Prototyping
    /** Aufruf von super-Constructor
    * es werden keine neuen Variablen, sondern nur eine neue MEthode hinzugefügt
    constructor(maxX, maxY, typ){
        super(Math.round(1 + maxX* Math.random(),
					Math.round(1 + maxY* Math.random())),typ);
	}
}
/* RandomSpawn evtl in den Controller übernehmen */