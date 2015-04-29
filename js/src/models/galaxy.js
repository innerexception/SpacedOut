define(['planet'], function(Planet){
   var galaxy = function(gameInstance, signal){
        this.dom = document.getElementById('galaxyMap');
        this.planets = [];
        this.players = [];
        this.ships = [];
        this.finishedSignal = signal;
        this.gameInstance = gameInstance;
        this.StarField = {
            star: this.gameInstance.make.sprite(0, 0, 'tinystar'),
            stars: []
        };
   };

   galaxy.prototype = {
       update: function() {
           if(this.StarField.stars.length > 0){
               for (var i = 0; i < 300; i++)
               {
                   //  Update the stars y position based on its speed
                   this.StarField.stars[i].y += this.StarField.stars[i].speed;

                   if (this.StarField.stars[i].y > this.gameInstance.world.height)
                   {
                       //  Off the bottom of the screen? Then wrap around to the top
                       this.StarField.stars[i].x = this.gameInstance.world.randomX;
                       this.StarField.stars[i].y = -32;
                   }

                   if (i == 0 || i == 100 || i == 200)
                   {
                       //  If it's the first star of the layer then we clear the texture
                       this.StarField.stars[i].texture.renderXY(this.StarField.star, this.StarField.stars[i].x, this.StarField.stars[i].y, true);
                   }
                   else
                   {
                       //  Otherwise just draw the star sprite where we need it
                       this.StarField.stars[i].texture.renderXY(this.StarField.star, this.StarField.stars[i].x, this.StarField.stars[i].y, false);
                   }
               }
           }
       },
       endTurnClicked: function() {

       },
       planetClicked: function() {

       },
       beginShipDrag: function() {

       },
       endShipDrag: function() {

       },
       initializePlayer: function(name, ai, difficulty){
           //set homeworld
           //set initial ships
       },
       generatePlanets: function(shape, size, spread){
           this._positions = this._generatePositions(shape, size, spread);
           for(var i=0; i<this.Constants.Size[size]; i++){
               this.planets.push(this._getRandomPlanet());
           }
       },
       initGalaxy: function(size, shape, ai_players, difficulty, handicap, spread){
           console.log('making galaxy with '+size+', '+shape+', '+ai_players+', '+difficulty+', '+handicap+', '+spread);
           this._initStarField();
           this.generatePlanets(shape, size, spread);
           this.initializePlayer(this._getRandomPlayerName(), false, difficulty);
           for(var i=0; i<ai_players; i++){
               this.initializePlayer(this._getRandomPlayerName(), true, difficulty);
           }
           this.finishedSignal.dispatch();
       },
       _initStarField: function(){
           this.gameInstance.add.sprite(0, 0, this.StarField.texture);

           var texture1 = this.gameInstance.add.renderTexture(this.gameInstance.world.width, this.gameInstance.world.height, 'texture1');
           var texture2 = this.gameInstance.add.renderTexture(this.gameInstance.world.width, this.gameInstance.world.height, 'texture2');
           var texture3 = this.gameInstance.add.renderTexture(this.gameInstance.world.width, this.gameInstance.world.height, 'texture3');

           this.gameInstance.add.sprite(0, 0, texture1);
           this.gameInstance.add.sprite(0, 0, texture2);
           this.gameInstance.add.sprite(0, 0, texture3);

           var t = texture1;
           var s = 0.05;

           //  100 sprites per layer
           for (var i = 0; i < 300; i++)
           {
               if (i == 100)
               {
                   //  With each 100 stars we ramp up the speed a little and swap to the next texture
                   s = 0.1;
                   t = texture2;
               }
               else if (i == 200)
               {
                   s = 0.2;
                   t = texture3;
               }

               this.StarField.stars.push( { x: Math.random()*this.gameInstance.world.width, y: Math.random()*this.gameInstance.world.height+125, speed: s, texture: t });
           }
       },
       _getRandomPlanet: function(shape, spread){
           var temp = this._getRandomPlanetTemp();
           var gravity = this._getRandomPlanetGravity();
           var metal = this._getRandomPlanetMetal();
           console.log('made planet of '+temp+'f, '+gravity + 'g '+metal+' metal');
           return new Planet(
               this.gameInstance,
               this._getRandomPlanetName(),
               temp, gravity, metal,
               this._getNextPlanetPosition());
       },
       _getNextPlanetPosition: function(){
           console.log('remaining positions: '+ this._positions.length);
           return this._positions.shift();
       },
       _getRandomPlanetTemp: function(){
           return (Math.random() * this.Constants.Temp.max) + this.Constants.Temp.min;
       },
       _getRandomPlanetGravity: function(){
           return (Math.random() * this.Constants.Gravity.max) + this.Constants.Gravity.min;
       },
       _getRandomPlanetMetal: function(){
           return (Math.random() * this.Constants.Metal.max) + this.Constants.Metal.min;
       },
       _getRandomPlayerName: function(){
           return this.Constants.PlayerNames[Math.round(Math.random() * (this.Constants.PlayerNames.length-1))];
       },
       _getRandomPlanetName: function(){
           return this.Constants.PlanetNames[Math.round(Math.random() * (this.Constants.PlanetNames.length-1))];
       },
       _generatePositions: function(shape, size, spread){
           console.log('making positions for '+ shape);
           var centerX = this.gameInstance.world.width/2;
           var centerY = this.gameInstance.world.height/3;
           switch(shape){
               case this.Constants.Shape.Circle:
                   return this._getCirclePoints(centerX, centerY, centerX/2, this.Constants.Size[size]);
                   break;
               case this.Constants.Shape.Spiral:
                   return this._getSpiralPoints(centerX, centerY, centerX/2, size);
                   break;
               case this.Constants.Shape.Ring:
                   return this._getRingPoints(centerX, centerY, centerX/2, size);
                   break;
           }
       },
       _getCirclePoints: function(centerx, centery, r, size){
           var x, y, points = [];
           var step = 2*Math.PI/size;  //If size is greater than something, need to make concentric rings here

           for(var theta=0;  theta < 2*Math.PI;  theta+=step)
           {
               x = centerx + r*Math.cos(theta);
               y = centery - r*Math.sin(theta);
               points.push({x:x,y:y});
           }

           return points;
       },
       _getSpiralPoints: function(centerX, centerY, r, spread){
           var x, y, points = [];
           var d;//detail
           //r alters the distance between different tracks of spiral
           var pi = 3.14159265; //more or less
           for(d=0; d<=8*pi; d+=spread) //you can play with the value to be added to d
           {
               x=centerX+(Math.sin(d)*d)*r;
               y=centerY+(Math.sin(d+(pi/2))*(d+(pi/2)))*r;
               points.push({x:x,y:y});
           }
           return points;
       },
       _getRingPoints: function(centerX, centerY, r, spread){
           var x, y, thickness=10, points=[];
           for(x=centerX-r; x<=centerX+r; x+=spread){
               for(y=centerY-r; y<=centerY+r; y+=spread){
                   if ( (((x*x)+(y*y))>(r*r)-(thickness/2)) && (((x*x)+(y*y))<(r*r)+(thickness/2)) ) points.push({x:x,y:y});
               }
           }
           return points;
       }
   };

   galaxy.prototype.Constants = {
        Size: {
            Small: 10,
            Medium: 20,
            Large: 30
        },
        Shape: {
            Spiral: 'Spiral',
            Circle: 'Circle',
            Ring: 'Ring'
        },
        Temp: {
            min: -100,
            max: 200
        },
        Gravity: {
            min: 0.1,
            max: 4.0
        },
        Metal: {
            min: 0,
            max: 20000
        },
        PlayerNames: [
            'Yojimbo'
        ],
        PlanetNames: [
            'Dicks'
        ]
   };

   return galaxy;
});