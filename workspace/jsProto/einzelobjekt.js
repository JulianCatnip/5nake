//Einzelobjekt erstellen, von dem andere Objekte erben können
class Einzelobjekt{
	//in die Constructor-Fkt die Attribute übergeben
	constructor(_positionX, _positionY, _typ){
		this.positionX = _positionX;
		this.positionY = _positionY;
		this.typ = _typ;
	}
    //zusätzliche Fkt
	drawObject(){
			
	}
}
