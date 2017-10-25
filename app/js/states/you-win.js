'use strict';

const stateYouWin = function(game) {
	this.styles = { 
		font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`,
		fill: '#000' 
	};

	this.name = '';
	this.score = 0
};

stateYouWin.prototype = {
	init: function(name, score) {
		this.name = name;
		this.score = score;

		SEYFARTH.mapGenericKeys(this);
		this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.nextState, this);
	},
	preload: function() {
        this.load.image('background', 'assets/backgrounds/city.png');
		this.load.image('youwin', 'assets/sprites/you-win.png');
		this.load.image('blue-logo', 'assets/logos/blue.png');
	},
	render: function() {
		if(SEYFARTH.debug) {
			for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
	            this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
	        }
	    }
	},
  	create: function() {
        this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');

		const youwin = this.add.sprite(this.world.width / 2, 300, 'youwin');
		youwin.scale.set(0.7);
		youwin.anchor.set(0.5);

		this.add
			.text(this.world.width / 2, this.world.height - 45, 'PRESS SPACEBAR OR FIRE BUTTON TO CONTINUE', this.styles)
			.anchor.set(0.5);

		const logo = this.add.sprite(this.world.width / 2, this.world.height - 150, 'blue-logo');
		logo.scale.set(0.15);
		logo.anchor.set(0.5);		
	},
	update: function() {
		if(SEYFARTH.gamepadButtonPressed()) {
			this.nextState();
		}
	},
	nextState: function() {
		this.state.start('STATE_GAMEOVER', true, false, this.name, this.score);
	}
}
