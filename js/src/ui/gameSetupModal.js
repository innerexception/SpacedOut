define([], function(){
   var gameSetupModal = function(mapDiv, gameInstance){
       var targetDiv = document.createElement('div');
       targetDiv.id = 'gameSetupModal';
       mapDiv.addChild(targetDiv);
   };

   gameSetupModal.prototype = {
       sizeSelected: function(){

       },
       spreadSelected: function(){

       },
       playersSelected: function(){

       },
       difficultySelected: function(){

       },
       startGame: function(){
           
       }
   };

   return gameSetupModal;
});