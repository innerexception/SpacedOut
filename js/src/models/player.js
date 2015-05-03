define(['lodash'], function(_){
   var player = function(homeWorld, name, isAi, difficulty, galaxy){
       this.name = name;
       this.isAi = isAi;
       this.difficulty = difficulty;
       this.galaxy = galaxy;
       this.moneyIncome = 7500;
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
           range: {level: 1, rate: 20, locked: false, progress: 0},
           speed: {level: 1, rate: 20, locked: false, progress: 0},
           shield: {level: 0, rate: 20, locked: false, progress: 0},
           weapon: {level: 1, rate: 20, locked: false, progress: 0},
           mini: {level: 0, rate: 20, locked: false, progress: 0},
           radical: {rate: 0, locked: false, progress: 0}
       };
       this.techRate = 30;
       this.cashRate = 70;
       this.homeWorld = homeWorld.setNewOwner(this);
   };
   player.prototype = {
       getIncomeAndResearch: function(){
           this.moneyIncome = 0;
           _.each(this.galaxy.planets, function(planet){
               if(planet.owner && planet.owner.name === this.name){
                   this.moneyIncome += planet.income;
                   this.metal += planet.miningChange;
                   planet.extractResources();
               }
           }, this);
           this.refreshTechs();
       },
       refreshTechs: function(){
           var techMoney = this.moneyIncome * (this.techRate /100);
           this.money = this.moneyIncome - techMoney;
           _.forOwn(this.techs, function(tech, name){
               tech.progress += (techMoney * (tech.rate/100)) / 500;  //500 per point
               if(tech.progress >= 100){
                   tech.progress = 0;
                   tech.level++;
                   this.galaxy.messageSignal.dispatch('You discovered: '+this.getTechName(name, tech.level));
               }
           }, this);
       },
       setTechPercent: function(percent){
           this.techRate = percent;
           this.cashRate = 100-percent;
           console.log('techrate is now '+percent + ' cashrate is now '+this.cashRate);
       },
       setPlanetBudgetPercent: function(planet, percent){
           var delta = 100-percent;
           var planets = this.getPlanets();
           var subtractions = parseFloat((delta / (planets.length-1)).toFixed(1));
           var leftOvers = delta % planets.length-1;

           if(subtractions > 0){
               _.each(planets, function(planetObj){
                   if(planet !== planetObj){
                       planetObj.budgetPercent = subtractions;
                       planetObj.budgetAmount = Math.round((subtractions/100) * this.moneyIncome);
                       planetObj.refreshTerraformNumbers();
                   }
               }, this);
               if(planet !== this.homeWorld && leftOvers !== 0){
                   //Excess goes to the homeworld
                   this.homeWorld.budgetPercent += leftOvers;
                   this.homeWorld.budgetAmount = Math.round(this.moneyIncome * (this.homeWorld.budgetPercent/100));
               }
               else if(delta % planets.length !== 0){
                   //Then goes to random planet
                   planet.budgetPercent += leftOvers;
               }
               planet.lastRate = planet.budgetPercent;
               planet.budgetAmount = Math.round(this.moneyIncome * (planet.budgetPercent/100));
           }
           else{
               planet.budgetPercent = planet.lastRate
           }
           planet.refreshTerraformNumbers();
       },
       getTechName: function(name, level){
           //TODO
       },
       getPlanets: function(){
           return _.filter(this.galaxy.planets, function(planet){
               return planet.owner && planet.owner.name === this.name;
           }, this);
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