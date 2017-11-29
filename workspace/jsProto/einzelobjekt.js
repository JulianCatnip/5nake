//Einzelobjekt erstellen, von dem andere Objekte erben können
class Einzelobjekt{
	//in die Constructor-Fkt die Attribute übergeben
	constructor(_positionX, _positionY, _typ){
		this.positionX = _positionX;
		this.positionY = _positionY;
		this.typ = _typ;
	}
	
	/** gibt X-Koordinate der Position zurück */
	getPositionX(){
		return this.positionX;
	}
	
	/** gibt Y-Koordinate der Position zurück */
	getPositionY(){
		return this.positionY;
	}
	
	/** gibt Typ des Objekts zurück */
	getTyp(){
		return this.typ;
	}
}
