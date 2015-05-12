define(['fleet', 'ship', 'ractive', 'rv!/spacedout/js/src/ui/shipBuilder/shipBuilder.html', 'css!/spacedout/js/src/ui/shipBuilder/shipBuilder'],
    function(Fleet, Ship, Ractive, shipBuilderTemplate){
        var shipBuilder = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'shipBuilder';
            targetDiv.className = 'container ship-builder-panel shipBuilderOut';
            galaxy.dom.appendChild(targetDiv);
            this.galaxy = galaxy;
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: shipBuilderTemplate,
                data: {
                    player: {},
                    selectedDesign: {}
                }
            });

            var self = this;

            this._ractive.on({
                onStatChanged: function(event){
                    //Once a stat changes, the design gets a non zero prototype cost.
                    self._ractive.set('selectedDesign.'+event.node.attributes['data-id'].value, event.node.value);
                    self._ractive.get('selectedDesign').updatePrototypeCost();
                    self._ractive.get('selectedDesign').updateProductionCost();
                    self._ractive.set('selectedDesign', self._ractive.get('selectedDesign'));
                },
                onNumberChanged: function(event){
                    self._ractive.set('selectedDesign.number', event.node.value);
                },
                onDesignClick: function(event){
                    _.each(self._ractive.get('player.designs'), function(design){
                        design.isSelected = false;
                        design.prototypeCost = 0;
                    });
                    event.context.isSelected = true;
                    self._ractive.set('player.designs', self._ractive.get('player.designs'));
                    self._ractive.set('selectedDesign', event.context);
                },
                onDoneClicked: function(event){
                    self.transitionFrom();
                }
            });
        };

        shipBuilder.prototype = {
            transitionFrom: function(){
                this.isVisible = false;
                //animate this component away
                this._dom.className = this._dom.className.replace('shipBuilderIn', '');
                this._dom.className = [this._dom.className, 'shipBuilderOut'].join(" ");
                this.saveShips();
            },
            transitionTo: function(player){
                this.isVisible = true;
                //animate this component in
                this._dom.className = this._dom.className.replace('shipBuilderOut', '');
                this._dom.className = [this._dom.className, 'shipBuilderIn'].join(" ");
                this._ractive.set('player', player);
                player.designs[0].isSelected = true;
                this._ractive.set('selectedDesign', player.designs[0]);
            },
            toggle: function(panel){
                if(panel==='builder'){
                    if(!this.isVisible) this.transitionTo(this.galaxy.clientPlayer);
                    else this.transitionFrom();
                }
            },
            saveShips: function(){
                var planet = this.galaxy.gameInstance.selectedPlanet;
                var fleet = new Fleet([], planet, this.galaxy);
                var design = this._ractive.get('selectedDesign');
                _.times(design.number, function(){
                    fleet.addShip(new Ship(planet, this._ractive.get('player'), design.type, design.range, design.speed, design.weapon, design.shield, design.mini, this.galaxy.gameInstance));
                }, this);
                this._ractive.get('player').fleets.push(fleet);
                this.galaxy.gameInstance.planetUpdatedSignal.dispatch(planet);
            }
        };

        return shipBuilder;
    });