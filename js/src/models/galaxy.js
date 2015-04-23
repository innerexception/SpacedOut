define([], function(){
   var galaxy = function(gameInstance, signal){
        this.dom = document.getElementById('galaxyMap');
        this.planets = [];
        this.players = [];
        this.ships = [];
        this.finishedSignal = signal;
   };

    galaxy.prototype = {
       update: function() {

       },
       endTurnClicked: function() {

       },
       planetClicked: function() {

       },
       beginShipDrag: function() {

       },
       endShipDrag: function() {

       },
       initializePlayer: function(name, ai, difficulty){
           //set homeworld
           //set initial ships
       },
       generatePlanets: function(shape, number, spread){

       },
       initGalaxy: function(size, shape, ai_players, difficulty, handicap, spread){
           this.generatePlanets(shape, size, spread);
           this.initializePlayer(this.getRandomPlayerName(), false, difficulty);
           for(var i=0; i<ai_players; i++){
               this.initializePlayer(this.getRandomPlayerName(), true, difficulty);
           }
           this.finishedSignal.dispatch();
       }
   };

   return galaxy;
});