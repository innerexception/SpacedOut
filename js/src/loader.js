require.config({
    baseUrl: 'js',
    paths:{
        'phaser': 'lib/phaser',
        'lodash': 'lib/lodash.min',
        'candy': 'lib/candy',
        'outSpacedApp': 'src/models/game',
        'planet': 'src/models/planet',
        'player': 'src/models/player',
        'ship': 'src/models/ship',
        'galaxy': 'src/models/galaxy',
        'galaxyPanel': 'src/ui/galaxyPanel',
        'battlePanel': 'src/ui/battlePanel',
        'gameSetupModal': 'src/ui/gameSetupModal',
        'messagePanel': 'src/ui/messagePanel',
        'planetPanel' : 'src/ui/planelPanel',
        'techPanel': 'src/ui/techPanel',
        'budgetPanel': 'src/ui/budgetPanel'
    },
    shim: {
        'phaser': {
            exports: 'Phaser'
        }
    }
});

require(['phaser', 'outSpacedApp'], function(Phaser, OutSpacedApp){
    new OutSpacedApp(1024, 768, Phaser.AUTO, 'galaxyMap');
});





