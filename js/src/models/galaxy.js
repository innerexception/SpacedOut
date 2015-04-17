define(['galaxy'], function(GalaxyModel){
   var GalaxyPanel = function(gameInstance){
        this.model = new GalaxyModel();
        gameInstance.viewModels.push(this.model);
        this.dom = document.getElementById('galaxyMap');
        this.planets = [];
        this.players = [];
        this.ships = [];
   };

   GalaxyPanel.prototype = {
       update: function() {

       },
       endTurnClicked: function() {

       },
       planetClicked: function() {

       },
       beginShipDrag: function() {

       },
       endShipDrag: function() {

       }
   };

   return GalaxyPanel;
});