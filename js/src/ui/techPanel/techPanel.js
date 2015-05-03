define(['ractive', 'rv!/spacedout/js/src/ui/techPanel/techPanel.html', 'css!/spacedout/js/src/ui/techPanel/techPanel'],
    function(Ractive, techPanelTemplate){
        var techPanel = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'techPanel';
            targetDiv.className = 'container tech-panel techPanelOut';
            targetDiv.style.top = galaxy.gameInstance.height - 160 + 'px';
            var parent = document.getElementById('bottom-panel');
            parent.appendChild(targetDiv);
            this.galaxy = galaxy;
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: techPanelTemplate,
                data: {
                    player: galaxy.clientPlayer
                }
            });

            var self = this;

            this._ractive.on({
                onRangeSpendingChanged: function(event){
                    self.setTechValue('range', event.node.value);
                },
                onSpeedSpendingChanged: function(event){
                    self.setTechValue('speed', event.node.value);
                },
                onShieldSpendingChanged: function(event){
                    self.setTechValue('shield', event.node.value);
                },
                onWeaponSpendingChanged: function(event){
                    self.setTechValue('weapon', event.node.value);
                },
                onMiniSpendingChanged: function(event){
                    self.setTechValue('mini', event.node.value);
                },
                onRadicalSpendingChanged: function(event){
                    self.setTechValue('radical', event.node.value);
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
            },
            setTechValue: function(type, val){
                this._ractive.data.player.setIndividualTechRate(type, event.target.value);
                this._ractive.set('player', this.galaxy.clientPlayer);
            }
        };

        return techPanel;
    });