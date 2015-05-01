define(['ractive', 'rv!/spacedout/js/src/ui/budgetPanel/budgetPanel.html', 'css!/spacedout/js/src/ui/budgetPanel/budgetPanel'],
function(Ractive, budgetPanelTemplate){
    var budgetPanel = function(galaxy){
        var targetDiv = document.createElement('div');
        targetDiv.id = 'budgetPanel';
        targetDiv.className = 'container budget-panel budgetPanelOut';
        targetDiv.style.height = (galaxy.gameInstance.height/2-30)+'px';
        targetDiv.style.top = (galaxy.gameInstance.height/2 + 20) + 'px';
        var parent = document.getElementById('left-panel');
        parent.appendChild(targetDiv);
        this._dom = targetDiv;

        this._ractive = new Ractive({
            el: this._dom.id,
            template: budgetPanelTemplate,
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

    budgetPanel.prototype = {
        transitionFrom: function(){
            //animate this component away
            this.isVisible = false;
            this._dom.className = this._dom.className.replace('budgetPanelIn', '');
            this._dom.className = [this._dom.className, 'budgetPanelOut'].join(" ");

        },
        transitionTo: function(){
            this.isVisible = true;
            //animate this component in
            this._dom.className = this._dom.className.replace('budgetPanelOut', '');
            this._dom.className = [this._dom.className, 'budgetPanelIn'].join(" ");
        },
        toggle: function(){
            if(!this.isVisible) this.transitionTo();
            else this.transitionFrom();
        }
    };

    return budgetPanel;
});