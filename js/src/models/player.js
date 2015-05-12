define(['lodash'], function(_){
   var player = function(homeWorld, name, isAi, difficulty, galaxy){
       this.name = name;
       this.isAi = isAi;
       this.difficulty = difficulty;
       this.galaxy = galaxy;
       this.moneyIncome = 7500;
       this.metalIncome = 0;
       this.fleets = [];
       this.designs = [];
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
       this.homeWorld = homeWorld.setNewOwner(this, 100000, this.galaxy.clientPlayer, !this.isAi);
   };
   player.prototype = {
       getIncomeAndResearch: function(){
           this.moneyIncome = 0;
           _.each(this.galaxy.planets, function(planet){
               if(planet.owner && planet.owner === this){
                   this.moneyIncome += planet.income;
                   this.metal += planet.miningChange;
                   planet.extractResources();
               }
           }, this);
           this.refreshTechs();
           this.galaxy.gameInstance.budgetUpdatedSignal.dispatch();
       },
       refreshTechs: function(){
           var techMoney = this.moneyIncome * (this.techRate / 100);
           this.money += Math.round(this.moneyIncome * (this.cashRate / 100));
           _.forOwn(this.techs, function(tech, name){
               tech.progress += (techMoney * (tech.rate/100)) / 500;  //500 per point
               if(tech.progress >= 100){
                   tech.progress = 0;
                   tech.level++;
                   this.galaxy.gameInstance.messageSignal.dispatch('You discovered: '+this.getTechName(name, tech.level));
               }
           }, this);
       },
       setTechPercent: function(percent){
           this.setPlanetBudgetPercent('techRate', percent);
       },
       setCashPercent: function(percent){
           this.setPlanetBudgetPercent('cashRate', percent);
       },
       setPlanetBudgetPercent: function(planet, percent){
           var delta = 100-percent;
           var planets = this.getPlanets();
           var subtractions = parseFloat((delta / (planets.length+1)).toFixed(1));
           var leftOvers = delta % planets.length+1; //length-1 plus the two sliders

           if(subtractions > 0){
               _.each(planets, function(planetObj){
                   if(planet !== planetObj){
                       planetObj.budgetPercent = subtractions;
                       planetObj.budgetAmount = Math.round((subtractions/100) * this.moneyIncome);
                       planetObj.refreshTerraformNumbers();
                   }
               }, this);
               if(leftOvers !== 0){
                   //Then goes to cash
                   this.cashRate += leftOvers;
               }

               if(planet === 'techRate'){
                   this.techRate = percent;
                   this.cashRate = subtractions;
                   this.lastTechRate = percent;
               }
               else if(planet === 'cashRate'){
                   this.cashRate = percent;
                   this.techRate = subtractions;
                   this.lastCashRate = percent;
               }
               else{
                   this.cashRate = subtractions;
                   this.techRate = subtractions;
                   planet.lastRate = planet.budgetPercent;
                   planet.budgetAmount = Math.round(this.moneyIncome * (planet.budgetPercent/100));
                   planet.refreshTerraformNumbers();
               }
           }
           else{
               if(planet === 'techRate'){
                   this.techRate = this.lastTechRate;
               }
               else if(planet === 'cashRate'){
                   this.cashRate = this.lastCashRate;
               }
               else{
                   planet.budgetPercent = planet.lastRate;
                   planet.refreshTerraformNumbers();
               }
           }

       },
       getTechName: function(name, level){
           return this.Constants.TechNames[name][level];
       },
       getPlanets: function(){
           return _.filter(this.galaxy.planets, function(planet){
               return planet.owner && planet.owner === this;
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

   player.prototype.Constants = {
       TechNames: {
           range: {
               1: 'external tanks',
               2: 'solar sail',
               3: 'fuel scoop'
           },
           speed: {
               1: 'afterburner',
               2: 'ion drive',
               3: 'nuclear drive'
           },
           shield: {
               1: 'ablative plating',
               2: 'reactive hull',
               3: 'ceramic reflective armor'
           },
           weapon: {
               1: 'gatling gun',
               2: 'rail gun',
               3: 'emp gun'
           },
           mini: {
               1: 'nano transistors',
               2: 'probability matrix',
               3: 'gel packs'
           },
           radical: {
               1: 'bio ship',
               2: 'tech bump',
               3: 'armageddon'
           }
       }
   };

   return player;
});