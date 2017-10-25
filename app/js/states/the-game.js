'use strict';

const _THE_FLOOR_ = 130;
const _MAX_LEVELS_ = 5;


const stateGame = function(game) {
    this.isTesting = false; // turn off bullet limits for testing
    this.background = null;
    this.cursors = null;
    this.fireButton = null;
    this.currentLevel = 1;
    this.sfx = true;
}

stateGame.prototype = {
    explosions: {
        group: null
    },
    // Player -----------------------
    player: {
        name: 'DOE',
        sprite: null,
        avatar: 0,
        player: null,
        lives: 3,
        score: 0,
        velocityX: 150,
        bullets: null,
        bulletVelocity: 500,
        bulletTime: 0,
        shotsAllowed: 1,
        shootAudio: null,
        curse: null,
        skull: null,
        skullTween: null
    },
    // HUD --------------------------
    hud: {
        logo: null,
        score: null,
        lives: null,
        color: '#000'
    },
    // Alien data -------------------
    aliens: {
        group: null,
        direction: 1,
        stepX: 5,
        stepY: 45,
        rows: 4,
        columns: 8,
        timer: null,
        delay: 750,
        delayMultiplier: 1,
        spacingX: 55,
        spacingY: 55,
        killedAudio: null,
        moveAudio: [],
        currentMove: 0,
        resetTimer: false,
        firingTimer: 0,
        firingDelay: 1500,
        bullets: null,
        bulletVelocity: 150
    },
    bonusShip: {
        sprite: null,
        bonusTimer: null,
        tween: null,
        moveAudio: null
    },
    barriers: {
        group: null
    },
    powerUps: {
        sprite: null,
        current: 0,
        timer: null,
        sfx: null,
        list: [
            {
                frame: 0,
                name: 'Process\nImprovement',
                scoreValue: 100
            },
            {
                frame: 1,
                name: 'Data',
                scoreValue: 100
            },
            {
                frame: 2,
                name: 'Change Management',
                scoreValue: 100
            },
            {
                frame: 3,
                name: 'Project Management',
                scoreValue: 100
            },
            {
                frame: 4,
                name: 'Technology',
                scoreValue: 100
            }
        ]
    },
    init: function(name, avatar) {
		SEYFARTH.mapGenericKeys(this);

        this.player.name = name || 'DOE';
        this.player.avatar = avatar * 4 || 0;
        this.player.lives = 3;
        this.player.score = 0;
        this.player.shotsAllowed = 1;

        this.powerUps.current = 0;
    },
    preload: function() {    
        this.load.image('background', 'assets/backgrounds/city.png');
        this.game.load.image('blue-logo', 'assets/logos/blue.png');
        
        this.load.image('levelup-logo', 'assets/general/levelup.png');
        this.load.image('barrier', 'assets/sprites/barrier.png');
        
        this.load.spritesheet('avatars', 'assets/sprites/avatars.png', 90, 200);
        this.load.spritesheet('enemy-sprites', 'assets/sprites/enemy.png', 200, 200);    
        this.load.spritesheet('power-ups', 'assets/sprites/power-ups.png', 200, 200);
        this.load.spritesheet('kaboom', 'assets/sprites/explosion.png', 64, 64);
        this.load.spritesheet('curse', 'assets/sprites/curse.png', 533, 432);
        
        this.load.image('bullet', 'assets/general/bullet.png');
        this.load.image('skull', 'assets/general/skull.png');
        
        this.load.image('enemy-bullet', 'assets/invaders/enemy-bullet.png');

        // Audio
        this.load.audio('playershoot', 'assets/audio/playershoot.wav');
        this.load.audio('player-killed', 'assets/audio/player-killed.wav');

        this.load.audio('enemy-killed', 'assets/audio/alienkilled.wav');    
        this.load.audio('bonus-move', 'assets/audio/bonus-move.wav');

        this.load.audio('powerup-sfx', 'assets/audio/powerup.wav');

        this.load.audio('fastinvader1', 'assets/audio/fastinvader1.wav');
        this.load.audio('fastinvader2', 'assets/audio/fastinvader2.wav');
        this.load.audio('fastinvader3', 'assets/audio/fastinvader3.wav');
        this.load.audio('fastinvader4', 'assets/audio/fastinvader4.wav');
    },
    toggleSfx() {
        this.sfx = !this.sfx;
    },
    create: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');
        
        this.blueLogo = this.add.sprite(this.world.width - 100, this.world.height - 50, 'blue-logo');
        this.blueLogo.scale.setTo(0.1, 0.1);
        this.blueLogo.anchor.setTo(0.5, 0.5);

        this.createHud();
        this.createPlayer();
        this.createEnemies();
        this.createBonus();
        this.createPowerUps();
        this.createBarriers();
        
        //  An explosion pool
        this.explosions.group = this.add.group();
        this.explosions.group.createMultiple(30, 'kaboom');
        this.explosions.group.forEach(function(invader) {
            invader.anchor.x = 0.5;
            invader.anchor.y = 0.5;
            invader.animations.add('kaboom');
        }, this);

        //  And some controls to play the game with
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    createPlayer: function() {
        // The hero
        this.player.sprite = this.add.sprite(150, this.world.height - 130, 'avatars');
        this.player.sprite.frame = this.player.avatar;
        this.player.sprite.anchor.set(0.5);
        this.player.sprite.scale.set(0.6);
        this.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
        this.player.sprite.body.collideWorldBounds = true;
        
        this.player.skull = this.add.sprite(0, 0, 'skull');
        this.player.skull.anchor.setTo(0.5, 0.5);
        this.player.skull.scale.setTo(0.18);
        this.physics.enable(this.player.skull, Phaser.Physics.ARCADE);
        

        this.player.curse = this.add.sprite(0, 0, 'curse');
        this.player.curse.anchor.set(0.5);
        this.player.curse.scale.set(0.2);

        this.player.curse.kill();
        this.player.skull.kill();

        //  Create bullets
        this.player.bullets = this.add.group();
        this.player.bullets.enableBody = true;
        this.player.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.player.bullets.createMultiple(10, 'bullet');
        this.player.bullets.setAll('anchor.x', 0.5);
        this.player.bullets.setAll('anchor.y', 2);
        this.player.bullets.setAll('outOfBoundsKill', true);
        this.player.bullets.setAll('checkWorldBounds', true);

        this.player.shootAudio = this.add.audio('playershoot');
        this.player.killedAudio = this.add.audio('player-killed');
    },
    createHud: function() {
        this.hud.logo = this.add.sprite(this.world.width / 2, 10, 'levelup-logo');
        // hud.logo.anchor.setTo(0.5, 0.5);
        this.hud.logo.scale.setTo(0.25);
        this.hud.logo.x = this.world.width / 2 - (this.hud.logo.width / 2);
        
        //  The score
        this.hud.score = this.add.text(
            this.world.width - 80, 10, 
            'SCORE:\n' + this.player.score, 
            { 
                font: `${SEYFARTH.gameFontSize} ${SEYFARTH.fontFamily}`,
                fill: this.hud.color,
                align: 'right'
            });
        this.hud.score.lineSpacing = -10;
    
        this.hud.player = this.add.text(
            10, 10, 
            'PLAYER 1:\n' + this.player.name, 
            { 
                font: `${SEYFARTH.gameFontSize} ${SEYFARTH.fontFamily}`,
                fill: this.hud.color,
                align: 'left'
            });
        this.hud.player.lineSpacing = -10;
    
        //  Lives
        this.hud.lives = this.add.group();
        this.add.text(
            10, this.world.height - 43,
            'LIVES:',
            {
                font: `${SEYFARTH.gameFontSize} ${SEYFARTH.fontFamily}`,
                fill: this.hud.color
            });
    
        for(let i = 0; i < this.player.lives; i++) {
            let life = this.hud.lives.create(140 - (25 * i), this.world.height - 32, 'power-ups');
            life.frame = 6
            life.anchor.setTo(0.5, 0.5);
            life.scale.setTo(0.1,0.1);
    
            this.add
                .tween(life.scale)
                .to(
                    {
                        x: 0.13,
                        y: 0.13
                    },
                    500,
                    Phaser.Easing.Quadratic.InOut,
                    true,
                    0,
                    1000,
                    true
                );
        }
    },
    createPowerUps: function() {
        this.powerUps.sprite = this.add.sprite(0, this.world.height - 75, 'power-ups');
        this.powerUps.sprite.anchor.setTo(0.5, 1);
        this.powerUps.sprite.scale.set(0.30);
        this.physics.arcade.enable(this.powerUps.sprite);
        this.powerUps.sprite.kill();

        this.powerUps.timer = this.time.create(false);

        this.powerUps.timer.loop(Phaser.Timer.SECOND * this.rnd.integerInRange(10, 20), function() {
            this.resetPowerUps();            
        }, this);

        this.powerUps.sfx = this.add.audio('powerup-sfx');
        
        this.powerUps.timer.start();
    },
    resetPowerUps: function() {
        this.powerUps.timer.stop();

        if(this.powerUps.current >= this.powerUps.list.length) {
            return;
        }

        this.powerUps.sprite.data.scoreValue = this.powerUps.list[this.powerUps.current].scoreValue;
        this.powerUps.sprite.data.name = this.powerUps.list[this.powerUps.current].name;

        this.powerUps.sprite.x = this.rnd.integerInRange(20, this.world.width - 20);
        this.powerUps.sprite.y = 0.5;
        this.powerUps.alpha = 0;
        this.powerUps.sprite.frame = this.powerUps.current;
        this.powerUps.sprite.revive();

        this.add.tween(this.powerUps.sprite).to(
            {
                y: this.world.height - 75,
                alpha: 1
            }, 
            2500, 
            Phaser.Easing.Bounce.Out, 
            true, 
            0, 
            0,
            false);
        

        this.powerUps.current++;
    },
    createBarriers: function() {
        this.barriers.group = this.add.group();
        this.barriers.group.enableBody = true;
        this.barriers.group.physicsBodyType = Phaser.Physics.ARCADE;

        for(let x = 0; x < 4; x++) {
            let barrier = this.barriers.group.create(175 + x * 340, 500, 'barrier');
            barrier.anchor.setTo(0.5, 0.5);
            barrier.scale.set(0.17);
            barrier.body.moves = false;
            barrier.health = 100;
        }
    },
    createEnemies: function() {
        this.aliens.group = this.add.group();
        this.aliens.group.enableBody = true;
        this.aliens.group.physicsBodyType = Phaser.Physics.ARCADE;
        
        for (let y = 0; y < this.aliens.rows; y++) {
            for (let x = 0; x < this.aliens.columns + this.currentLevel; x++) {
                let alien = this.aliens.group.create(x * this.aliens.spacingX, y * this.aliens.spacingY, 'enemy-sprites');
                alien.frame = y * 2;
                alien.scale.setTo(0.22);
                alien.anchor.setTo(0.5, 0.5);
                alien.body.moves = false;
    
                alien.scoreValue = (this.aliens.rows - y) * 10;
            }
        }

        this.aliens.killedAudio = this.add.audio('enemy-killed');
        this.aliens.moveAudio.push(this.add.audio('fastinvader1'));
        this.aliens.moveAudio.push(this.add.audio('fastinvader2'));
        this.aliens.moveAudio.push(this.add.audio('fastinvader3'));
        this.aliens.moveAudio.push(this.add.audio('fastinvader4'));

        this.aliens.bullets = this.add.group();
        this.aliens.bullets.enableBody = true;
        this.aliens.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.aliens.bullets.createMultiple(30, 'enemy-bullet');
        this.aliens.bullets.setAll('anchor.x', 0.5);
        this.aliens.bullets.setAll('anchor.y', 1);
        this.aliens.bullets.setAll('outOfBoundsKill', true);
        this.aliens.bullets.setAll('checkWorldBounds', true);
        
        this.aliens.group.x = (this.world.width / 2) - (this.aliens.group.width / 2);
        this.aliens.group.y = 125 + this.currentLevel * 25;
    
        this.aliens.timer = this.time.create(false);
        this.aliens.timer.loop(this.aliens.delay, this.updateEnemies, this);
        this.aliens.timer.start();
    },
    createBonus: function() {
        this.bonusShip.sprite = this.add.sprite(0, 95, 'power-ups');
        this.bonusShip.sprite.frame = 5;
        this.bonusShip.sprite.anchor.setTo(0.5, 0.5);
        this.bonusShip.sprite.scale.set(0.2);
        this.bonusShip.sprite.x -= this.bonusShip.sprite.offsetX;
        this.physics.arcade.enable(this.bonusShip.sprite);

        this.bonusShip.bonusTimer = this.time.create(false);

        this.bonusShip.moveAudio = this.add.audio('bonus-move');

        //this.bonusShip.moveAudio.volume = SEYFARTH.gameVolume;
        
        this.resetBonus();
    },
    updateEnemies: function() {
        let bounds = {
            top: 99999,
            left: 99999,
            bottom: -99999,
            right: -99999
        };
    
        if(!this.player.sprite.alive) {
            return;
        }
    
        if(!this.aliens.group.getFirstAlive()) {
            return;
        }
    
        if(this.sfx) {
            this.aliens.moveAudio[this.aliens.currentMove++].play();
        }

        if(this.aliens.currentMove >= this.aliens.moveAudio.length) {
            this.aliens.currentMove = 0;
        }
    
        this.aliens.group.forEachAlive(function(alien) {
            // Get bounds of all aliens, used to determine if edge is hit and reverse/step y
            if(alien.worldPosition.y - alien.offsetY < bounds.top) {
                bounds.top = alien.worldPosition.y - alien.offsetY;
            }
            if(alien.worldPosition.x - alien.offsetX < bounds.left) {
                bounds.left = alien.worldPosition.x - alien.offsetX;
            }
            if(alien.worldPosition.y + alien.offsetY > bounds.bottom) {
                bounds.bottom = alien.worldPosition.y + alien.offsetY;
            }
            if(alien.worldPosition.x + alien.offsetX > bounds.right) {
                bounds.right = alien.worldPosition.x + alien.offsetX;
            }

            // Update animation frame manually
            alien.frame % 2 ? alien.frame-- : alien.frame++;
        }, this);
    
        // Move aliens and end game if y > killall height
        if(this.aliens.direction === 1) {
            // Going right
            if(bounds.right + this.aliens.stepX < this.world.width - 1) {
                this.aliens.group.x += this.aliens.stepX * this.aliens.direction;
            }
            else {
                if(bounds.bottom + this.aliens.stepY > this.player.sprite.worldPosition.y - this.player.sprite.offsetY) {
                    this.gameOver();
                }
                this.aliens.group.y += this.aliens.stepY;
                this.aliens.direction = -1;
            }
        }
        else {
            // Going left
            if(bounds.left - this.aliens.stepX > 0) {
                this.aliens.group.x += this.aliens.stepX * this.aliens.direction;
            }
            else {
                if(bounds.bottom + this.aliens.stepY > this.player.sprite.worldPosition.y - this.player.sprite.offsetY) {
                    this.gameOver();
                }
    
                this.aliens.group.y += this.aliens.stepY;
                this.aliens.direction = 1;
            }
        }
    
        // This has to be done in this function or it messes up the enemy movement
        // Flag is set elsewhere
        if(this.aliens.resetTimer) {
            this.aliens.resetTimer = false;
            this.aliens.timer.stop();
            this.aliens.timer.loop(this.aliens.delay, this.updateEnemies, this);            
            this.aliens.timer.start();
        }
    },
    gameOver: function() {
        this.player.sprite.kill();
    
        // live = lives.getFirstAlive();
        
        // if (live)
        // {
        //     live.kill();
        // }
    },
    initBonus: function() {
        // console.log('start bonus ship', this.bonusShip);
        this.bonusShip.bonusTimer.stop();

        this.bonusShip.sprite.scoreValue = 50 * this.rnd.integerInRange(1, 6);

        if(this.sfx) {
            this.bonusShip.moveAudio.loopFull();
        }

        this.bonusShip.sprite.revive();        

        this.bonusShip.tween = this.add.tween(this.bonusShip.sprite).to(
            {
                x: this.world.width + this.bonusShip.sprite.offsetX
            }, 
            15000, 
            null, 
            true, 
            0, 
            0,
            false);

        this.bonusShip.tween.onComplete.add(function() {
            this.resetBonus();            
        }, this);
    },
    resetBonus: function(kill) {
        this.bonusShip.bonusTimer.stop();
        if(this.bonusShip.tween) {
            this.bonusShip.tween.stop();
        }

        if(this.sfx) {
            this.bonusShip.moveAudio.stop();
        }

        this.bonusShip.sprite.x = 0 - this.bonusShip.sprite.halfWwidth;
        
        if(!kill) {
            this.bonusShip.bonusTimer.loop(Phaser.Timer.SECOND * this.rnd.integerInRange(5, 15), this.initBonus, this);
            this.bonusShip.bonusTimer.start();
        }
    },
    update: function() {
        if(this.player.sprite.alive && !this.player.inLimbo) {
            //  Reset the player, then check for movement keys
            this.player.sprite.body.velocity.setTo(0, 0);

            if(this.cursors.left.isDown || (SEYFARTH.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || SEYFARTH.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)) {
                this.player.sprite.frame = this.player.avatar;
                this.player.sprite.body.velocity.x -= this.player.velocityX;
                this.background.tilePosition.x += 0.2;
            }
            
            if(this.cursors.right.isDown || (SEYFARTH.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || SEYFARTH.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)) {
                this.player.sprite.frame = this.player.avatar + 1;
                this.player.sprite.body.velocity.x += this.player.velocityX;
                this.background.tilePosition.x -= 0.2;
            }
    
            if((this.fireButton.isDown || SEYFARTH.gamepadButtonPressed()) && this.player.sprite.body.enable) {
                this.fireBullet();
            }
    
            if (this.time.now > this.aliens.firingTimer) {
                this.enemyFires();
            }
    
            //  Run collision
            this.physics.arcade.overlap(this.player.bullets, this.aliens.group, this.collisionHandler, null, this);
            this.physics.arcade.overlap(this.player.bullets, this.bonusShip.sprite, this.bonusCollisionHandler, null, this);
            this.physics.arcade.overlap(this.player.sprite, this.powerUps.sprite, this.powerUpsCollisionHandler, null, this);
            this.physics.arcade.overlap(this.aliens.bullets, this.player.sprite, this.enemyHitsPlayer, null, this);

            this.physics.arcade.overlap(this.player.bullets, this.barriers.group, this.barrierCollisionHandler, null, this);
            this.physics.arcade.overlap(this.aliens.bullets, this.barriers.group, this.barrierCollisionHandler, null, this);
        }
    },
    render: function() {
        // console.log(this);
        // this.game.debug.body(this.bonusShip);
        // for(let i = 0; i < this.aliens.group.children.length; i++) {
        //     this.game.debug.body(this.aliens.group.children[i]);
        // }
        // this.game.debug.text(this.player.gamepad);

        // for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
        //     this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
        // }
    },
    updateScore: function(val) {
        this.player.score += val;
        this.hud.score.text = 'SCORE:\n' + this.player.score;
    },
    powerUpsCollisionHandler: function(player, powerup) {
        this.powerUps.timer.stop();

        const txt = this.add.text(
            powerup.x,
            powerup.y - 50,
            powerup.data.name + '\n+' + powerup.data.scoreValue,
            { 
                font: `${SEYFARTH.gameFontSize} ${SEYFARTH.fontFamily}`,
                fill: this.hud.color,
                align: 'center'
            });
        txt.lineSpacing = -5;
        txt.anchor.set(0.5);

        this.add.tween(txt).to(
            {
                alpha: 0,
                y: powerup.y - 200
            }, 
            2000, 
            null, 
            true, 
            0, 
            0,
            false);

        powerup.x = -100;

        this.player.shotsAllowed++;

        if(this.sfx) {
            this.powerUps.sfx.play();
        }

        this.updateScore(powerup.data.scoreValue);

        console.log(powerup);

        

        this.powerUps.timer.loop(Phaser.Timer.SECOND * this.rnd.integerInRange(10, 20), function() {
            this.resetPowerUps();            
        }, this);

        this.powerUps.timer.start();
    },
    bonusCollisionHandler: function(bonus, bullet) {
        // console.log(bonus.body.x, bonus.body.y, bonus);        
        bullet.kill();
        bonus.kill();

        this.bonusShip.tween.stop();

        this.updateScore(bonus.scoreValue);
        
        if(this.sfx) {
            this.aliens.killedAudio.play();
        }
        
        const explosion = this.explosions.group.getFirstExists(false);
        explosion.anchor.set(0.5);
        explosion.reset(bonus.body.x + bonus.body.halfWidth, bonus.body.y + bonus.body.halfHeight);
        explosion.play('kaboom', 30, false, true);

        const txt = this.add.text(
            bonus.x, bonus.y,
            bonus.scoreValue, 
            { 
                font: `${SEYFARTH.gameFontSize} ${SEYFARTH.fontFamily}`,
                fill: this.hud.color,
                align: 'center'
            });
        txt.anchor.set(0.5);

        this.add.tween(txt).to(
            {
                alpha: 0
            }, 
            3000, 
            null, 
            true, 
            0, 
            0,
            false);

        this.resetBonus();
    },
    barrierCollisionHandler: function(bullet, barrier) {
        bullet.kill();

        let explosion = this.explosions.group.getFirstExists(false);
        explosion.reset(bullet.body.x, bullet.body.y);
        explosion.play('kaboom', 30, false, true);

        if(barrier.health >= 25 && barrier.health - 5 < 25) {
           barrier.fadeTween = this.add
                .tween(barrier)
                .to(
                    {
                        alpha: 0.5
                    },
                    250,
                    Phaser.Easing.Quadratic.InOut,
                    true,
                    0,
                    1000,
                    true
                );
        }

        if(barrier.health <= 75) {
            let tint = (Math.floor(barrier.health / 100 * 255)).toString(16);
            tint.length === 1 ? tint = '0' + tint : tint = tint;
            // console.log('0xFF' + tint + tint);
            barrier.tint = '0xFF' + tint + tint;
        }

        barrier.health -= 5;
        if(barrier.health < 0) {
            barrier.kill();
        }
    },
    collisionHandler: function(bullet, alien) {        
        // When a bullet hits an alien we kill them both
        bullet.kill();
        alien.kill();
    
        this.updateScore(alien.scoreValue);
    
        // And create an explosion :)
        let explosion = this.explosions.group.getFirstExists(false);
        explosion.reset(alien.body.x + alien.offsetX, alien.body.y + alien.offsetY);
        explosion.play('kaboom', 30, false, true);
    
        if(this.sfx) {
            this.aliens.killedAudio.play();
        }

        if(this.aliens.group.countLiving() === 0) {
            this.aliens.bullets.callAll('kill', this);

            if(++this.currentLevel > _MAX_LEVELS_) {
                this.resetProps(true);
                // this.state.start("GAME_OVER", true, false, this.player.name, this.player.score);
                this.nextState();
                return;
            }

            this.restart();
        }
    
        this.aliens.delay -= 15 + this.currentLevel;
        if(this.aliens.delay < 50) {
            this.aliens.delay = 50;
        }
        this.aliens.resetTimer = true;
    },
    enemyHitsPlayer: function(player, bullet) {
        bullet.kill();
    
        this.player.inLimbo = true;

        const life = this.hud.lives.getFirstAlive();
    
        if(life) {
            player.body.checkCollision.none = true;
            player.body.enable = false;

            life.kill();

            if(this.sfx) {
                this.player.killedAudio.play();
            }

            player.frame += 2;

            this.player.curse.y = this.player.sprite.body.y - 10;

            if(player.frame % 2) {
                this.player.curse.x = this.player.sprite.x + this.player.curse.width / 2;
                this.player.curse.frame = 1;    
            }
            else {
                this.player.curse.x = this.player.sprite.x - this.player.curse.width / 2;
                this.player.curse.frame = 0;
            }

            this.player.curse.revive();

            const timer = this.time.create(true);
            timer.add(2000, function() {
                this.player.inLimbo = false;
                player.frame -= 2;
                
                this.player.curse.kill();

                player.body.enable = true;
                player.x = 100;

                player.alpha = 0.75;

                const tween = this.add
                    .tween(player)
                    .to(
                        {
                            alpha: 0.5
                        },
                        100,
                        null,
                        true,
                        0,
                        1000,
                        true
                    );

                // Give the player a couple of seconds of invincibility
                const tm = this.time.create(true);
                tm.add(2000, function() {
                    tween.stop();
                    player.alpha = 1;
                    player.body.checkCollision.none = false;
                }, this);
                tm.start();

                // this.player.skull.revive();
                // this.player.skull.body.gravity.y = 0.1;
                // this.player.skull.body.bounce.set(1);
            }, this);
            timer.start();
        }
        
        if(this.hud.lives.countLiving() < 1) {
            player.kill();
            this.aliens.bullets.callAll('kill');    
            this.nextState();
            return;
        }
    },
    enemyFires: function() {
        const livingEnemies = [];

        this.aliens.group.forEachAlive(function(alien){
            livingEnemies.push(alien);
        });
    
        const enemyBullet = this.aliens.bullets.getFirstExists(false);

        if(enemyBullet && livingEnemies.length > 0) {
            const random = this.rnd.integerInRange(0, livingEnemies.length - 1);
            
            const shooter = livingEnemies[random];

            enemyBullet.reset(shooter.body.x + shooter.body.width / 2, shooter.body.y + shooter.body.height);
    
            const vel = this.aliens.bulletVelocity + this.rnd.integerInRange(1, (this.currentLevel + 2) * 6);

            if(!(random % 2) && this.currentLevel > 2) {
                this.physics.arcade.moveToObject(enemyBullet, this.player.sprite, vel);
            }
            else {
                enemyBullet.body.velocity.y = this.aliens.bulletVelocity + vel;
            }
    
            const timeAdd = this.rnd.integerInRange(-this.currentLevel * 150, this.currentLevel * 150);
            this.aliens.firingTimer = this.time.now + this.aliens.firingDelay + timeAdd - this.currentLevel * 100;
        }
    },
    fireBullet: function() {
        let i = 0;
        
        if(!this.isTesting) {
            this.player.bullets.forEachAlive(function() {
                i++;
            });
    
            if(i >= this.player.shotsAllowed) {
                return;
            }
    
            if(this.time.now < this.player.bulletTime) {
                return;
            }
        }

        //  Grab the first bullet we can from the pool
        let bullet = this.player.bullets.getFirstExists(false);

        if(bullet) {
            bullet.reset(this.player.sprite.x, this.player.sprite.y - 30);
            bullet.body.velocity.y = -this.player.bulletVelocity;

            this.player.bulletTime = this.time.now + 200;

            if(this.sfx) {
                this.player.shootAudio.play();
            }
        }
    },
    resetProps: function(kill) {
        this.resetBonus(kill);

        this.player.bullets.callAll('kill');
        this.aliens.bullets.callAll('kill');
        
        if(this.currentLevel > _MAX_LEVELS_ || kill) {
            this.currentLevel = 1;
        }

        this.aliens.direction = 1;
        
        this.aliens.timer.stop();
        this.aliens.delay = 800;
        this.aliens.group.removeAll();
    },
    restart: function() {
        this.resetProps();

        this.createEnemies();
    
        this.player.sprite.revive();
    },
    nextState: function() {
        const tm = this.time.create(true);
        tm.add(2000, function() {
            this.resetProps(true);
            this.state.start("STATE_YOUWIN", true, false, this.player.name, this.player.score);
        }, this);
        tm.start();
	}
}
