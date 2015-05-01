define(['ractive', 'rv!/spacedout/js/src/ui/budgetPanel/budgetPanel.html', 'css!/spacedout/js/src/ui/budgetPanel/budgetPanel'],
function(Ractive, budgetPanelTemplate){
    var budgetPanel = function(galaxy){
        var targetDiv = document.createElement('div');
        targetDiv.id = 'budgetPanel';
        targetDiv.className = 'container budget-panel budgetPanelOut';
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
            this._dom.className = this._dom.className.replace('budgetPanelIn', '');
            this._dom.className = [this._dom.className, 'budgetPanelOut'].join(" ");

        },
        transitionTo: function(){
            //animate this component in
            this._dom.className = this._dom.className.replace('budgetPanelOut', '');
            this._dom.className = [this._dom.className, 'budgetPanelIn'].join(" ");
        }
    };

    return budgetPanel;
});