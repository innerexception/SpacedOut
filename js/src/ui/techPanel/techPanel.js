define(['ractive', 'rv!/spacedout/js/src/ui/techPanel/techPanel.html', 'css!/spacedout/js/src/ui/techPanel/techPanel'],
    function(Ractive, techPanelTemplate){
        var techPanel = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'techPanel';
            targetDiv.className = 'container tech-panel techPanelOut';
            targetDiv.style.top = galaxy.gameInstance.height - 160 + 'px';
            var parent = document.getElementById('bottom-panel');
            parent.appendChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: techPanelTemplate,
                data: {
                    player: galaxy.clientPlayer.techs
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
                this.isVisible = false;
                //animate this component away
                this._dom.className = this._dom.className.replace('techPanelIn', '');
                this._dom.className = [this._dom.className, 'techPanelOut'].join("");

            },
            transitionTo: function(){
                this.isVisible = true;
                //animate this component in
                this._dom.className = this._dom.className.replace('techPanelOut', '');
                this._dom.className = [this._dom.className, 'techPanelIn'].join("");
            },
            toggle: function(){
                if(!this.isVisible) this.transitionTo();
                else this.transitionFrom();
            }
        };

        return techPanel;
    });