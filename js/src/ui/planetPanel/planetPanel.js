define(['ractive', 'rv!/spacedout/js/src/ui/planetPanel/planetPanel.html', 'css!/spacedout/js/src/ui/planetPanel/planetPanel'],
    function(Ractive, planetPanelTemplate){
        var planetPanel = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'planetPanel';
            targetDiv.className = 'container planet-panel planetPanelOut';
            var parent = document.getElementById('left-panel');
            parent.appendChild(targetDiv);

            this.galaxy = galaxy;
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: planetPanelTemplate,
                data: {
                    planet: {}
                }
            });

            var self = this;

            this._ractive.on({
                onPlanetGrowthChanged: function(event){
                    console.log('planet growth changed...');
                },
                onPlanetMiningChanged: function(event){
                    console.log('planet mining changed...');
                },
                onFleetSelected: function(event){
                    console.log('fleet selected...');
                }
            })
        };

        planetPanel.prototype = {
            transitionFrom: function(){
                //animate this component away
                this._dom.className = this._dom.className.replace('planetPanelIn', '');
                this._dom.className = [this._dom.className, 'planetPanelOut'].join(" ");
                this.isVisible = false;
            },
            transitionTo: function(){
                //animate this component in
                this._dom.className = this._dom.className.replace('planetPanelOut', '');
                this._dom.className = [this._dom.className, 'planetPanelIn'].join(" ");
                this.isVisible = true;
            },
            onPlanetClicked: function(planet){
                this._ractive.set('planet', planet);
                if(!this.isVisible) this.transitionTo();
            }
        };

        return planetPanel;
    });