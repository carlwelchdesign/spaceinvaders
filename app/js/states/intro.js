'use strict';

const stateIntro = function(game){
	this.background = null;
	this.blueLogo = null;
	this.title = null;
	this.mainLogo = null;
};

stateIntro.prototype = {
	init: function() {
		SEYFARTH.mapGenericKeys(this);
	},
	preload: function(){
		this.game.load.image('background', 'assets/backgrounds/city.png');
		this.game.load.image('title', 'assets/general/title.png');

		this.game.load.image('blueLogo', 'assets/logos/blue.png');
		this.game.load.audio('boden', ['assets/audio/All_of_Us.mp3']);

		this.game.add.plugin(PhaserInput.Plugin);

	},
	render: function(){
		if(SEYFARTH.debug){
			for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
	            this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
	        }
	    }
	},
  	create: function() {
		if(!SEYFARTH.music || !SEYFARTH.music.isPlaying) {
			SEYFARTH.music = this.game.add.audio('boden');
			SEYFARTH.music.volume = SEYFARTH.volume;
			SEYFARTH.music.play();
		}

  		this.background = this.game.add.tileSprite(0, -200, 1364, 768, 'background');
  		this.background.scale.setTo(1.3, 1.3);
  		this.background.alpha = 0;
  		this.fadeBG = this.game.add.tween(this.background).to( { alpha: 1 }, 500, Phaser.Easing.Out, true);


  		this.mainLogo = this.game.add.sprite(this.game.width/2, 170,"blueLogo");
        this.mainLogo.scale.setTo(0, 0);
        this.mainLogo.anchor.setTo(.5,.5);
        this.game.add
        	.tween(this.mainLogo.scale)
        	.to( 
        		{ 
        			x: .2, 
        			y: .2 
        		}, 
        		500, 
        		Phaser.Easing.Bounce.Out, 
        		true, 
        		1500
        	);

		this.title = this.game.add.sprite(this.world.width / 2, -250, 'title');
		this.title.scale.set(0.55);
		this.title.anchor.set(0.5);

		this.game.add
			.tween(this.title)
			.to( 
				{ 
					y: 350 
				}, 
				1500, 
				Phaser.Easing.Bounce.Out, 
				true
			);

		this.add.text(
			this.world.width / 2,
			this.world.height - 55,
			'PRESS SPACEBAR OR FIRE BUTTON TO CONTINUE',
			{ 
				font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`,
				fill: '#000' 
			})
			.anchor.set(0.5);

		this.add.text(
			this.world.width / 2,
			this.world.height - 25,
			'Copyright 2017 Seyfarth Shaw LLP',
			{ 
				font: `14px ${SEYFARTH.fontFamily}`,
				fill: '#000' 
			})
			.anchor.set(0.5);

		this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.exitDemoMode, this);			
		this.time.events.add(Phaser.Timer.SECOND * SEYFARTH.demoScreenTime, this.playTheGame, this);
	},
	update: function(){
		this.background.tilePosition.x -= 1;

		if(SEYFARTH.gamepadButtonPressed()) {
			this.exitDemoMode();
		}
	},
	exitDemoMode: function() {
		SEYFARTH.isDemo = !SEYFARTH.isDemo;
		this.playTheGame();
	},
	playTheGame: function() {
		this.dropTitle = this.game.add
			.tween(this.mainLogo)
			.to( 
				{ 
					alpha: 0
				}, 
				700, 
				Phaser.Easing.Quadratic.In, 
				true
			);

		this.fadeLogo = this.game.add
			.tween(this.title)
			.to( 
				{ 
					y: 1200,
					alpha: 0
				}, 
				1500, 
				Phaser.Easing.Quadratic.In, 
				true
			);

		this.dropTitle.onComplete.add(function() {
			const bg = this.game.add.tween(this.background).to( { alpha: 0 }, 500, Phaser.Easing.Out, true);
			bg.onComplete.add(function() {
				this.game.state.start("TUTORIAL")
			}, this);
		}, this);
	}
}


