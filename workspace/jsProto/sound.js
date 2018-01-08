import 'pixi';
import 'p2';
import 'phaser';

/**
* Sound
*/
export default class Sound {

    /**
    * Constructor
    * @param game : Phaser.Game-Objekt
    * @param schlange : Schlangen-Objekt
    */
	constructor(game) {

        /**
        * Phaser.Game Objekt
        * Wird benötigt um auf jegliche Funktionen des Frameworks zuzugreifen.
        */
        this.game = game;

        this.play;
        this.gameover;

    }

    addMusic() {
        this.play = this.game.add.audio('play', 1, true);
        this.gameover = this.game.add.audio('gameover', 1, true);
    }

    startMusic() {
        this.play.play();
    }

    stopMusic() {
        this.play.stop();
        //this.gameover.stop();
    }

    gameoverMusic() {
        this.gameover.play();
    }

}
