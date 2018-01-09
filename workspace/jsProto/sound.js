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

        this.playSoundtrack;
        this.gameoverSoundtrack;
        this.pickupSound;
        this.crashSound;

    }

    addMusic() {
        this.playSoundtrack = this.game.add.audio('play', 1, true);
        this.gameoverSoundtrack = this.game.add.audio('gameover', 1, false);
        this.pickupSound = this.game.add.audio('pickup', 1, false);
        this.crashSound = this.game.add.audio('crash', 1, false);

        //this.game.sound.setDecodedCallback([ this.play, this.gameover, this.pickup ], start, this);
    }

    stop(sound) {
        if(sound == 'play') {
            this.playSoundtrack.stop();
        }
    }

    play() {
        this.playSoundtrack.play();
    }

    pickup() {
        this.pickupSound.play();
    }

    crash() {
        this.crashSound.play();
    }

    gameover() {
        this.gameoverSoundtrack.play();
    }

}
