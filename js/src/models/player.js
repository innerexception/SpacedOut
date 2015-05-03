define(['lodash'], function(_){
   var player = function(homeWorld, name, isAi, difficulty, galaxy){
       this.homeWorld = homeWorld.setNewOwner(this);
       this.name = name;
       this.isAi = isAi;
       this.difficulty = difficulty;
       this.galaxy = galaxy;
       this.moneyIncome = 0;
       this.metalIncome = 0;
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
           range: {level: 1, rate: 20},
           speed: {level: 1, rate: 20},
           shield: {level: 0, rate: 20},
           weapon: {level: 1, rate: 20},
           mini: {level: 0, rate: 20},
           radical: {rate: 0}
       }
       this.techRate = 30;
       this.cashRate = 70;
   };
   player.prototype = {
       getIncome: function(){
           _.each(this.galaxy.planets, function(planet){
               if(planet.owner.name === this.name){
                   this.tempMoney += planet.income;
                   this.metal += planet.miningChange;
                   planet.refreshResources();
               }
           }, this);
       },
       refreshTechs: function(){
           var techMoney = this.tempMoney * (this.techRate /100);
           this.money = this.tempMoney - techMoney;

       },
       setTechPercent: function(percent){
           this.techRate = percent;
           this.cashRate = 100-percent;
           console.log('techrate is now '+percent + ' cashrate is now '+this.cashRate);
       },
       setIndividualTechRate: function(type, percent){
           var delta = 100-percent;
           var subtractions = delta / 6;

           this.techs.range.rate -= subtractions;
           this.techs.speed.rate -= subtractions;
           this.techs.shield.rate -= subtractions;
           this.techs.weapon.rate -= subtractions;
           this.techs.mini.rate -= subtractions;
           this.techs.radical.rate -= subtractions;
           this.techs[type].rate += subtractions;

           if(type !== 'radical' && delta % 6 !== 0){
               //Excess goes to rad first
               this.techs.radical.rate -= delta % 6;
           }
           else if(delta % 6 !== 0 && type === 'radical'){
               //Then comes from mini
               this.techs.mini.rate -= delta % 6;
           }

           console.log('tech rates are now '+ this.techs);

       }
   };
   return player;
});