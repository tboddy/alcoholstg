const start = {

	draw(){

		const bg = () => {
			const bg = PIXI.Sprite.fromImage('img/start.png'), img = PIXI.Sprite.fromImage('img/start-img.png'),
				logo = PIXI.Sprite.fromImage('img/start-logo.png');
			bg.x = 0;
			bg.y = 0;
			bg.zIndex = 1;
			bg.isStart = true;
			game.stage.addChild(bg);
			img.anchor.set(0.5)
			img.x = winWidth / 2;
			img.y = winHeight / 2;
			img.isStart = true;
			img.zIndex = 2;
			game.stage.addChild(img);
			logo.anchor.set(0.5)
			logo.x = winWidth / 2;
			logo.y = grid * 6.5;
			logo.zIndex = 3;
			logo.isStart = true;
			game.stage.addChild(logo);
		},

		prompt = () => {
			const label = new PIXI.extras.BitmapText('press z to start', {font: '12px crass'}),
				labelF = new PIXI.extras.BitmapText('f for fullscreen', {font: '12px crass'});
			label.anchor.set(0.5);
			label.x = winWidth / 2;
			label.y = winHeight - grid * 7.25
			label.zIndex = 4;
			label.isStart = true;
			game.stage.addChild(label);
			labelF.anchor.set(0.5);
			labelF.x = winWidth / 2;
			labelF.y = winHeight - grid * 6.25
			labelF.zIndex = 4;
			labelF.isStart = true;
			game.stage.addChild(labelF);
		},

		credits = () => {
			const label = new PIXI.extras.BitmapText('2018 boddy', {font: '12px crass'})
			label.zIndex = 4;
			label.isStart = true;
			label.anchor.set(1);
			label.x = winWidth - grid * 1;
			label.y = winHeight - grid * 1;
			game.stage.addChild(label);
		};

		bg();
		prompt();
		credits();

	},

	init(){
		start.draw();
		// spawnSound.bgmOne();
	}

};