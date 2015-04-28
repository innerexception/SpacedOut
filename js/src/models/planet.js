define(['worldGen', 'illuminated'], function(worldGen, illuminated){
   var planet = function(gameInstance, name, temp, gravity, metal, position){
       this.position = position;
       this.name = name;
       this.temp = temp;
       this.gravity = gravity;
       this.metal = metal;
       this.gameInstance = gameInstance;
       this.sprite = this._getPlanetSprite(temp, gravity, metal, position);

   };
   planet.prototype = {
       _getPlanetSprite: function(temp, gravity, metal, position){
           //Grab updated canvas from generator
           if(this.sprite)this.sprite.destroy();

           var bmd = this.gameInstance.add.bitmapData(100,100);

           worldGen.generateWorldCanvas(bmd.canvas, temp, gravity, metal);

           var sprite = this.gameInstance.add.sprite(position.x, position.y, bmd);

           bmd = null;

           //Create sprite mask
           if(!this.mask) {
               this.mask = this.gameInstance.add.graphics(position.x, position.y);
               //	Shapes drawn to the Graphics object must be filled.
               this.mask.beginFill(0xffffff);
               //	Here we'll draw a circle
               this.mask.drawCircle(50, 50, 50);
               //	And apply it to the Sprite
               sprite.mask = this.mask;
           }

           ////Setup tweens for sprite behind mask
           //if(!this.mask.tween) this.mask.tween = this.gameInstance.add.tween({
           //
           //});

           //Add light source


           return sprite;
       }
   };
   return planet;
});