const fontStyle = () => {
	return new PIXI.TextStyle({
		fill: colors.light,
		fontFamily: 'bitmap',
		fontSize: 14
	});
},

sidebarWidth = (winWidth - gameWidth) / 2,

chrome = {

	drawLabel(input, x, y, color){
		const label = new PIXI.extras.BitmapText(input, {font: '12px crass'});
		label.x = x ? gameX + gameWidth + grid : winWidth - label.width - grid;
		label.y = y;
		label.zIndex = 101;
		game.stage.addChild(label);
	},

	drawStats(){
		const drawScore = () => {
			chrome.drawLabel('HI', true, grid );
			chrome.drawLabel(processScore(highScore), false, grid);
			chrome.drawLabel('SC', true, grid * 2);
			chrome.drawLabel(processScore(currentScore), false, grid * 2);
		}, drawLives = () => {
			let str = '';
			for(i = 0; i < player.data.lives - 1; i++) str += 'X'
			chrome.drawLabel('player', true, grid * 4);
			chrome.drawLabel(str, false, grid * 4);
		}, drawBombs = () => {
			let str = '';
			for(i = 0; i < player.data.bombs; i++) str += 'X'
			chrome.drawLabel('bomb', true, grid * 5);
			chrome.drawLabel(str, false, grid * 5);
		}, drawPunk = () => {
			let str = String(player.data.punk) + 'X';
			chrome.drawLabel('punk', true, grid * 7);
			chrome.drawLabel(str, false, grid * 7);
		}, drawDrunk = () => {
			let str = String((player.data.drunk / 100 * 4).toFixed(2));
			if(player.data.drunk >= 100) str = 'max';
			chrome.drawLabel('drunk', true, grid * 8);
			chrome.drawLabel(str, false, grid * 8);
		}
		drawScore();
		drawLives();
		drawBombs();
		drawPunk();
		drawDrunk();
	},

	drawBorders(){
		const borderGraphics = new PIXI.Graphics();
		borderGraphics.zIndex = 100;
		borderGraphics.lineStyle(0);
		borderGraphics.beginFill(0x140c1c);
		borderGraphics.drawRect(0, 0, winWidth, grid);
		borderGraphics.drawRect(0, winHeight - grid, winWidth, grid);
		borderGraphics.drawRect(0, grid, sidebarWidth, gameHeight);
		borderGraphics.drawRect(gameX + gameWidth, grid, sidebarWidth, gameHeight);
		borderGraphics.endFill();
		game.stage.addChild(borderGraphics);
		const borderImage = PIXI.Sprite.fromImage('img/border.png');
		borderImage.anchor.set(0.5);
		borderImage.x = winWidth / 2;
		borderImage.y = winHeight / 2;
		borderImage.zIndex = 101;
		game.stage.addChild(borderImage);
	},

	drawFps(){
		const label = new PIXI.extras.BitmapText(game.ticker.FPS.toFixed(2), {font: '12px crass'});
		label.zIndex = 101;
		label.isFps = true;
		label.x = winWidth - label.width - grid;
		label.y = winHeight - label.height - grid;
		game.stage.addChild(label);
	},

	updateFps(label){
		if(Math.round(game.ticker.lastTime / 50) % 2 == 0){
			if(!label.didDo){
				label.text = game.ticker.FPS.toFixed(2) + ' FPS'
				label.x = winWidth - label.width - grid;
			}
			label.didDo = true;
		} else if(label.didDo) label.didDo = false;
	},

	drawDebug(){

		const drawDebugLabel = (input, x, y, type) => {
			const label = new PIXI.extras.BitmapText(input, {font: '12px crass'});
			label.x = x ? grid : gameX - label.width - grid;
			label.y = y;
			label.zIndex = 101;
			if(type){
				label.isDebug = true;
				label[type] = true;
			}
			game.stage.addChild(label);
		};

		drawDebugLabel('DEBUG', true, grid);

		drawDebugLabel('ENEMY', true, grid * 3);
		drawDebugLabel(enemyCount, false, grid * 3, 'isEnemyCount');

		drawDebugLabel('SHOT', true, grid * 4);
		drawDebugLabel(bulletCount, false, grid * 4, 'isBulletCount');

	},

	updateDebug(child){
		if(child.isEnemyCount) child.text = String(enemyCount);
		else if(child.isBulletCount) child.text = String(bulletCount);
		child.x = gameX - child.width - grid;
	},

	drawLogo(){
		const logo = PIXI.Sprite.fromImage('img/logo-sidebar.png');
		logo.anchor.set(0.5);
		const offset = gameWidth + gameX
		logo.x = offset + ((winWidth - offset) / 2);
		logo.y = winHeight - grid * 7;
		logo.zIndex = 101;
		game.stage.addChild(logo);
	},

	init(){
		chrome.drawBorders();
		chrome.drawFps();
		chrome.drawDebug();
		chrome.drawStats();
		chrome.drawLogo();
	}

};




// drawStats = () => {
// 	const playerStyle = fontStyle(), bombStyle = fontStyle();
// 	playerStyle.fill = colors.red;
// 	bombStyle.fill = colors.blue;
// 	const playerLabel = new PIXI.Text('***', playerStyle),
// 		bombLabel = new PIXI.Text('**', bombStyle);
// 	playerLabel.x = gameWidth - playerLabel.text.length * 8 - grid;
// 	playerLabel.y = grid - 3;
// 	playerLabel.zIndex = 100;
// 	bombLabel.x = gameWidth - bombLabel.text.length * 8 - grid;
// 	bombLabel.y = grid * 2 - 3;
// 	bombLabel.zIndex = 100;
// 	game.stage.addChild(playerLabel);
// 	game.stage.addChild(bombLabel);
// },

// drawBar = barY => {
// 	const barWidth = gameWidth / 4,  barShadow = new PIXI.Graphics(), bar = new PIXI.Graphics(), barIn = new PIXI.Graphics(),
// 		barHeight = grid - 4;

// 	barShadow.beginFill(0x140c1c);
// 	barShadow.lineStyle(0);
// 	barShadow.drawRect(gameWidth / 2 - barWidth / 2, barY + 1, barWidth, barHeight);
// 	barShadow.endFill();
// 	barShadow.zIndex = 99;

// 	bar.beginFill(0x442434);
// 	bar.lineStyle(0);
// 	bar.drawRect(gameWidth / 2 - barWidth / 2, barY, barWidth, barHeight);
// 	bar.endFill();
// 	bar.zIndex = 100;

// 	barIn.beginFill(0x140c1c);
// 	barIn.lineStyle(0);
// 	barIn.drawRect(gameWidth / 2 - barWidth / 2 + 1, barY + 1, barWidth - 2, barHeight - 2);
// 	barIn.endFill();
// 	barIn.zIndex = 101;

// 	game.stage.addChild(barShadow);
// 	game.stage.addChild(bar);
// 	game.stage.addChild(barIn);
// },

// drawGraze = () => {
// 	drawBar(grid);
// },

// drawBoss = () => {
// 	drawBar(grid * 2);
// }

// drawScore();
// drawStats();
// drawGraze();
// drawBoss();