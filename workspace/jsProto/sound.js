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
        //this.startSoundtrack = this.game.add.audio('paused', 0.1, true);
        //this.startSoundtrack.onDecoded.add(this.start, this);
        this.playSoundtrack = this.game.add.audio('play', 0.1, true);
        this.pauseSoundtrack = this.game.add.audio('paused', 0.1, true);
        this.gameoverSoundtrack = this.game.add.audio('gameover', 0.1, false);

        this.pickupSound = this.game.add.audio('pickup', 0.1, false);
        this.crashSound = this.game.add.audio('crash', 0.1, false);

    }

    start() {
        this.startSoundtrack.play("",0,0.1);
    }

    play() {
        this.playSoundtrack.play("",0,0.1);
        //this.playSoundtrack.fadeIn(4000);
    }

    paused() {
        this.pauseSoundtrack.play("",0,0.1);
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
            this.startSoundtrack.resume("",0,0.1);
        } else if(sound == 'play') {
            this.playSoundtrack.resume("",0,0.1);
        } else if(sound == 'paused') {
            this.pauseSoundtrack.resume("",0,0.1);
        }
    }

    restart(sound) {
        if(sound == 'start') {
            this.startSoundtrack.restart("",0,0.1);
        } else if(sound == 'play') {
            this.playSoundtrack.restart("",0,0.1);
        } else if(sound == 'paused') {
            this.pauseSoundtrack.restart("",0,0.1);
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
        this.pickupSound.play("",0,0.1);
    }

    crash() {
        this.crashSound.play("",0,0.1);
    }

    gameover() {
        this.gameoverSoundtrack.play("",0,0.1);
    }

}
