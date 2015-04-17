define(['phaser', 'lodash', 'candy', 'galaxyPanel', 'budgetPanel',
    'gameSetupPanel', 'messagePanel', 'planetPanel', 'techPanel', 'battleModal'],
    function(Phaser, _, Candy, GalaxyPanel, BudgetPanel, GameSetupModal,
             MessagePanel, PlanetPanel, TechPanel, BattleModal){

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

        var targetDiv = document.createElement('div');
        targetDiv.id = targetElement;

        document.getElementById('appRoot').addChild(targetDiv);

        //context in these functions is the PHASER OBJECT not our object
        this.gameInstance = new Phaser.Game(h, w, mode, targetElement,{
            preload: this.preload,
            create: this.phaserLoad,
            update: this.update,
            loadComplete: loadingSignal
        });
    };

    OutSpacedApp.prototype = {

        preload: function () {
            //Load all assets here

           //  Load the Google WebFont Loader script
            this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        },

        phaserLoad: function () {
            //1st time load
            this.world.setBounds(0, 0, 1024, 768);
            //Camera init
            this.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            //Fire off our signal so we can change to our app context
            this.viewModels = [];
            this.loadComplete.dispatch();
        },

        appLoad: function(){
            var that = this;
            this.fontInterval = window.setInterval(function(){
                if(window.fontLibraryReady)that.setUpIntro();
            }, 500);
        },

        update: function () {
            _.each(this.gameInstance.viewModels, function(model){
               model.update();
            });
        },

        setUpIntro: function () {

            this.gameInstance.galaxyMapPanel = new GalaxyPanel(this.gameInstance);
            this.gameInstance.battleModal = new BattleModal(this.gameInstance);
            this.gameInstance.budgetPanel = new BudgetPanel(this.gameInstance);
            this.gameInstance.gameSetupModal = new GameSetupModal(this.gameInstance);
            this.gameInstance.messagePanel = new MessagePanel(this.gameInstance);
            this.gameInstance.planetPanel = new PlanetPanel(this.gameInstance);
            this.gameInstance.techPanel = new TechPanel(this.gameInstance);

            //Keyboard init
            //this.cursors = this.gameInstance.input.keyboard.createCursorKeys();

            window.clearInterval(this.fontInterval);
            Candy.drawIntro(this.gameInstance);
            this.gameInstance.camera.focusOnXY(0, 0);
            this.gameInstance.input.onDown.addOnce(this.startNewGame, this);
        },

        startNewGame: function () {
            Candy.clearIntro(this.gameInstance);
            this.gameInstance.gameSetupModal.transitionTo();
        },

        runVictory: function () {

        },

        runLoss: function () {

        }

    };

    return OutSpacedApp;
});

