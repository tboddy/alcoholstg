let drewGameOver = false, drewBoss = false;

const fontStyle = () => {
	return new PIXI.TextStyle({
		fill: colors.light,
		fontFamily: 'bitmap',
		fontSize: 14
	});
},

sidebarWidth = (winWidth - gameWidth) / 2,

chrome = {

	drawLabel(input, x, y, type){
		const label = new PIXI.extras.BitmapText(input, {font: '12px crass'});
		label.x = x ? gameX + gameWidth + grid : winWidth - label.width - grid;
		label.y = y;
		label.zIndex = 101;
		if(type) label[type] = true;
		game.stage.addChild(label);
	},

	drawStats(){
		const drawScore = () => {
			chrome.drawLabel('HI', true, grid );
			chrome.drawLabel(processScore(highScore), false, grid, 'isHighScore');
			chrome.drawLabel('SC', true, grid * 2);
			chrome.drawLabel(processScore(currentScore), false, grid * 2, 'isScore');
		}, drawLives = () => {
			let str = '';
			for(i = 0; i < player.data.lives - 1; i++) str += 'X'
			chrome.drawLabel('player', true, grid * 4);
			chrome.drawLabel(str, false, grid * 4, 'isLives');
		}, drawBombs = () => {
			let str = '';
			for(i = 0; i < player.data.bombs; i++) str += 'X'
			chrome.drawLabel('bomb', true, grid * 5);
			chrome.drawLabel(str, false, grid * 5);
		}, drawPunk = () => {
			chrome.drawLabel('punk', true, grid * 6);
			chrome.drawLabel('1X', false, grid * 6, 'isPunk');
		}, drawDrunk = () => {
			chrome.drawLabel('drunk', true, grid * 7);
			chrome.drawLabel('0.00', false, grid * 7, 'isDrunk');
		}
		drawScore();
		drawLives();
		// drawBombs(); no time for bombs :(
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
		if(label.text != player.data.punk + 'X'){
			label.text = player.data.punk + 'X';
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

	updateLives(label){
		let str = '';
		for(i = 0; i < player.data.lives - 1; i++) str += 'X'
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
			label.alpha = 0
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
		logo.anchor.set(0.5);
		const offset = gameWidth + gameX
		logo.x = offset + ((winWidth - offset) / 2);
		logo.y = winHeight - grid * 7;
		logo.zIndex = 101;
		game.stage.addChild(logo);
	},

	drawGameOver(){
		drewGameOver = true;
		const main = () => {
			const label = new PIXI.extras.BitmapText('game over', {font: '12px crass'});
			label.anchor.set(0.5);
			label.x = winWidth / 2;
			label.y = winHeight / 2 - grid - 8;
			label.zIndex = 105;
			game.stage.addChild(label);
		}, won = () => {
			const str = wonGame ? 'you won' : 'you died';
			const label = new PIXI.extras.BitmapText(str, {font: '12px crass'});
			label.anchor.set(0.5);
			label.x = winWidth / 2;
			label.y = winHeight / 2 - 8;
			label.zIndex = 105;
			game.stage.addChild(label);
		}, score = () => {
			const str = currentScore >= highScore ? 'new: high score' : 'please drink more'
			const label = new PIXI.extras.BitmapText(str, {font: '12px crass'});
			label.anchor.set(0.5);
			label.x = winWidth / 2;
			label.y = winHeight / 2 + 8;
			label.zIndex = 105;
			game.stage.addChild(label);
			if(currentScore >= highScore){
				savedData.highScore = currentScore;
				storage.set('savedData', savedData);
			}
		}, prompt = () => {
			const label = new PIXI.extras.BitmapText('press r to try again', {font: '12px crass'});
			label.anchor.set(0.5);
			label.x = winWidth / 2;
			label.y = winHeight / 2 + grid + 8;
			label.zIndex = 105;
			game.stage.addChild(label);
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
		chrome.drawDebug();
		chrome.drawStats();
		chrome.drawLogo();
	}

};