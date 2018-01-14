import 'pixi';
import 'p2';
import 'phaser';

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////** SOUND **/////////////////////////////////
////////////////////// Verwaltet die Musik des Spieles. /////////////////////
/////////////////////////////////////////////////////////////////////////////
export default class Sound {

    /**
    * Constructor
    * @param game : Phaser.Game-Objekt
    */
	constructor(game) {

        /**
        * Phaser.Game Objekt
        * Wird benötigt um auf jegliche Funktionen des Frameworks zuzugreifen.
        */
        this.game = game;

        /**
        * Soundtracks der Spiel-Stände.
        */
        this.playSoundtrack;
        this.pauseSoundtrack;
        this.gameoverSoundtrack;

        /**
        * Soundeffekte der Kollisionen.
        */
        this.pickupSound;
        this.crashSound;

    }

    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////** SOUND-DATEIEN ZUORDNEN **/////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Sound initialisieren.
    */
    addMusic() {

        this.playSoundtrack = this.game.add.audio('play', 0.1, true);
        this.pauseSoundtrack = this.game.add.audio('paused', 0.1, true);
        this.gameoverSoundtrack = this.game.add.audio('gameover', 0.1, false);

        this.pickupSound = this.game.add.audio('pickup', 0.1, false);
        this.crashSound = this.game.add.audio('crash', 0.1, false);

    }

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////** SOUNDEFFEKTE ABSPIELEN **////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Pickup Soundeffekt abspielen.
    */
    pickup() {
        this.pickupSound.play("",0,0.1);
    }

    /**
    * Gegner-Kollision Soundeffekt abspielen.
    */
    crash() {
        this.crashSound.play("",0,0.1);
    }

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////** SOUNDTRACKS ABSPIELEN **/////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Play-Status Soundtrack abspielen.
    */
    play() {
        this.playSoundtrack.play("",0,0.1);
        //this.playSoundtrack.fadeIn(4000);
    }

    /**
    * Pause-Status Soundtrack abspielen.
    */
    paused() {
        this.pauseSoundtrack.play("",0,0.1);
    }

    /**
    * Gameover-Status Soundtrack abspielen.
    */
    gameover() {
        this.gameoverSoundtrack.play("",0,0.1);
    }

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////** SOUNDTRACKS VERWALTEN **/////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Soundtrack pausieren.
    * @param sound : Soundtrack der pausiert werden soll.
    */
    pause(sound) {
        if(sound == 'start') {
            this.startSoundtrack.pause();
        } else if(sound == 'play') {
            this.playSoundtrack.pause();
        } else if(sound == 'paused') {
            this.pauseSoundtrack.pause();
        }
    }

    /**
    * Pausierten Soundtrack weiterspielen.
    * @param sound : Soundtrack der weitergespielt werden soll.
    */
    resume(sound) {
        if(sound == 'start') {
            this.startSoundtrack.resume("",0,0.1);
        } else if(sound == 'play') {
            this.playSoundtrack.resume("",0,0.1);
        } else if(sound == 'paused') {
            this.pauseSoundtrack.resume("",0,0.1);
        }
    }

    /**
    * Soundtrack neustarten.
    * @param sound : Soundtrack der neu gestartet werden soll.
    */
    restart(sound) {
        if(sound == 'start') {
            this.startSoundtrack.restart("",0,0.1);
        } else if(sound == 'play') {
            this.playSoundtrack.restart("",0,0.1);
        } else if(sound == 'paused') {
            this.pauseSoundtrack.restart("",0,0.1);
        }
    }

    /**
    * Soundtrack stoppen.
    * @param sound : Soundtrack der gestoppt werden soll.
    */
    stop(sound) {
        if(sound == 'start') {
            this.startSoundtrack.stop();
        } else if(sound == 'play') {
            this.playSoundtrack.stop();
        } else if(sound == 'paused') {
            this.pauseSoundtrack.stop();
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////** ALLE SOUNDTRACKS ZURÜCKSETZEN **/////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /**
    * Alle Sounds stoppen und entfernen.
    */
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

}
