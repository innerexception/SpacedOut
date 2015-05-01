define(['ractive', 'rv!/spacedout/js/src/ui/messagePanel/messagePanel.html', 'css!/spacedout/js/src/ui/messagePanel/messagePanel'],
    function(Ractive, messagePanelTemplate){
        var messagePanel = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'messagePanel';
            targetDiv.className = 'container message-panel messagePanelOut';
            var parent = document.getElementById('bottom-panel');
            parent.appendChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: messagePanelTemplate,
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

        messagePanel.prototype = {
            transitionFrom: function(){
                this.isVisible = false;
                //animate this component away
                this._dom.className = this._dom.className.replace('messagePanelIn', '');
                this._dom.className = [this._dom.className, 'messagePanelOut'].join(" ");

            },
            transitionTo: function(){
                this.isVisible = true;
                //animate this component in
                this._dom.className = this._dom.className.replace('messagePanelOut', '');
                this._dom.className = [this._dom.className, 'messagePanelIn'].join(" ");
            },
            toggle: function(){
                if(!this.isVisible) this.transitionTo();
                else this.transitionFrom();
            }
        };

        return messagePanel;
    });