define([], function(){
   var player = function(homeWorld, name, isAi, difficulty){
       this.homeWorld = homeWorld.setNewOwner(this);
       this.planets = [homeWorld];
       this.name = name;
       this.isAi = isAi;
       this.difficulty = difficulty;
       this.ships = [];
       //set initial resources / rates / techs
       switch(difficulty){
           case 0:
               this.metal = 20000;
               this.money = 10000;
               break;
           case 1:
               this.metal = 10000;
               this.money = 5000;
               break;
           case 2:
               this.metal = 5000;
               this.money = 2500;
               break;
       }
       this.techs = {
           range: 1,
           speed: 1,
           shield: 0,
           weapon: 1,
           mini: 0,
           extreme: 0
       }
       this.techRate = 0.3;
       this.cashRate = 0.7;
       this.homeWorld.terraformRate = 0.8;
       this.homeWorld.extractionRate = 0.2;
   };
   player.prototype = {

   };
   return player;
});