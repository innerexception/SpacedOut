define(['lodash'], function(_){
    var fleet = function(ships, planet, galaxy){
        this.ships = ships;
        this.id = 'fleet_'+Math.random();
        this.name = this._getNextFleetName();
        this.location = planet;
        planet.fleets.push(this);
        this.galaxy = galaxy;
    };
    fleet.prototype = {
        addShip: function(ship){
            this.ships.push(ship);
        },
        removeShip: function(shipObj){
            this.ships = _.filter(this.ships, function(ship){
                return ship.id !== shipObj.id;
            });
        },
        splitFleet: function(){
            var halfArr;
            _.times(Math.round(this.ships.length/2), function(){
                halfArr.push(this.ships.pop());
            }, this);
            return new fleet(halfArr);
        },
        setDestination: function(planet){
            this.distanceToDestination = this.galaxy.gameInstance.physics.arcade.distanceBetween(this.location.sprites[0], planet.sprites[0]);
            this.location.removeFleet(this);
            this.location = null;
            this.destination = planet;
            this._startTravel();
        },
        _startTravel: function(){
            //TODO add warp out animation
        },
        setLocation: function(planet){
            this.location.removeFleet(this);
            this.location = planet;
            planet.fleets.push(this);
            _.each(this.ships, function(ship){
                ship.setLocation(planet);
            });
        },
        _getNextFleetName: function(){
            return this.Constants.FleetNames[Math.round(Math.random()*this.Constants.FleetNames.length-1)];
        }
    };

    fleet.prototype.Constants = {
        FleetNames: [
            'Alpha', 'Beta', 'Gamma'
        ]
    };

    return fleet;
});