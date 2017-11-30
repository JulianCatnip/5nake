/**
* Taucht zufällig im Spielfeld auf
* Verkürzt Schlange bei Kollision um ein Körperteil
* Kindklasse von RandomSpawn, hat damit alle IV/IM aus RandomSpawn und Einzelobjekt
*/
class PickUp extends RandomSpawn {
    
    /** Ruft Super-Constructor auf und übergibt "pickup" als typ */
    constuctor(_positionX, _positionY){
        super(_positionX,_positionY,'pickup');
    }
    
    
    
}
