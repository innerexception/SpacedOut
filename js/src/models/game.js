define(['phaser', 'lodash', 'candy', 'budgetPanel',
    'gameSetupModal', 'messagePanel', 'planetPanel', 'techPanel', 'galaxy'],
    function(Phaser, _, Candy, BudgetPanel, GameSetupModal,
             MessagePanel, PlanetPanel, TechPanel, Galaxy){

    //Shitty Globals for Google WebFonts
    //  The Google WebFont Loader will look for this object, so create it before loading the script.
    WebFontConfig = {
        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        active: function () {
            window.setTimeout(function(){window.fontLibraryReady = true; console.log('fonts loaded!')}, 1000);
        },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
            families: ['Press Start 2P']
        }
    };

    var OutSpacedApp = function(h, w, mode, targetElement){
        var loadingSignal = new Phaser.Signal();
        loadingSignal.add(this.appLoad, this);

        var updateSignal = new Phaser.Signal();
        updateSignal.add(this.appUpdate, this);

        var targetDiv = document.createElement('div');
        targetDiv.id = targetElement;

        var root = document.getElementById('appRoot');
        root.appendChild(targetDiv);

        //context in these functions is the PHASER OBJECT not our object
        this.gameInstance = new Phaser.Game(h, w, mode, targetElement,{
            preload: this.preload,
            create: this.phaserLoad,
            update: this.update,
            loadComplete: loadingSignal,
            updateSignal: updateSignal
        });
    };

    OutSpacedApp.prototype = {

        preload: function () {
            //Load all assets here
            this.load.image('alphaMask', 'js/res/img/alphaMask.png');
            this.load.image('tinystar', 'js/res/img/tinyStar.png');
           //  Load the Google WebFont Loader script
            this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        },

        phaserLoad: function () {
            //1st time load
            this.world.setBounds(0, 0, 2000, 2000);
            //Camera init
            this.physics.startSystem(Phaser.Physics.ARCADE);
            //Fire off our signal so we can change to our app context
            this.loadComplete.dispatch();
        },

        appLoad: function(){
            var that = this;
            this.fontInterval = window.setInterval(function(){
                if(window.fontLibraryReady)that.setUpIntro();
            }, 500);
        },

        update: function () {
            this.updateSignal.dispatch();
        },

        appUpdate: function(){
            if(this.galaxy) {
                this.galaxy.update();
                this.galaxy.isScrolling = false;
            }
        },

        setUpIntro: function () {
            window.clearInterval(this.fontInterval);

            var galaxyInitFinishedSignal = new Phaser.Signal();
            galaxyInitFinishedSignal.add(this.galaxyInitFinished, this);

            this.galaxy = new Galaxy(this.gameInstance, galaxyInitFinishedSignal);
            this.budgetPanel = new BudgetPanel(this.galaxy);
            this.gameSetupModal = new GameSetupModal(this.galaxy);
            //this.messagePanel = new MessagePanel(this.galaxy);
            //this.planetPanel = new PlanetPanel(this.galaxy);
            //this.techPanel = new TechPanel(this.galaxy);
            this.gameInstance.input.mouse.mouseWheelCallback = this.mouseZoom;
            this.gameInstance.input.mouse.mouseDownCallback = this.mousePanStart;
            this.gameInstance.input.mouse.mouseUpCallback = this.mousePanStop;
            this.gameInstance.input.mouse.mouseOutCallback = this.mousePanStop;
            this.gameInstance.input.mouse.mouseMoveCallback = this.mousePan;
            Candy.drawIntro(this.gameInstance);
            this.gameInstance.camera.focusOnXY(0, 0);
            this.gameInstance.input.onDown.addOnce(this.startNewGame, this);
        },

        mousePanStart: function(){
            this.startMapDrag = true;
        },

        mousePanStop: function(){
            this.startMapDrag = false;
        },

        mousePan: function(){
            if(this.startMapDrag){
                if(this.camera.lastX > this.input.mousePointer.position.x) this.camera.x = this.camera.x+3;
                else this.camera.x = this.camera.x-3;
                this.camera.lastX = this.input.mousePointer.position.x;

                if(this.camera.lastY > this.input.mousePointer.position.y) this.camera.y = this.camera.y+3;
                else this.camera.y = this.camera.y-3;
                this.camera.lastY = this.input.mousePointer.position.y;
            }
        },

        mouseZoom: function(){
            if(this.input.mouse.wheelDelta === 1 && this.camera.scale.x < 2){
                this.camera.scale.x += 0.005;
                this.camera.scale.y += 0.005;
            }
            else if(this.camera.scale.x > 0.5){
                this.camera.scale.x -= 0.005;
                this.camera.scale.y -= 0.005;
            }
        },

        galaxyInitFinished: function(){
            console.log('init panels...');
            //this.budgetPanel.init();
            //this.messagePanel.init();
            //this.planetPanel.init();
            //this.techPanel.init();
            console.log('init panels done.');
            this.inGame = true;
            this.gameInstance.camera.focusOnXY(1000,1000);
            this.gameInstance.camera.scale.x = 1;
            this.gameInstance.camera.scale.y = 1;
        },

        startNewGame: function () {
            Candy.clearIntro(this.gameInstance);
            this.gameSetupModal.transitionTo();
        },

        runVictory: function () {

        },

        runLoss: function () {

        }

    };

    return OutSpacedApp;
});

