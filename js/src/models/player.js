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
           range: {level: 1, rate: 20, locked: false},
           speed: {level: 1, rate: 20, locked: false},
           shield: {level: 0, rate: 20, locked: false},
           weapon: {level: 1, rate: 20, locked: false},
           mini: {level: 0, rate: 20, locked: false},
           radical: {rate: 0, locked: false}
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

           //subtract amount from locked techs
           delta -= this._getLockedTechAmount();

           var unlockedTechs = this._getUnLockedTechsCount();
           var subtractions = delta / unlockedTechs;

           if(subtractions > 0){
               if(type!=='range' && !this.techs.range.locked)this.techs.range.rate = subtractions;
               if(type!=='speed' && !this.techs.speed.locked)this.techs.speed.rate = subtractions;
               if(type!=='shield' && !this.techs.shield.locked)this.techs.shield.rate = subtractions;
               if(type!=='weapon' && !this.techs.weapon.locked)this.techs.weapon.rate = subtractions;
               if(type!=='mini' && !this.techs.mini.locked)this.techs.mini.rate = subtractions;
               if(type!=='radical' && !this.techs.radical.locked)this.techs.radical.rate = subtractions;

               if(type !== 'range' && delta % unlockedTechs !== 0 && !this.techs.range.locked){
                   //Excess goes to range first
                   this.techs.range.rate += delta % unlockedTechs;
               }
               else if(delta % unlockedTechs !== 0){
                   //Then comes from mini
                   this.techs.mini.rate += delta % unlockedTechs;
               }
               this.techs[type].lastRate = this.techs[type].rate;
           }
           else{
               this.techs[type].rate = this.techs[type].lastRate
           }

           console.log('range: '+this.techs.range.rate
                        +' speed: '+this.techs.speed.rate
                        +' shield: '+this.techs.shield.rate
                        +' weapon: '+this.techs.weapon.rate
                        +' mini: '+this.techs.mini.rate
                        +' radical: '+this.techs.radical.rate);

       },
       lockTechValue: function(type, percent){
           this.techs[type].locked = !this.techs[type].locked;
       },
       _getLockedTechAmount: function(){
           var lockedAmt = 0;
           _.forOwn(this.techs, function(tech){
               if(tech.locked) lockedAmt+=tech.rate;
           });
           return lockedAmt
       },
       _getUnLockedTechsCount: function(){
           var locked = 6;
           _.forOwn(this.techs, function(tech){
               if(tech.locked) locked--;
           });
           return locked;
       }
   };
   return player;
});