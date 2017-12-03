/** Die Schlange soll ihre Körperteile wie die Liste ihre Nodes verwalten */
export default class Schlange {
    
    constructor() {
        this.first = new Object();
        this.first.typ = 'kopf';
        //this.follower = undefined;
    }
    
    /** Körperteil zur Schlange hinzufügen */
    add(){
        first.add();
    }
    
    /** Körperteil aus Schlange entfernen*/
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
        return first.count();
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