'use strict';

const stateController = function(game) {
	this.styles = { 
		font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`,
		fill: '#fff' 
	};
};

stateController.prototype = {
	init: function() {
		SEYFARTH.mapGenericKeys(this);
		this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.nextState, this);
	},
	preload: function() {
		this.load.image('levelup', 'assets/sprites/levelup.png');
		this.load.image('gamepad', 'assets/sprites/gamepad.png');
		this.load.image('white-logo', 'assets/logos/white.png');
	},
	render: function() {
		if(SEYFARTH.debug) {
			for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
	            this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
	        }
	    }
	},
  	create: function() {
		const levelup = this.add.sprite(this.world.width / 2, 82, 'levelup');
		levelup.scale.set(0.25);
		levelup.anchor.set(0.5);
		
		this.add.tween(levelup.scale)
			.to(
				{
					x: 0.24,
					y: 0.24
				},
				900,
				Phaser.Easing.Quadratic.InOut,
				true,
				0,
				1000,
				true
			);

		this.add
			.text(this.game.width / 2, 150, '* GAME CONTROLS *', this.styles)
			.anchor.set(0.5);
	
		const gamepad = this.add.sprite(this.world.width / 2 + 45, 380, 'gamepad');
		gamepad.anchor.set(0.5);
		gamepad.alpha = 0;
		this.add.tween(gamepad).to(
			{
				alpha: 1
			},
			1000,
			Phaser.Easing.Quadratic.InOut,
			true,
			0);

		this.add
			.text(this.world.width / 2, this.world.height - 125, 'PRESS SPACEBAR OR FIRE BUTTON TO CONTINUE', this.styles)
			.anchor.set(0.5);

		const logo = this.add.sprite(this.world.width / 2, this.world.height - 50, 'white-logo');
		logo.scale.set(0.15);
		logo.anchor.set(0.5);		
	},
	update: function() {
		if(SEYFARTH.gamepadButtonPressed()) {
			this.nextState();
		}
	},
	nextState: function() {
		this.state.start('STATE_KEYBOARD', true, false);
	}
}
