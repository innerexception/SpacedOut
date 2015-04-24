define(['planet'], function(Planet){
   var galaxy = function(gameInstance, signal){
        this.dom = document.getElementById('galaxyMap');
        this.planets = [];
        this.players = [];
        this.ships = [];
        this.finishedSignal = signal;
        this.gameInstance = gameInstance;
   };

   galaxy.Constants = {
       Size: {
           small: 10,
           medium: 20,
           large: 30
       },
       Shape: {
           Spiral: 'spiral',
           Circle: 'circle',
           Ring: 'ring'
       },
       Temp: {
           min: -300,
           max: 300
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

       ],
       PlanetNames: [

       ]
   };

   galaxy.prototype = {
       update: function() {

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
           this.generatePlanets(shape, size, spread);
           this.initializePlayer(this._getRandomPlayerName(), false, difficulty);
           for(var i=0; i<ai_players; i++){
               this.initializePlayer(this._getRandomPlayerName(), true, difficulty);
           }
           this.finishedSignal.dispatch();
       },
       _getRandomPlanet: function(shape, spread){
           var temp = this._getRandomPlanetTemp();
           var gravity = this._getRandomPlanetGravity();
           var metal = this._getRandomPlanetMetal();
           return new Planet(
               this._getRandomPlanetName(),
               this._getPlanetSprites(temp, gravity, metal),
               temp, gravity, metal,
               this._getNextPlanetPosition());
       },
       _getNextPlanetPosition: function(){
           return this._positions.shift();
       },
       _getPlanetSprites: function(temp, gravity, metal){
           var cold, barren, poor, hot, fertile, rich;
           if(temp < 10) cold = true;
           if(temp > 100) hot = true;
           if(gravity > 2) barren = true;
           if(gravity < 0.7) barren = true;
           if(metal > 4000) rich = true;

           var sprites = [];

           if(barren) sprites.push(this.Constants.Gravity.BarrenSprite);
           else sprites.push(this.Constants.Gravity.FertileSprite);

           if(cold) sprites.push(this.Constants.Temp.ColdSprite);
           else if(hot) sprites.push(this.Constants.Temp.HotSprite);

           if(poor && (hot || cold)) sprites.push(this.Constants.Metal.PoorSprite);
           else if(rich) sprites.push(this.Constants.Metal.RichSprite);

           return sprites;
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
           var centerX = this.gameInstance.world.width/2;
           var centerY = this.gameInstance.world.height/2;
           switch(shape){
               case this.Constants.Shape.Circle:
                   return this._getCirclePoints(centerX, centerY, centerX/2, spread);
                   break;
               case this.Constants.Shape.Spiral:
                   return this._getSpiralPoints(centerX, centerY, centerX/2, spread);
                   break;
               case this.Constants.Shape.Ring:
                   return this._getRingPoints(centerX, centerY, centerX/2, spread);
                   break;
           }
       },
       _getCirclePoints: function(centerx, centery, r, spread){
           var x, y, points = [];
           for(x=centerx-r; x<=centerx+r; x+=spread){
               for(y=centery-r; y<=centery+r; y+=spread){
                   if (((x*x)+(y*y))<(r*r)) points.push({x:x,y:y});
               }
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

   return galaxy;
});