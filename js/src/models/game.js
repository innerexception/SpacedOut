define(['phaser', 'lodash', 'candy', 'budgetPanel',
    'gameSetupModal', 'messagePanel', 'planetPanel', 'techPanel', 'galaxy', 'taskBar', 'shipBuilder'],
    function(Phaser, _, Candy, BudgetPanel, GameSetupModal,
             MessagePanel, PlanetPanel, TechPanel, Galaxy, TaskBarPanel, ShipBuilderPanel){

    ////Shitty Globals for Google WebFonts
    ////  The Google WebFont Loader will look for this object, so create it before loading the script.
    //WebFontConfig = {
    //    //  'active' means all requested fonts have finished loading
    //    //  We set a 1 second delay before calling 'createText'.
    //    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //    active: function () {
    //        window.setTimeout(function(){window.fontLibraryReady = true; console.log('fonts loaded!')}, 1000);
    //    },
    //
    //    //  The Google Fonts we want to load (specify as many as you like in the array)
    //    google: {
    //        families: ['Press Start 2P']
    //    }
    //};
    //WebFont.load({
    //    google: {
    //        families: ['Press Start 2P']
    //    }
    //});

    var OutSpacedApp = function(h, w, mode, targetElement){
        var loadingSignal = new Phaser.Signal();
        loadingSignal.add(this.appLoad, this);

        var updateSignal = new Phaser.Signal();
        updateSignal.add(this.appUpdate, this);

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
            //this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
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
            window.setTimeout(function(){
                that.setUpIntro();}, 1000);
            //
            //var that = this;
            //this.fontInterval = window.setInterval(function(){
            //    if(window.fontLibraryReady)that.setUpIntro();
            //}, 500);
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
            this.gameSetupModal = new GameSetupModal(this.galaxy);

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
            //console.log(this.input.mousePointer.position.x + 'x '+ this.input.mousePointer.position.y + 'y');
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
            this.gameInstance.input.mouse.mouseWheelCallback = this.mouseZoom;
            this.gameInstance.input.mouse.mouseDownCallback = this.mousePanStart;
            this.gameInstance.input.mouse.mouseUpCallback = this.mousePanStop;
            this.gameInstance.input.mouse.mouseOutCallback = this.mousePanStop;
            this.gameInstance.input.mouse.mouseMoveCallback = this.mousePan;
            this.planetPanel = new PlanetPanel(this.galaxy);
            this.budgetPanel = new BudgetPanel(this.galaxy);
            this.techPanel = new TechPanel(this.galaxy);
            this.messagePanel = new MessagePanel(this.galaxy);
            this.shipBuilderPanel = new ShipBuilderPanel(this.galaxy);
            this.taskBarPanel = new TaskBarPanel(this.galaxy);
            this.gameInstance.planetClickedSignal = new Phaser.Signal();
            this.gameInstance.planetClickedSignal.add(this.planetPanel.onPlanetClicked, this.planetPanel);
            this.gameInstance.planetClickedSignal.add(this.galaxy.onPlanetClicked, this.galaxy);
            this.gameInstance.techPanelSignal = new Phaser.Signal();
            this.gameInstance.techPanelSignal.add(this.techPanel.toggle, this.techPanel);
            this.gameInstance.budgetPanelSignal = new Phaser.Signal();
            this.gameInstance.budgetPanelSignal.add(this.budgetPanel.toggle, this.budgetPanel);
            this.gameInstance.messagePanelSignal = new Phaser.Signal();
            this.gameInstance.messagePanelSignal.add(this.messagePanel.toggle, this.messagePanel);
            this.gameInstance.shipBuilderPanelSignal = new Phaser.Signal();
            this.gameInstance.shipBuilderPanelSignal.add(this.shipBuilderPanel.toggle, this.shipBuilderPanel);
            console.log('init panels done.');
            this.inGame = true;
            this.gameInstance.camera.focusOnXY(1000,1000);
            this.gameInstance.camera.scale.x = 0.6;
            this.gameInstance.camera.scale.y = 0.6;
            this.taskBarPanel._dom.children[1].style.display = 'inherit';
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

