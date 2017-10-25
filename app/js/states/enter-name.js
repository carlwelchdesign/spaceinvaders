"use strict"

const stateEnterName = function(game){
	this.styles = { 
		font: `${SEYFARTH.fontSize} ${SEYFARTH.fontFamily}`,
		fill: '#fff' 
	};

	this.subtitle1 = null;
	this.subtitle_str1 = '* GET READY TO PLAY *';

	this.subtitle2 = null;
	this.subtitle_str2 = 'ENTER YOUR INITIALS';

	this.subtitle3 = null;
	this.subtitle_str3 = 'CHOOSE YOUR AVATAR';

	this.avatarBox = null;
}

stateEnterName.prototype = {
	init: function(score) {
	},
	preload: function(){
        this.load.spritesheet('avatars', 'assets/sprites/avatars.png', 90, 200);
		this.load.image('white-logo', 'assets/logos/white.png');
	},
	buildAvatars: function() {
		this.avatarBox = this.add.group();
		this.avatarBox.y = 500;

		for(let i = 0; i < 7; i++) {
			let avatar = this.game.add.button(i * 100, 0, 'avatars', function() {
				this.submitPrefs(i)
			}, this);
			avatar.frame = i * 4;
			avatar.scale.set(0);
			avatar.anchor.set(0.5);

			this.add.tween(avatar.scale)
				.to( 
					{ 
						x: 0.75, 
						y: 0.75 
					}, 
					500, 
					Phaser.Easing.Bounce.Out, 
					true, 
					i * 100
				);

			this.avatarBox.add(avatar);
		}

		this.avatarBox.x = this.world.width / 2;

		this.add.tween(this.avatarBox)
			.to({ 
					x: 380
				}, 
				800, 
				Phaser.Easing.Quadratic.InOut,
				true
			);
	},
	create: function() {
		const logo = this.add.sprite(this.world.width / 2, this.world.height - 50, 'white-logo');
		logo.scale.set(0.1);
		logo.anchor.set(0.5);

		const title = this.add.sprite(this.world.width / 2, 82, 'title');
		title.scale.set(0.25);
		title.anchor.set(0.5);
		
		this.add.tween(title.scale)
			.to(
				{
					x: 0.245,
					y: 0.245
				},
				900,
				Phaser.Easing.Quadratic.InOut,
				true,
				0,
				1000,
				true
			);

        this.subtitle1 = this.add.text(this.game.width/2, 150, this.subtitle_str1, this.styles);
		this.subtitle1.anchor.setTo(.5,.5);

        this.subtitle2 = this.add.text(this.game.width/2, 220, this.subtitle_str2, this.styles);
		this.subtitle2.anchor.setTo(.5,.5);

        this.subtitle3 = this.add.text(this.game.width/2, 400, this.subtitle_str3, this.styles);
		this.subtitle3.anchor.setTo(.5,.5);

		this.inputBox = this.add.inputField(400, 256, {
		    font: `55px ${SEYFARTH.fontFamily}`,
		    fill: '#fff',
		    backgroundColor: '#000',
		    max: 3,
		    forceCase: 2,
		    cursorColor: '#fff',
		    width: 538,
		    height:80,
		    padding: 8,
		    borderWidth: 1,
		    borderColor: '#ffffff',
		    borderRadius: 0,
		    placeHolder: '',
		    textAlign : 'center',
		    textTransform: 'uppercase',
		});

		this.inputBox.startFocus();
		this.buildAvatars();
	},
	render: function(){
		if(SEYFARTH.debug){
			for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
	            this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
	        }
	    }
	},
	submitPrefs: function(avatarId) {
		// http://www.html5gamedevs.com/topic/4702-states-with-parameters/
		if(this.inputBox.value === '') {
			this.add
				.tween(this.subtitle2.scale)
				.to(
					{
						x: 0.5,
						y: 0.5
					},
					400,
					Phaser.Easing.Quadratic.InOut,
					true,
					0,
					1000,
					true
				);
		}
		else {
			let playerName = this.inputBox.value.toUpperCase();
			let playerAvatar = avatarId;
			this.game.state.start("STATE_SCORETABLE", true, false, playerName, playerAvatar)
		}
	}
}