require.config({
    baseUrl: 'js',
    paths:{
        //Framework
        'phaser': 'lib/vendor/phaser2.2.2',
        'lodash': 'lib/vendor/lodash.min',
        'candy': 'lib/candy',
        'amd-loader': 'lib/vendor/requirejs-ractive/amd-loader',
        'css': 'lib/vendor/require-css/css',
        'rv': 'lib/vendor/requirejs-ractive/rv',
        'ractive': 'lib/vendor/ractive/ractive',
        'worldGen': 'lib/vendor/world',
        'illuminated': 'lib/vendor/illuminated',

        'outSpacedApp': 'src/models/game',
        'planet': 'src/models/planet',
        'player': 'src/models/player',
        'ship': 'src/models/ship',
        'galaxy': 'src/models/galaxy',
        
        'gameSetupModal': 'src/ui/gameSetupModal/gameSetupModal',
        'messagePanel': 'src/ui/messagePanel/messagePanel',
        'planetPanel' : 'src/ui/planetPanel/planetPanel',
        'techPanel': 'src/ui/techPanel/techPanel',
        'budgetPanel': 'src/ui/budgetPanel/budgetPanel',
        'taskBar': 'src/ui/taskBar/taskBar',
        'shipBuilder' : 'src/ui/shipBuilder/shipBuilder'
    },
    map: {
        '*': {
            'css': 'lib/vendor/require-css/css'
        }
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





