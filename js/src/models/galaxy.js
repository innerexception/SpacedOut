define([], function(){
   var galaxy = function(gameInstance){
        this.dom = document.getElementById('galaxyMap');
        this.planets = [];
        this.players = [];
        this.ships = [];
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

       }
   };

   return galaxy;
});