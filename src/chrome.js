let drewGameOver = false, drewBoss = false;

const fontStyle = () => {
	return new PIXI.TextStyle({
		fill: colors.light,
		fontFamily: 'dies',
		fontSize: 16
	});
},

chrome = {

	drawLabel(input, x, y, type, color){
		const style = fontStyle();
		if(color) style.fill = color;
		const label = new PIXI.Text(input.toUpperCase(), style);
		label.x = x ? gameX + gameWidth + grid : winWidth - label.width - grid;
		label.y = y;
		label.zIndex = 101;
		if(type) label[type] = true;
		game.stage.addChild(label);
	},

	drawStats(){
		const drawScore = () => {
			chrome.drawLabel('hiscore', true, grid * 2);
			chrome.drawLabel(processScore(highScore), false, grid * 2, 'isHighScore');
			chrome.drawLabel('score', true, grid * 3);
			chrome.drawLabel(processScore(currentScore), false, grid * 3, 'isScore');
		}, drawLives = () => {
			chrome.drawLabel('player', true, grid * 5);
			chrome.drawLabel('', false, grid * 5, 'isLives', colors.red);
		}, drawBombs = () => {
			let str = '';
			for(i = 0; i < player.data.bombs; i++) str += 'X'
			chrome.drawLabel('bomb', true, grid * 6);
			// chrome.drawLabel(str, false, grid * 6, 'isBombs', colors.red);
		}, drawPunk = () => {
			chrome.drawLabel('multi', true, grid * 8);
			chrome.drawLabel('1X', false, grid * 8, 'isPunk', colors.red);
		}, drawDrunk = () => {
			chrome.drawLabel('drunk', true, grid * 9);
			chrome.drawLabel('0.00', false, grid * 9, 'isDrunk', colors.red);
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
		borderGraphics.drawRect(0, grid, grid * 2, gameHeight);
		borderGraphics.drawRect(gameX + gameWidth, grid, winWidth - gameWidth - gameX, gameHeight);
		borderGraphics.endFill();
		game.stage.addChild(borderGraphics);
		const borderImage = PIXI.Sprite.fromImage('img/border.png');
		// borderImage.anchor.set(0.5);
		borderImage.x = grid * 2 - 3;
		borderImage.y = grid - 3;
		borderImage.zIndex = 101;
		game.stage.addChild(borderImage);
	},

	drawFps(){
		const style = fontStyle();
		style.fill = colors.purple;
		const label = new PIXI.Text('00.00 FPS', style);
		label.zIndex = 101;
		label.isFps = true;
		label.x = winWidth - label.width - grid;
		label.y = winHeight - label.height - grid;
		game.stage.addChild(label);
	},

	updateLives(label){
		let str = '';
		for(i = 0; i < player.data.lives - 1; i++) str += 'X'
		if(label.text != str){
			label.text = str;
			label.x = winWidth - label.width - grid;
		}
	},

	updateFps(label){
		if(Math.round(game.ticker.lastTime / 50) % 2 == 0){
			if(!label.didDo)label.text = game.ticker.FPS.toFixed(2) + ' FPS'
			label.didDo = true;
		} else if(label.didDo) label.didDo = false;
	},

	updateDrunk(label){
		const str = player.data.drunk >= 100 ? 'MAX' : String((player.data.drunk / 100 * 4).toFixed(2));
		if(label.text != str){
			label.text = str;
			label.x = winWidth - label.width - grid;
		}
	},

	updatePunk(label){
		player.data.punk = 1;
		if(player.data.chain >= 5 && player.data.chain < 15) player.data.punk = 2;
		else if(player.data.chain >= 15 && player.data.chain < 30) player.data.punk = 3;
		else if(player.data.chain >= 30) player.data.punk = 4;
		if(label.text != player.data.punk + 'x'){
			label.text = player.data.punk + 'x';
			label.x = winWidth - label.width - grid;
		}
		if(player.data.chainTime >= player.data.chainLimit && player.data.chain){
			player.data.chain = 0;
		}
		player.data.chainTime++;
	},

	updateHighScore(label){
		if(currentScore > highScore) highScore = currentScore;
		const str = processScore(highScore);
		if(label.text != str){
			label.text = str;
			label.x = winWidth - label.width - grid;
		}
	},

	updateScore(label){
		const str = processScore(currentScore);
		if(label.text != str){
			label.text = str;
			label.x = winWidth - label.width - grid;
		}
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
		drawDebugLabel('TIME', true, grid * 3);
		drawDebugLabel('0', false, grid * 3, 'isTime');
		drawDebugLabel('ENEMY', true, grid * 4);
		drawDebugLabel('0', false, grid * 4, 'isEnemyCount');
		drawDebugLabel('SHOT', true, grid * 5);
		drawDebugLabel('0', false, grid * 5, 'isBulletCount');
	},

	updateDebug(child){
		if(child.isEnemyCount) child.text = String(enemyCount);
		else if(child.isBulletCount) child.text = String(bulletCount);
		else if(child.isTime){
			const lastTime = String(Math.floor(game.ticker.lastTime / 1000));
			if(child.text != lastTime) child.text = lastTime;
		}
		child.x = gameX - child.width - grid;
	},

	drawLogo(){
		const logo = PIXI.Sprite.fromImage('img/logo-sidebar.png');
		const height = 98, width = 112;
		logo.anchor.set(0.5);
		logo.x = gameX + gameWidth + (winWidth - (gameX + gameWidth)) / 2
		logo.y = grid * 22;
		logo.zIndex = 101;
		logo.scale.set(1.2);
		game.stage.addChild(logo);
	},

	drawGameOver(){
		drewGameOver = true;
		const drawLabel = (input, y, color) => {
			const style = fontStyle();
			style.dropShadow = true;
			style.dropShadowAlpha = 1;
			style.dropShadowAngle = Math.PI / 2;
			style.dropShadowDistance = 1;
			style.dropShadowColor = colors.dark;
			if(color) style.fill = color;
			const label = new PIXI.Text(input.toUpperCase(), style);
			label.anchor.set(0.5);
			label.x = gameX + gameWidth / 2;
			label.y = y;
			label.zIndex = 105;
			label.scale.set(2)
			game.stage.addChild(label);
		}, main = () => {
			drawLabel('game  over', grid * 8);
		}, won = () => {
			drawLabel(wonGame ? 'you won' : 'you lose', grid * 10);
		}, score = () => {
			drawLabel(currentScore >= highScore ? 'new high score' : 'please', winHeight / 2 - grid);
			drawLabel(currentScore >= highScore ? processScore(currentScore) : 'drink more', winHeight / 2 + grid);
			if(currentScore >= highScore){
				savedData.highScore = currentScore;
				storage.set('savedData', savedData);
			}
		}, prompt = () => {
			drawLabel('press r', winHeight - grid * 10);
			drawLabel('to restart', winHeight - grid * 8);
		};
		main();
		won();
		score();
		prompt();
	},

	drawBoss(boss){
		if(!drewBoss){
			drewBoss = true;
			const bar = new PIXI.Graphics(), barIn = new PIXI.Graphics();

			bar.zIndex = 100;
			bar.lineStyle(0);
			bar.beginFill(0x140c1c);
			bar.drawRect(gameX + gameWidth / 4, gameY + grid / 2, gameWidth / 2, grid);
			bar.endFill();
			bar.isBossBarBg = true;
			game.stage.addChild(bar);

			barIn.zIndex = 101;
			barIn.lineStyle(0);
			barIn.beginFill(0xd04648);
			barIn.drawRect(0, gameY + grid / 2 + 1, gameWidth / 2 - 2, grid - 2);
			barIn.x = gameX + gameWidth / 4 + 1;
			barIn.endFill();
			barIn.isBossBar = true;
			game.stage.addChild(barIn);
		}
		bossData = boss.health;
	},

	updateBossBar(bar){
		if(!bar.maxHealth){
			bar.maxHealth = bossData;
			bar.maxWidth = bar.width;
		}
		bar.width = Math.floor(bossData / bar.maxHealth * bar.maxWidth);
	},

	init(){
		chrome.drawBorders();
		chrome.drawFps();
		chrome.drawStats();
		// chrome.drawDebug();
		// chrome.drawLogo();
	}

};