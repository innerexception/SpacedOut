define(['ractive', 'rv!/spacedout/js/src/ui/shipBuilder/shipBuilder.html', 'css!/spacedout/js/src/ui/shipBuilder/shipBuilder'],
    function(Ractive, shipBuilderTemplate){
        var shipBuilder = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'shipBuilder';
            targetDiv.className = 'container ship-builder-panel shipBuilderOut';
            galaxy.dom.appendChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: shipBuilderTemplate,
                data: {
                    planets: []
                }
            });

            var self = this;

            this._ractive.on({
                onPlanetBudgetChanged: function(event){
                    console.log('planet budget changed...');
                }
            })
        };

        shipBuilder.prototype = {
            transitionFrom: function(){
                //animate this component away
                this._dom.className = this._dom.className.replace('shipBuilderIn', '');
                this._dom.className = [this._dom.className, 'shipBuilderOut'].join(" ");

            },
            transitionTo: function(){
                //animate this component in
                this._dom.className = this._dom.className.replace('shipBuilderOut', '');
                this._dom.className = [this._dom.className, 'shipBuilderIn'].join(" ");
            }
        };

        return shipBuilder;
    });