define(['ractive', 'rv!/spacedout/js/src/ui/techPanel/techPanel.html', 'css!/spacedout/js/src/ui/techPanel/techPanel'],
    function(Ractive, techPanelTemplate){
        var techPanel = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'techPanel';
            targetDiv.className = 'container tech-panel techPanelOut';
            var parent = document.getElementById('bottom-panel');
            parent.appendChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: techPanelTemplate,
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

        techPanel.prototype = {
            transitionFrom: function(){
                //animate this component away
                this._dom.className = this._dom.className.replace('techPanelIn', '');
                this._dom.className = [this._dom.className, 'techPanelOut'].join(" ");

            },
            transitionTo: function(){
                //animate this component in
                this._dom.className = this._dom.className.replace('techPanelIn', '');
                this._dom.className = [this._dom.className, 'techPanelOut'].join(" ");
            }
        };

        return techPanel;
    });