import 'pixi';
import 'p2';
import 'phaser';

export default class Main {

    constructor(game, canvasWidth, canvasHeight) {
        this.game = game;
        this.cursor;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        let Schlange = require('./schlange.js').default; // klassen import
        this.schlange = new Schlange();

        let View = require('./view.js').default; // klassen import
        this.view = new View(this.game, this.canvasWidth, this.canvasHeight, this.schlange);
    }

    preload() {
        this.game.stage.backgroundColor = "#FFF";
        this.game.load.image('spieler', '../images/spieler.jpg');
        this.game.load.image('stein', '../images/stein.jpg');
    }

    create() {
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.view.zeichneSchlange();
    }

    update() {
        if(this.cursor.up.isDown) {
            schlange.first.image = game.add.image(200, 200, 'spieler');
        }
    }

    toString() {
        var test = "";
        console.log(test + this.cursor.up.isDown);
    }



}
/** Start sobald Browserfenster geladen */
window.addEventListener('load', () => {

    const canvasWidth = 900;
    const canvasHeight = 660;

    /** PHASER GAME OBJEKT */
    let game = new Phaser.Game(
        canvasWidth,    // canvas breite
        canvasHeight,   // canvas höhe
        Phaser.CANVAS,  // rendering-typ
        'game-box',     // id des elternknotens in dem canvas erzeugt werden soll
        {   
            // funktionen die implementiert werden müssen
            preload: preload, // Dateien laden
            create: create,   // Objekte erzeugen
            update: update    // gameloop
        }
    );

    let main = new Main(game, canvasWidth, canvasHeight);

    function preload() {
        main.preload();
    }
    function create() {
        main.create();
    }
    function update() {
        main.update();
    }

    main.toString();


/* !!!!!!!!!! ALT !!!!!!!!!!!!!!
    // Schlange (Model) erzeugen
    const Schlange = require('./schlange.js').default; // klassen import
    const schlange = new Schlange();

    // View erzeugen
    const View = require('./view.js').default; // klassen import
    const view = new View(game, canvasWidth, canvasHeight, schlange);

    //var cursor;

    // Steuerung erzeugen
    //const Controller = require('./controller.js').default; // klassen import
    //const controller = new Controller(game, cursor, view, canvasWidth, canvasHeight);

    /** SPRITES LADEN 
    function preload() {
        game.stage.backgroundColor = "#FFF"; // hintergrundfarbe canvas

        game.load.image('spieler', '../images/spieler.jpg');
        game.load.image('stein', '../images/stein.jpg');
    }

    /** OBJEKTE ERZEUGEN 
    function create() {

        // Schlange erzeugen
        view.zeichneSchlange(); // bisher nur kopf implementiert

        // Mauer aus Steinen (Model) erzeugen

        // random pickup (Model) erzeugen

        // Steuerung erzeugen
        //cursor = game.input.keyboard.createCursorKeys();

        // test
        //view.test();


    }


    /** GAMELOOP 
    function update() {
        
        /*controller.updateLaufrichtung();

        var geschwindigkeit = 20;
        var frameCounter = 0;
        frameCounter++;

        if (frameCounter == geschwindigkeit) {

            controller.bewegeSpieler(); // spieler bewegen

            if (controller.laufrichtung != undefined) {
                //removeTail(); // ?
            }

            frameCounter = 0;
        }
        // kollisionen prüfen
        // controller updaten
        // view updaten
    }
*/

});