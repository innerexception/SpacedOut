require.config({
    baseUrl: 'js',
    paths:{
        //Framework
        'phaser': 'lib/vendor/phaser',
        'lodash': 'lib/vendor/lodash.min',
        'candy': 'lib/candy',
        'amd-loader': 'lib/vendor/requirejs-ractive/amd-loader',
        'css': 'lib/vendor/require-css/css',
        'rv': 'lib/vendor/requirejs-ractive/rv',
        'ractive': 'lib/vendor/ractive/ractive',

        'outSpacedApp': 'src/models/game',
        'planet': 'src/models/planet',
        'player': 'src/models/player',
        'ship': 'src/models/ship',
        'galaxy': 'src/models/galaxy',
        'galaxyPanel': 'src/ui/galaxyPanel',
        'gameSetupModal': 'src/ui/gameSetupModal',
        'messagePanel': 'src/ui/messagePanel',
        'planetPanel' : 'src/ui/planelPanel',
        'techPanel': 'src/ui/techPanel',
        'budgetPanel': 'src/ui/budgetPanel'
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





