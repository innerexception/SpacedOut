define(['worldGen', 'phaser', 'ractive', 'rv!/spacedout/js/src/ui/battleModal/battleModal.html', 'css!/spacedout/js/src/ui/battleModal/battleModal'],
    function(worldGen, Phaser, Ractive, battleModalTemplate){
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

            this.gameInstance = new Phaser.Game(800, 600, Phaser.AUTO, 'battleModal',{
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
                this.gameInstance.stageGroup = this.gameInstance.add.group();

                if(this.spriteGroup) this.spriteGroup.destroy(true);
                var spriteGroup = this.gameInstance.add.group(this.gameInstance.stageGroup);
                this.spriteGroup = spriteGroup;

                var bmd = this.gameInstance.add.bitmapData(100,100);

                worldGen.generateWorldCanvas(bmd.canvas, temp, gravity, metal);
                this.surfaceImagePath = bmd.canvas.toDataURL();

                var scaleFactor = this.isExplored ? Math.max(gravity/4, 0.3) : 0.5;

                var sprite = this.gameInstance.add.sprite(position.x, position.y, bmd, null, spriteGroup);
                sprite.scale.setTo(scaleFactor);

                var sprite2 = this.gameInstance.add.sprite(position.x-(100*scaleFactor), position.y, bmd, null, spriteGroup);
                sprite2.scale.setTo(scaleFactor);

                //Add 'light' source
                var lightSprite = this.gameInstance.add.sprite(position.x, position.y, this.isExplored ? 'alphaMask' : 'unexploredMask', null, spriteGroup);
                lightSprite.scale.setTo(scaleFactor);

                lightSprite.inputEnabled = true;
                lightSprite.events.onInputDown.add(this._onPlanetClick, this);
                lightSprite.events.onInputOver.add(this._onPlanetDragOver, this);
                lightSprite.events.onInputOut.add(this._onPlanetDragOut, this);

                //Create sprite mask
                if(this.mask) {
                    delete this.mask;
                }
                this.mask = this.gameInstance.add.graphics(position.x, position.y, this.gameInstance.stageGroup);
                //	Shapes drawn to the Graphics object must be filled.
                this.mask.beginFill(0xffffff);
                //	Here we'll draw a circle
                this.mask.drawCircle(50*scaleFactor, 50*scaleFactor, 50*scaleFactor);
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
            },
            phaserLoad: function () {
                //1st time load
                this.world.setBounds(0, 0, 500, 500);
                //Camera init
                this.physics.startSystem(Phaser.Physics.ARCADE);
            }
        };

        return battleModal;
    });