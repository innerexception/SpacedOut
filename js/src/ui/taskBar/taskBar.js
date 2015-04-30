define(['ractive', 'rv!/spacedout/js/src/ui/taskBar/taskBar.html', 'css!/spacedout/js/src/ui/taskBar/taskBar'],
    function(Ractive, taskBarTemplate) {
        var taskBar = function (galaxy) {
            var targetDiv = document.createElement('div');
            targetDiv.id = 'taskBar';
            targetDiv.className = 'container task-bar taskBarOut';
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
                }
            })
        };
        taskBar.prototype = {
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
            }
        };
        return taskBar;
    });