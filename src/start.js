const start = {

	list: [
		{label: 'Start'},
		{label: 'Scores'},
		{label: 'Options'},
		{label: 'Music'},
		{label: 'Quit'}
	],

	draw(){

		const bg = () => {
			const bg = PIXI.Sprite.fromImage('img/start.png');
			bg.x = 0;
			bg.y = 0;
			bg.zIndex = 1;
			bg.isStart = true;
			game.stage.addChild(bg);
		},

		circle = () => {
			const circle = new PIXI.Graphics();
			circle.zIndex = 2;
			circle.lineStyle(0);
			circle.beginFill(0x140c1c);
			circle.drawCircle(winWidth / 2, winHeight / 2, winHeight / 2 - 40);
			circle.endFill();
			game.stage.addChild(circle);
			console.log(circle)
		},

		title = () => {
			const logo = PIXI.Sprite.fromImage('img/start-logo.png');
			logo.anchor.set(0.5)
			logo.x = winWidth / 2;
			logo.y = grid * 6.5;
			logo.zIndex = 5;
			logo.isStart = true;
			game.stage.addChild(logo);
		},

		list = () => {
			let labelY = winHeight / 2;
			const drawLabel = input => {
				const label = new PIXI.Text(input.toUpperCase(), PIXI.TextStyle({
					fill: colors.light,
					fontFamily: 'dies',
					fontSize: 16,
					dropShadow: true,
					dropShadowAlpha: 1,
					dropShadowAngle: Math.PI / 2,
					dropShadowDistance: 1,
					dropShadowColor: colors.dark,
				}))
				label.anchor.set(0.5);
				label.x = winWidth / 2;
				label.y = labelY;
				game.stage.addChild(label);
				labelY += grid;
			};
			start.list.forEach(listItem => {
				drawLabel(listItem.label);
			});
		};

		bg();
		circle();
		list();

	},

	init(){
		start.draw();
		// spawnSound.bgmOne();
	}

};