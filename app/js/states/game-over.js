"use strict"

const stateGameOver = function(game){
	this._name = '';
	this._score = 0;
	this.newscore = null;
	this.highscores = [];
	this.anchor_center = 0.5;
	this.title_scale = .252;
	this.subtitle_str = '* HIGH SCORES *';
}
 
stateGameOver.prototype = {
	init: function(name, score) {
		this._name = name;
        this._score = score;
		console.log("%cGAME OVER", "color:white; background:blue");
		// music.play();
	},
	create: function() {
		this.camera.flash('#000000', 3000);		
	},
	saveScore: function(data){
		if (localStorage.getItem("highscores") === null) {
		    this.highscores = [];
		    this.highscores.push(JSON.parse(localStorage.getItem('highscores')));
		    localStorage.setItem('highscores', JSON.stringify(this.highscores));
		}
	    this.highscores = JSON.parse(localStorage.getItem('highscores'));
	    this.highscores.push(data);
	    //console.log(this.highscores)
	   // this.highscores..slice(0,6)
	    localStorage.setItem('highscores', JSON.stringify(this.highscores));
	    this.buildScores();
	},
	render: function(){
		if(SEYFARTH.debug){
			for(let i = this.world.width / 4; i <= this.world.width; i += this.world.width / 4) {
	            this.game.debug.geom(new Phaser.Rectangle(i, 0, 1, this.world.height), 'rgba(255,0,0,0.5)' );
	        }
	    }
	},
	buildScores: function(){
		//console.log('>>>>>>>> this.highscores', this.highscores);
		
		let newList = this.highscores.filter((item,i) => {
		  //console.log(item)
		  if (item!==null && item!==undefined && item.name!==undefined && item.name !==''){
		    return item;
		  }
		})

		newList = newList.sort((a, b) => {
	    	const scoreA = a.score;
	    	const scoreB = b.score;
	    	let comparison = 0;
	    	if (scoreA > scoreB) {
	    		comparison = 1;
	    	} else if (scoreA < scoreB) {
	    		comparison = -1;
	    	}
	    	return comparison * -1;
		}).slice(0,7);

		console.log(newList)

		newList.map((item,i) => {
			const itemY = (i*50)+200;
			console.log(item.score.toString().length);

			let score = this.pad(parseInt(item.score));
			let name = this.namePad(parseInt(item.name));
			const str = `${score}  ${item.name}`;
			const subtitle = this.game.add.text( (this.game.width/2), itemY+50, str.toUpperCase(), { 
				font: `40px ${SEYFARTH.fontFamily}`, 
				fill: '#000', 
				align: 'center' 
			});
			subtitle.anchor.setTo( this.anchor_center, this.anchor_center );
			subtitle.alpha = 0;
			this.game.add.tween(subtitle).to( { alpha: 1, y: itemY}, 100, Phaser.Easing.Out, true, i*100);
		})
	},
	pad: function(n) { 
		return ("000000" + n).slice(-6); 
	},
	namePad: function(n) { 
		return ("   " + n).slice(-3); 
	},
	//bands.sort(compare);	
	update: function(){
		this.background.tilePosition.x -= 1;
	},
  	create: function(){

		this.background = this.game.add.tileSprite(0, -400, 1364, 768, 'background');
		this.background.scale.setTo(1.3, 1.3);
		this.background.x = 0;
		this.background.y = 0;
		this.background.alpha = 0;
		this.fadeBG = this.game.add.tween(this.background).to( { alpha: 1 }, 500, Phaser.Easing.Out, true);

		this.blueLogo = this.game.add.sprite(this.game.width/2,this.game.world.height-150,"blueLogo");
		this.blueLogo.scale.setTo(0, 0);
		this.blueLogo.anchor.setTo(.5,.5);
		this.game.add
        	.tween(this.blueLogo.scale)
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

		this.title = this.game.add.sprite( this.game.width/2, 82,"title");
		this.title.scale.setTo( this.title_scale, this.title_scale );
		this.title.anchor.setTo( this.anchor_center, this.anchor_center );
		this.game.add
			.tween(this.title.scale)
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

		
        this.subtitle = this.game.add.text( this.game.width/2, 150, this.subtitle_str, { 
			font: `20px ${SEYFARTH.fontFamily}`, 
			fill: '#000', 
			align: 'center' 
		}).anchor.setTo( this.anchor_center, this.anchor_center );

		

		//_____________LOCALSTARE HIGH SCORES

		this.newscore = {name:this._name, score:this._score};
		this.saveScore(this.newscore);
		this.game.time.events.add(Phaser.Timer.SECOND * 10, this.playTheGame, this);


	},
	playTheGame: function(){
		SEYFARTH.isDemo = true;
		this.game.state.start("INTRO");
	}
}