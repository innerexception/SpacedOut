define(['ractive', 'rv!/spacedout/js/src/ui/gameSetupModal/gameSetupModal.html', 'css!/spacedout/js/src/ui/gameSetupModal/gameSetupModal'],
    function(Ractive, gameSetupTemplate){
        var gameSetupModal = function(mapDiv, gameInstance){

            var targetDiv = document.createElement('div');
            targetDiv.id = 'gameSetupModal';
            mapDiv.addChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: gameSetupTemplate,
                data: {
                    size : ['Small', 'Medium', 'Large'],
                    spread: ['Dense', 'Sparse'],
                    ai_players: 1,
                    ai_difficulty: 0,
                    shape: ['Spiral', 'Circle', 'Ring'],
                    handicap: 0
                }
            });
        };

        gameSetupModal.prototype = {
           sizeSelected: function(){

           },
           spreadSelected: function(){

           },
           playersSelected: function(){

           },
           difficultySelected: function(){

           },
           startGame: function(){

           }
        };

    return gameSetupModal;
});