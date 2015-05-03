define(['ractive', 'rv!/spacedout/js/src/ui/taskBar/taskBar.html', 'css!/spacedout/js/src/ui/taskBar/taskBar'],
    function(Ractive, taskBarTemplate) {
        var taskBar = function (galaxy) {
            var targetDiv = document.createElement('div');
            targetDiv.id = 'taskBar';
            targetDiv.className = 'taskBarOut';
            galaxy.dom.appendChild(targetDiv);
            this.galaxy = galaxy;
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: taskBarTemplate
            });

            var self = this;

            this._ractive.on({
                onBudgetClicked: function (event) {
                    self.galaxy.gameInstance.budgetPanelSignal.dispatch();
                },
                onTechClicked: function(event){
                    self.galaxy.gameInstance.techPanelSignal.dispatch();
                },
                onMessagesClicked: function(event){
                    self.galaxy.gameInstance.messagePanelSignal.dispatch();
                },
                onBuilderClicked: function(event){
                    self.galaxy.gameInstance.shipBuilderPanelSignal.dispatch();
                },
                onPlanetClicked: function(event){
                    self.galaxy.gameInstance.planetToggleSignal.dispatch();
                },
                onEndTurnClicked: function(event){
                    self.galaxy.gameInstance.endTurnSignal.dispatch();
                }
            })
        };
        taskBar.prototype = {

        };
        return taskBar;
    });