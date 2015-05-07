define(['lodash'], function(_){
    var fleet = function(ships, planet, galaxy){
        this.ships = ships;
        this.speed = this._getMaxFleetSpeed();
        this.range = this._getMaxFleetRange();
        this.id = 'fleet_'+Math.random();
        this.name = this._getNextFleetName();
        this.location = planet;
        this.inTransit = false;
        this.queuedForTravel = false;
        planet.fleets.push(this);
        this.galaxy = galaxy;
    };
    fleet.prototype = {
        addShip: function(ship){
            this.ships.push(ship);
            this.speed = this._getMaxFleetSpeed();
            this.range = this._getMaxFleetRange();
        },
        removeShip: function(shipObj){
            this.ships = _.filter(this.ships, function(ship){
                return ship.id !== shipObj.id;
            });
            this.speed = this._getMaxFleetSpeed();
            this.range = this._getMaxFleetRange();
        },
        splitFleet: function(){
            var halfArr;
            _.times(Math.round(this.ships.length/2), function(){
                halfArr.push(this.ships.pop());
            }, this);
            return new fleet(halfArr);
        },
        setDestination: function(planet){
            this.distanceToDestination = this.galaxy.gameInstance.physics.arcade.distanceBetween(this.location.sprites[2], planet.sprites[2]);
            this.totalDistanceToTravel = this.distanceToDestination;
            this.destination = planet;
            this.queuedForTravel = true;
            this.galaxy.gameInstance.planetUpdatedSignal.dispatch(this.location);
            console.log('fleet '+this.name + ' set destination '+planet.name + ' of distance '+ this.distanceToDestination);
        },
        unSetDestination: function(){
            this.distanceToDestination = null;
            this.destination = null;
            this.queuedForTravel = false;
            this.galaxy.gameInstance.planetUpdatedSignal.dispatch(this.location);
        },
        setLocation: function(planet){
            this.location.removeFleet(this);
            this.location = planet;
            this.inTransit = false;
            this.isSelected = false;
            planet.fleets.push(this);
        },
        _getNextFleetName: function(){
            return this.Constants.FleetNames[Math.round(Math.random()*this.Constants.FleetNames.length-1)];
        },
        _getMaxFleetSpeed: function(){
            var fleetSpeed = 0;
            _.each(this.ships, function(ship){
                if(ship.speed > fleetSpeed) fleetSpeed = ship.speed;
            });
            return fleetSpeed;
        },
        _getMaxFleetRange: function(){
            var fleetRange = 0;
            _.each(this.ships, function(ship){
                if(ship.range > fleetRange) fleetRange = ship.range;
            });
            return fleetRange;
        }
    };

    fleet.prototype.Constants = {
        FleetNames: [
            'Alpha', 'Beta', 'Gamma'
        ]
    };

    return fleet;
});