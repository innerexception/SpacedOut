define(['phaser', 'ractive', 'rv!/spacedout/js/src/ui/battleModal/battleModal.html', 'css!/spacedout/js/src/ui/battleModal/battleModal'],
    function(Phaser, Ractive, battleModalTemplate){
        var battleModal = function(galaxy){
            var targetDiv = document.createElement('div');
            targetDiv.id = 'battleModalContainer';
            targetDiv.className = 'container battle-modal-panel battleModalOut';
            galaxy.dom.appendChild(targetDiv);
            this._dom = targetDiv;

            this._ractive = new Ractive({
                el: this._dom.id,
                template: battleModalTemplate,
                data: {
                    planets: []
                }
            });

            this.gameInstance = new Phaser.Game('83', '86', Phaser.AUTO, 'battleModal',{
                preload: this.preload,
                create: this.phaserLoad,
                update: this.update
            });

        };

        battleModal.prototype = {
            transitionFrom: function(){
                this.isVisible = false;
                //animate this component away
                this._dom.className = this._dom.className.replace('battleModalIn', '');
                this._dom.className = [this._dom.className, 'battleModalOut'].join(" ");

            },
            transitionTo: function(){
                this.isVisible = true;
                //animate this component in
                this._dom.className = this._dom.className.replace('battleModalOut', '');
                this._dom.className = [this._dom.className, 'battleModalIn'].join(" ");
            },
            startBattle: function(fleets){
                this.transitionTo();
                var location = fleets[0].location;
                this.generatePlanetImage(location);
            },
            generatePlanetImage: function(location){

                var position = {x:0, y:200};
                if(this.spriteGroup) this.spriteGroup.destroy(true);
                var spriteGroup = this.gameInstance.add.group(this.gameInstance.stageGroup);
                this.spriteGroup = spriteGroup;

                var bmd = this.gameInstance.add.bitmapData(100,100);

                var img = new Image();
                img.src = location.surfaceImagePath;
                bmd.canvas.getContext('2d').drawImage(img, 0, 0);

                var scaleFactor = 5;

                var sprite = this.gameInstance.add.sprite(position.x, position.y, bmd, null, spriteGroup);
                sprite.scale.setTo(scaleFactor);

                var sprite2 = this.gameInstance.add.sprite(position.x-(100*scaleFactor), position.y, bmd, null, spriteGroup);
                sprite2.scale.setTo(scaleFactor);

                //Add 'light' source
                var lightSprite = this.gameInstance.add.sprite(position.x, position.y, 'alphaMask', null, spriteGroup);
                lightSprite.scale.setTo(scaleFactor);

                //Create sprite mask
                if(this.mask) {
                    delete this.mask;
                }
                this.mask = this.gameInstance.add.graphics(position.x, position.y, this.gameInstance.stageGroup);
                //	Shapes drawn to the Graphics object must be filled.
                this.mask.beginFill(0xffffff);
                //	Here we'll draw a circle
                this.mask.drawCircle(50*scaleFactor, 50*scaleFactor, 100*scaleFactor);
                //	And apply it to the Sprite
                spriteGroup.mask = this.mask;

                var rotationalPeriod = (Math.random()*20000)+10000;
                //Setup tweens for sprite behind mask
                sprite.tween = this.gameInstance.add.tween(sprite)
                    .to({x: position.x + (100*scaleFactor)}, rotationalPeriod, Phaser.Easing.Linear.None)
                    .to({x: position.x}, 10, Phaser.Easing.Linear.None)
                    .loop();
                sprite.tween.start();
                sprite2.tween = this.gameInstance.add.tween(sprite2)
                    .to({x: position.x}, rotationalPeriod, Phaser.Easing.Linear.None)
                    .to({x: position.x-(100*scaleFactor)}, 10, Phaser.Easing.Linear.None)
                    .loop();
                sprite2.tween.start();
            },
            preload: function () {
                //Load all assets here
                this.load.image('lazerShot', 'js/res/img/lazerShot.png');
                this.load.image('explosion', 'js/res/img/explosion.png');
                this.load.image('alphaMask', 'js/res/img/alphaMask.png');
                this.load.image('tinystar', 'js/res/img/tinyStar.png');
            },
            phaserLoad: function () {
                //1st time load
                this.world.setBounds(0, 0, 500, 500);
                this.stageGroup = this.add.group();
            }
        };

        return battleModal;
    });