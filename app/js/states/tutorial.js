'use strict';

const stateTutorial = function(game) {
	this.subtitle = null;
	this.whiteLogo = null;

	this.blocks = [
		{
			text: 'ELIMINATE OBSTACLES TO YOUR SUCCESS!',
			y: 210,
			delay: 100,
			items: [
				{
					sprite: 'enemy-sprites',
					frame: 0,
					text: 'Bad\nCommunication',
					delay: 100
				},
				{
					sprite: 'enemy-sprites',
					frame: 2,
					text: 'Potential\nRisks',
					delay: 200
	
				},
				{
					sprite: 'enemy-sprites',
					frame: 4,
					text: 'Looming\nDeadlines',
					delay: 300
				},
				{
					sprite: 'enemy-sprites',
					frame: 6,
					text: 'Frustration',
					delay: 400
				}
			]
		},
		{
			text: 'COLLECT SKILLS TO LEVEL UP AND WORK MORE EFFICIENTLY!',
			y: 400,
			delay: 500,
			items: [
				{
					sprite: 'power-ups',
					frame: 4,
					text: 'Technology',
					delay: 100
				},
				{
					sprite: 'power-ups',
					frame: 3,
					text: 'Project\nManagement',
					delay: 200
				},
				{
					sprite: 'power-ups',
					frame: 1,
					text: 'Data',
					delay: 400
				},
				{
					sprite: 'power-ups',
					frame: 0,
					text: 'Process\nImprovement',
					delay: 500
				},
				{
					sprite: 'power-ups',
					frame: 2,
					text: 'Change\nManagement',
					delay: 600
				}
			]
		},
		{
			text: 'PROTECT YOURSELF, BUT NOT FOR TOO LONG!',
			y: 580,
			delay: 1000,
			items: [
				{
					sprite: 'barrier',
					scale: 0.15,
					frame: 0,
					text: '',
					delay: 1000
				}
			]
		}
	];
}

stateTutorial.prototype = {
	init: function() {
		SEYFARTH.mapGenericKeys(this);
	},
	preload: function() {
		this.load.image('white-logo', 'assets/logos/white.png');
        this.load.image('barrier', 'assets/sprites/barrier.png');
        
        this.load.spritesheet('avatars', 'assets/sprites/avatars.png', 90, 200);
        this.load.spritesheet('enemy-sprites', 'assets/sprites/enemy.png', 200, 200);    
        this.load.spritesheet('power-ups', 'assets/sprites/power-ups.png', 200, 200);
	},
	buildBlocks: function(blocks) {
		blocks.forEach((block, i) => {
			let title = this.game.add.text(this.world.width / 2, block.y, block.text, { 
				font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`, 
				fill: '#fff',
				align: 'center'
			});
			title.alpha = 0;
			title.anchor.set(0.5);

			this.add.tween(title).to(
				{
					alpha: 1
				},
				500,
				Phaser.Easing.Out,
				true,
				block.delay);
			
			let blockGroup = this.game.add.group();
			blockGroup.x = this.world.width / 2;
			blockGroup.y = block.y;

			block.items.forEach((item, ii) => {
				//Building the Icons & subtitles
				let icon = this.add.sprite(-250, 58, item.sprite);
				icon.frame = item.frame;
				icon.scale.set(0);
				icon.anchor.set(0.5);

				this.game.add.tween(icon.scale).to(
					{
						x: item.scale || 0.25,
						y: item.scale || 0.25
					},
					500,
					Phaser.Easing.Bounce.Out,
					true,
					item.delay);

				let text = this.game.add.text(-250, 110, item.text, {
					font: `16px  ${SEYFARTH.fontFamily}`, 
					fill: '#fff', 
					boundsAlignH: "center", 
					boundsAlignV: "middle", 
					align: "center" 
				});
				text.anchor.set(0.5);
				text.lineSpacing = -5;
				text.alpha = 0;

				this.add.tween(text).to(
					{
						alpha: 1
					},
					500,
					Phaser.Easing.Out,
					true,
					item.delay);

				let tile = this.game.add.group();
				tile.x = ii * 120 + 50;
				tile.y = -10;
				tile.add(icon);
				tile.add(text);
				blockGroup.add(tile);
			});

			blockGroup.centerX = this.world.centerX;
		})
	},
  	create: function() {
		const logo = this.add.sprite(this.world.width / 2, this.world.height - 50, 'white-logo');
		logo.scale.set(0.1);
		logo.anchor.set(0.5);

		const title = this.add.sprite(this.game.width / 2, 82, 'title');
		title.scale.set(0.25);
		title.anchor.set(0.5);

		this.add.tween(title.scale)
			.to({
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
		
        const subtitle = this.add.text(this.world.width / 2, 150, '* GAME PLAY TUTORIAL *', {
			font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`, 
			fill: '#fff', 
			align: 'center' 
		})
		subtitle.anchor.set(0.5);

		this.buildBlocks(this.blocks);

		this.game.time.events.add(Phaser.Timer.SECOND * SEYFARTH.demoScreenTime, this.gotoHighScore, this);
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
	exitDemoMode: function() {
		SEYFARTH.isDemo = false;
		this.playTheGame();
	},
	playTheGame: function() {
		this.game.state.start('STATE_CONTROLLER');
	},
	gotoHighScore: function() {
		SEYFARTH.isDemo ? this.state.start("STATE_SCORETABLE") : this.state.start('STATE_CONTROLLER');
	}
}