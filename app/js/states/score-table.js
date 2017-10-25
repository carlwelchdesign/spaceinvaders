'use strict';

var stateScoreTable = function(game) {
	this.playerName = '';
	this.playerAvatar = 0;
	this.titleScale = .252;

	this.styles = { 
		  font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`,
		  fill: '#fff' 
		};

	this.columns = [
		[
			{
				sprite: 'power-ups',
				frame: 5,
				text: '? MYSTERY',
				delay: 100
			},
			{
				sprite: 'power-ups',
				frame: 4,
				text: '100 POINTS',
				delay: 200
			},
			{
				sprite: 'power-ups',
				frame: 3,
				text: '100 POINTS',
				delay: 300
			},
			{
				sprite: 'power-ups',
				frame: 1,
				text: '100 POINTS',
				delay: 400
			},
			{
				sprite: 'power-ups',
				frame: 0,
				text: '100 POINTS',
				delay: 500
			},
			{
				sprite: 'power-ups',
				frame: 2,
				text: '100 POINTS',
				delay: 600
			}
		],
		[
			{
				sprite: 'enemy-sprites',
				frame: 0,
				text: '40 POINTS',
				delay: 700
			},
			{
				sprite: 'enemy-sprites',
				frame: 2,
				text: '30 POINTS',
				delay: 800

			},
			{
				sprite: 'enemy-sprites',
				frame: 4,
				text: '20 POINTS',
				delay: 900
			},
			{
				sprite: 'enemy-sprites',
				frame: 6,
				text: '10 POINTS',
				delay: 1000
			}
		]
	];
}


stateScoreTable.prototype = {
	init: function( playerName, playerAvatar ) {
		this.playerName = playerName;
		this.playerAvatar = playerAvatar;
	},
	preload: function() {
        this.load.spritesheet('enemy-sprites', 'assets/sprites/enemy.png', 200, 200);    
        this.load.spritesheet('power-ups', 'assets/sprites/power-ups.png', 200, 200);
	},
	buildTable: function(col, xOffset) {
		const icon_scale = 0.25;
		
		const style = { 
			font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`,
			fill: '#fff' 
		};

		col.forEach((item, i) => {
			const itemY = i * 75 + 230;

			let sprite = this.game.add.sprite(this.game.width / 2 + xOffset, itemY, item.sprite);
			sprite.frame = item.frame;
			sprite.scale.set(0);
			sprite.anchor.set(0.5);
			this.game.add.tween(sprite.scale)
				.to({
					x: icon_scale,
					y: icon_scale
				},
				500,
				Phaser.Easing.Bounce.Out,
				true,
				item.delay
			);

			let txt = this.game.add.text(this.game.width / 2 + xOffset + 110, itemY + 2, '= ' + item.text, style);
			txt.anchor.setTo(.5,.5);
			txt.alpha = 0;
			this.game.add.tween(txt)
				.to({
					alpha: 1
				},
				500,
				Phaser.Easing.Out,
				true,
				item.delay
			);
		});
	},
  	create: function() {  		
		this.whiteLogo = this.game.add.sprite(this.game.width / 2 ,this.game.world.height - 50, 'whiteLogo');
		this.whiteLogo.scale.set(0.1);
		this.whiteLogo.anchor.set(0.5);

		this.title = this.game.add.button(this.game.width / 2, 82, 'title', this.playTheGame, this);
		this.title.scale.set(this.titleScale);
		this.title.anchor.set(0.5);
		this.game.add
			.tween(this.title.scale)
			.to(
				{
					x: 0.25,
					y: 0.25
				},
				900,
				Phaser.Easing.Quadratic.InOut,
				true,
				0,
				1000,
				true
			);

		this.subtitle = this.game.add.text(this.game.width / 2, 150, '* SCORE ADVANCE TABLE *', this.styles);
		this.subtitle.anchor.set(0.5);

		this.buildTable(this.columns[0], -220);
		this.buildTable(this.columns[1], 70);

		this.add
			.text(this.world.width / 2, this.world.height - 50, 'PRESS SPACEBAR OR FIRE BUTTON TO CONTINUE', this.styles)
			.anchor.set(0.5);

		this.game.time.events.add(Phaser.Timer.SECOND * 5, this.gotoHighScore, this);
		this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.exitDemoMode, this);			
	},
	update: function() {
		if(SEYFARTH.gamepadButtonPressed()) {
			this.exitDemoMode();
		}
	},
	render: function(){
		if(SEYFARTH.debug) {
			for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
	            this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
	        }
	    }
	},
	exitDemoMode: function(){
		SEYFARTH.isDemo = false;
		this.playTheGame();

		SEYFARTH.isDemo ? (
			this.game.state.start("STATE_GAMEOVER")
		) : (
			!this.playerName ? (			
				this.game.state.start("STATE_ENTERNAME")
			) : (
				this.game.state.start("THE_GAME", true, false, this.playerName, this.playerAvatar)
			)
		)
	},
	playTheGame: function() {
		SEYFARTH.music.stop();
	},
	gotoHighScore: function() {
		SEYFARTH.isDemo ? (
			this.game.state.start("STATE_GAMEOVER")
		) : (
			this.gotoGame()
		)
	}, 
	gotoGame: function() {
		SEYFARTH.music.fadeOut(250);
		this.state.start('THE_GAME', true, false, this.playerName, this.playerAvatar);
	}
}