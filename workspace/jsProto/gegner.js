/**
* Taucht zufällig im Spielfeld auf
* Game Over bei Kollision mit Schlange
* Kindklasse von RandomSpawn, hat damit alle IV/IM aus RandomSpawn und Einzelobjekt
*/
class Gegner extends RandomSpawn {
    
    /** Ruft Super-Constructor auf und übergibt "gegner" als typ */
    constuctor(_positionX, _positionY){
        super(_positionX,_positionY,'gegner');
    }
    
    
}
