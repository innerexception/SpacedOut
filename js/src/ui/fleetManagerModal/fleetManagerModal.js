define(['lodash', 'fleet', 'ractive', 'rv!/spacedout/js/src/ui/fleetManagerModal/fleetManagerModal.html', 'css!/spacedout/js/src/ui/fleetManagerModal/fleetManagerModal'],
    function(_, Fleet, Ractive, fleetModalTemplate) {
        var fleetModal = function (galaxy) {
            var targetDiv = document.createElement('div');
            targetDiv.id = 'fleetModalContainer';
            targetDiv.className = 'container fleet-modal-panel fleetModalOut';
            this.galaxy = galaxy;
            galaxy.dom.appendChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: fleetModalTemplate,
                data: {
                    planet: {},
                    newFleets: []
                }
            });

            var self = this;
            this._ractive.on({
                onShipSelected: function(event){
                    self.dragShip = event.context;
                },
                onFleetDrop: function(event){
                    if(self.dragShip)event.context.addShip(self.dragShip)
                },
                onNewFleetDrop: function(event){
                    var newFleet= new Fleet([self.dragShip], self._ractive.data.planet, self.galaxy);
                    self._ractive.data.newFleets.push(newFleet);
                    self._ractive.data.planet.fleets.push(newFleet);
                    _.each(self._ractive.data.planet.fleets, function(fleet){
                        _.each(fleet.ships, function(ship){
                            if(ship===self.dragShip) fleet.removeShip(ship);
                        });
                    });
                    self._ractive.set('planet', self._ractive.data.planet);
                    self.galaxy.gameInstance.planetUpdatedSignal.dispatch(self._ractive.data.planet);
                }
            });
        };
        fleetModal.prototype = {
            transitionFrom: function(){
                this.isVisible = false;
                //animate this component away
                this._dom.className = this._dom.className.replace('fleetModalIn', '');
                this._dom.className = [this._dom.className, 'fleetModalOut'].join(" ");
            },
            transitionTo: function(planet){
                this.isVisible = true;
                //animate this component in
                this._dom.className = this._dom.className.replace('fleetModalOut', '');
                this._dom.className = [this._dom.className, 'fleetModalIn'].join(" ");
                this._ractive.set('planet', planet);
            }
        };
        return fleetModal;
});