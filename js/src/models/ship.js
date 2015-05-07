define(['lodash'], function(_){
   var ship = function(planet, player, type, range, speed, weapon, shield, gameInstance){
        this.type = type;
        if(type === this.Constants.ShipTypes.Colony && planet.population > 7500){
            this.colonists = 7500;
            planet._setPopulation(planet.population - 7500);
        }
        this.id = 'ship_'+Math.random();
        this.range = ((range * 0.3) * this.Constants.TechStats.rangeBase) + this.Constants.TechStats.rangeBase;
        this.speed = ((speed * 0.3) * this.Constants.TechStats.speedBase) + this.Constants.TechStats.speedBase;
        this.weapon = weapon;
        this.shield = shield;
        this.spriteGroup = null;
        this.owner = player;
        this.gameInstance = gameInstance;
        this.drawAtLocation(planet.getCenterPoint().x, planet.getCenterPoint().y, {orbit: true, create: true});
   };

   ship.prototype = {
       drawAtLocation: function(x, y, options){
           if(options.create){
               this._destroySpritesAndGroup();
               this._createShipSpriteGroup(x-40,
                   y+(Math.random()*-40), 0.2);
           }
           if(options.warpIn && options.orbit){
               this._playWarpInAndOrbit(this.spriteGroup, x, y);
           }
           else if(options.warpOut){
               this._playWarpOut(this.spriteGroup, x, y);
           }
           else if(options.orbit){
               this._playOrbit(this.spriteGroup, x, y);
           }
           else if(options.move){
               this._playMove(this.spriteGroup, x, y);
           }
       },
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
               if(this.spriteGroup.tween) delete this.spriteGroup.tween;
               this.spriteGroup.destroy(true);
           }
       },
       _onOrbitComplete: function(target, tween){
           if(this.orbitIn){
               this.orbitIn = false;
               this.gameInstance.stageGroup.sendToBack(target);
           }
           else{
               this.orbitIn = true;
               this.gameInstance.stageGroup.bringToTop(target);
           }
       },
       _playOrbit: function(spriteGroup, x, y){
           spriteGroup.orbitTween && spriteGroup.orbitTween.stop();
           spriteGroup.orbitTween = this.gameInstance.add.tween(spriteGroup)
               .to({x: x, y: y+(Math.random()*-40) }, 5000, Phaser.Easing.Linear.None)
               .to({x: x-40, y: y+(Math.random()*-40) }, 5000, Phaser.Easing.Linear.None)
               .to({x: x, y: y }, 5000, Phaser.Easing.Linear.None)
               .loop();
           spriteGroup.orbitTween.onChildComplete.add(this._onOrbitComplete, this);
           spriteGroup.orbitTween.start();
           this.orbitIn = true;
           console.log('running orbit animation on a ship');
       },
       _playWarpInAndOrbit: function(spriteGroup, x, y){
            //TODO
           console.log('running warp in & orbit animation on a ship');
       },
       _playWarpOut: function(spriteGroup, x, y){
           //TODO
           console.log('running warp out animation on a ship');
       },
       _playMove: function(spriteGroup, x, y){
           //TODO
           console.log('running move animation on a ship');
           spriteGroup.orbitTween && spriteGroup.orbitTween.stop();
           spriteGroup.moveTween && spriteGroup.moveTween.stop();
           spriteGroup.moveTween = this.gameInstance.add.tween(spriteGroup)
               .to({x: x, y: y}, 1000, Phaser.Easing.Linear.None);
           spriteGroup.moveTween.start();
       }
   };

   ship.prototype.Constants= {
       TechStats: {
           rangeBase: 150,
           speedBase: 30
       },
       ShipTypes: {
           Colony: 'colony',
           Scout: 'scout',
           Fighter: 'fighter',
           Tanker: 'tanker',
           Dreadnaught: 'dread',
           Platform: 'platform'
       }
   };

   return ship;
});