define(['lodash'], function(_){
   var ship = function(planet, player, type, range, speed, weapon, shield, gameInstance){
        this.type = type;
        this.id = 'ship_'+Math.random();
        this.range = range;
        this.speed = speed;
        this.weapon = weapon;
        this.shield = shield;
        this.spriteGroup = null;
        this.owner = player;
        this.gameInstance = gameInstance;
        this.destination = null;
        this.distanceToDestination = null;
        this.setLocation(planet);
   };

   ship.prototype = {
       _createShipSpriteGroup: function(x, y, scale){
           this.spriteGroup = this.gameInstance.add.group(this.gameInstance.stageGroup);
           this.spriteGroup.create(0,0,this.type+'_range_'+this.range);
           this.spriteGroup.create(10,0,this.type+'_speed_'+this.speed);
           this.spriteGroup.create(20,0,this.type+'_shield_'+this.shield);
           this.spriteGroup.create(40,0,this.type+'_weapon_'+this.weapon);
           if(scale){
               this.spriteGroup.scale.y = scale;
               this.spriteGroup.scale.x = scale;
           }
           this.spriteGroup.x = x;
           this.spriteGroup.y = y;
           return this.spriteGroup;
       },
       _destroySpritesAndGroup: function(){
           if(this.spriteGroup){
               this.spriteGroup.tween.destroy();
               this.spriteGroup.destroy(true);
           }
       },
       setLocation: function(planet){
           this.destination = null;
           this.distanceToDestination = null;
           this._setLocation(planet);
           if(!planet.owner && this.type === 'colony'){
               planet.setNewOwner(this.owner);
           }
           else if(planet.owner.name != this.owner.name){
               //TODO
               //planet.queueShipForCombat(this);
           }
       },
       _setLocation: function(planet){
           this._destroySpritesAndGroup();

           //draws the ship warping in and orbiting the planet
           this._createShipSpriteGroup(planet.position.x-20,
               planet.position.y+(Math.random()*60), 0.2);

           //TODO add warping in animation here:

           this.spriteGroup.tween = this.gameInstance.add.tween(this.spriteGroup)
               .to({x: planet.position.x+40, y: planet.position.y+(Math.random()*60) }, 10000, Phaser.Easing.Linear.None)
               .to({x: planet.position.x-20, y: planet.position.y+(Math.random()*60) }, 10000, Phaser.Easing.Linear.None)
               .loop();
           this.spriteGroup.tween.onChildComplete.add(this._onOrbitComplete, this);
           this.spriteGroup.tween.start();
           this.orbitIn = true;
           this.location = planet;
       },
       _onOrbitComplete: function(target, tween){
           if(this.orbitIn){
               this.orbitIn = false;
               this.gameInstance.world.sendToBack(target);
           }
           else{
               this.orbitIn = true;
               this.gameInstance.world.bringToTop(target);
           }
       }
   };

   return ship;
});