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
            if(this.ships[0].owner === this.galaxy.clientPlayer) planet.setIsExplored(true);
            this.inTransit = false;
            this.isSelected = false;
            planet.fleets.push(this);

            var combatQueue = [];
            _.each(planet.fleets, function(fleet){
                if(fleet.owner != this.galaxy.clientPlayer){
                    combatQueue.push(fleet);
                }
            }, this);

            this._resolveCombat(combatQueue);
        },
        _resolveCombat: function(fleets){
            //TODO zoom to area
            this.galaxy.gameInstance.stageGroup.combatPanTween = this.galaxy.gameInstance.add.tween(this.galaxy.gameInstance.camera)
                .to({ x: fleets[0].location.getCenterPoint().x, y: fleets[0].location.getCenterPoint().y }, 2000);
            this.galaxy.gameInstance.stageGroup.combatZoomTween = this.galaxy.gameInstance.add.tween(this.galaxy.gameInstance.stageGroup.scale)
                .to({ x: 3, y: 3 }, 2000);

            //line up fleets
            var friendlyFleets = _.filter(fleets, function(fleet){
                return fleet.ships[0].owner === this.galaxy.clientPlayer;
            }, this);
            _.each(friendlyFleets, function(fleet){
                _.each(fleet.ships, function(ship){
                    //TODO tween ship in from the left of the camera view
                });
            });


            var enemyFleets = _.filter(fleets, function(fleet){
                return fleet.ships[0].owner !== this.galaxy.clientPlayer;
            }, this);
            _.each(enemyFleets, function(fleet){
                _.each(fleet.ships, function(ship){
                    //TODO tween ship in from the right of the camera view
                });
            });


            //fleets fire in rounds, remove casualties
            while(enemyFleets.length > 0 && friendlyFleets.length > 0){
                if(friendlyFleets[0].speed > enemyFleets[0].speed){
                    _.each(friendlyFleets, function(friendlyFleet){
                        friendlyFleet._fireAt(enemyFleets);
                    });
                    _.each(enemyFleets, function(enemyFleets){
                        enemyFleets._fireAt(friendlyFleets);
                    });
                }
                else{
                    _.each(enemyFleets, function(enemyFleets){
                        enemyFleets._fireAt(friendlyFleets);
                    });
                    _.each(friendlyFleets, function(friendlyFleet){
                        friendlyFleet._fireAt(enemyFleets);
                    });
                }
            }

        },
        _fireAt: function(targetFleets){
            //TODO shoot at a random fleet ship until they are all dead or you run out of ships. One shot per ship.
            _.each(this.ships, function(ship){
                ship.fireLazerAt(targetShip);
            });
        },
        _checkForColonization: function(){
            var colonyShip = _.filter(this.ships, function(ship){
                return ship.type === ship.Constants.ShipTypes.Colony;
            })[0];
            if(colonyShip && !planet.owner){
                planet.setNewOwner(colonyShip.owner, colonyShip.colonists, this.galaxy.clientPlayer);
                colonyShip.colonists = 0;
            }
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