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
            //Mouse moves camera
            if(this.inGame){
                var pointerPosition = this.gameInstance.input.mousePointer.position;
                //console.log('x:'+pointerPosition.x +', y:'+pointerPosition.y);
                var camera = this.gameInstance.camera;
                if(pointerPosition.x >= this.gameInstance.width * 0.9 && camera.x <= this.gameInstance.width * 0.9){
                    camera.x+=5;
                    this.galaxy.isScrolling = true;
                }
                if(pointerPosition.y >= this.gameInstance.height * 0.9 && camera.y <= this.gameInstance.height * 0.9){
                    camera.y+=5;
                    this.galaxy.isScrolling = true;
                }
                if(pointerPosition.x < 25 && camera.x > 0){
                    camera.x-=5;
                    this.galaxy.isScrolling = true;
                }
                if(pointerPosition.y < 120 && camera.y > 0){
                    camera.y-=5;
                    this.galaxy.isScrolling = true;
                }
            }
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

            Candy.drawIntro(this.gameInstance);
            this.gameInstance.camera.focusOnXY(0, 0);
            this.gameInstance.input.onDown.addOnce(this.startNewGame, this);
        },

        galaxyInitFinished: function(){
            console.log('init panels...');
            //this.budgetPanel.init();
            //this.messagePanel.init();
            //this.planetPanel.init();
            //this.techPanel.init();
            console.log('init panels done.');
            this.inGame = true;
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

