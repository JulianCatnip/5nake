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
        this.pauseSoundtrack;
        this.gameoverSoundtrack;

        this.pickupSound;
        this.crashSound;

    }

    addMusic() {
        //this.startSoundtrack = this.game.add.audio('paused', 1, true);
        //this.startSoundtrack.onDecoded.add(this.start, this);
        this.playSoundtrack = this.game.add.audio('play', 1, true);
        this.pauseSoundtrack = this.game.add.audio('paused', 1, true);
        this.gameoverSoundtrack = this.game.add.audio('gameover', 1, false);

        this.pickupSound = this.game.add.audio('pickup', 1, false);
        this.crashSound = this.game.add.audio('crash', 1, false);

    }

    start() {
        this.startSoundtrack.play();
    }

    play() {
        this.playSoundtrack.play();
        //this.playSoundtrack.fadeIn(4000);
    }

    paused() {
        this.pauseSoundtrack.play();
    }

    pause(sound) {
        if(sound == 'start') {
            this.startSoundtrack.pause();
        } else if(sound == 'play') {
            this.playSoundtrack.pause();
        } else if(sound == 'paused') {
            this.pauseSoundtrack.pause();
        }
    }

    resume(sound) {
        if(sound == 'start') {
            this.startSoundtrack.resume();
        } else if(sound == 'play') {
            this.playSoundtrack.resume();
        } else if(sound == 'paused') {
            this.pauseSoundtrack.resume();
        }
    }

    restart(sound) {
        if(sound == 'start') {
            this.startSoundtrack.restart();
        } else if(sound == 'play') {
            this.playSoundtrack.restart();
        } else if(sound == 'paused') {
            this.pauseSoundtrack.restart();
        }
    }

    stop(sound) {
        if(sound == 'start') {
            this.startSoundtrack.stop();
        } else if(sound == 'play') {
            this.playSoundtrack.stop();
        } else if(sound == 'paused') {
            this.pauseSoundtrack.stop();
        }
    }

    reset() {
        this.playSoundtrack.stop();
        this.pauseSoundtrack.stop();
        this.gameoverSoundtrack.stop();

        this.pickupSound.stop();
        this.crashSound.stop();

        this.playSoundtrack.destroy();
        this.pauseSoundtrack.destroy();
        this.gameoverSoundtrack.destroy();

        this.pickupSound.destroy();
        this.crashSound.destroy();

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
