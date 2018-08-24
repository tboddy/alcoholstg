const isMuted = true, bgmVol = 0.175, bgmMuted = false;

sounds = {
	bulletOne: new Howl({src: ['sound/bullet1.wav'], volume: .05}),
	bulletTwo: new Howl({src: ['sound/bullet2.wav'], volume: .12}),
	bulletThree: new Howl({src: ['sound/bullet3.wav'], volume: .12}),
	bulletPlayer: new Howl({src: ['sound/explosion.wav'], volume: .2}),
	explosion: new Howl({src: ['sound/explosion.wav'], volume: .2}),
	graze: new Howl({src: ['sound/graze.wav'], volume: 0.1}),
	bgmOne: new Howl({src: ['sound/bgm-01.mp3'], volume: bgmVol}),
	bgmTwo: new Howl({src: ['sound/bgm-02.mp3'], loop: true, volume: bgmVol}),
	bgmThree: new Howl({src: ['sound/bgm-03.mp3'], loop: true, volume: bgmVol}),
	bgmFour: new Howl({src: ['sound/bgm-04.mp3'], loop: true, volume: bgmVol})
};

if(isMuted){
	for(soundName in sounds){
		sounds[soundName].volume(0);
	};
}

const clearBullets = () => {
	if(sounds.bulletOne.playing()) sounds.bulletOne.stop();
	if(sounds.bulletTwo.playing()) sounds.bulletTwo.stop();
	if(sounds.bulletThree.playing()) sounds.bulletThree.stop();
},

clearBgm = () => {
	if(sounds.bgmOne.playing()) sounds.bgmOne.stop();
	if(sounds.bgmTwo.playing()) sounds.bgmTwo.stop();
	if(sounds.bgmThree.playing()) sounds.bgmThree.stop();
	if(sounds.bgmFour.playing()) sounds.bgmFour.stop();
};

spawnSound = {

	bulletOne(){
		clearBullets()
		sounds.bulletOne.play();
	},

	bulletTwo(){
		clearBullets()
		sounds.bulletTwo.play();
	},

	bulletThree(){
		clearBullets();
		sounds.bulletThree.play();
	},

	explosion(){
		if(sounds.bulletPlayer.playing()) sounds.bulletPlayer.stop();
		if(sounds.explosion.playing()) sounds.explosion.stop();
		sounds.explosion.play();
	},

	graze(){
		if(sounds.graze.playing()) sounds.graze.stop();
		sounds.graze.play();
	},

	bulletPlayer(){
		if(sounds.bulletPlayer.playing()) sounds.bulletPlayer.stop();
		sounds.bulletPlayer.play();
	},

	bgmOne(){
		clearBgm();
		if(!bgmMuted) sounds.bgmOne.play();
	},

	bgmTwo(){
		clearBgm();
		if(!bgmMuted) sounds.bgmTwo.play();
	},

	bgmThree(){
		clearBgm();
		if(!bgmMuted) sounds.bgmThree.play();
	},

	bgmFour(){
		clearBgm();
		if(!bgmMuted) sounds.bgmFour.play();
	},

}
let currentScore = 0, highScore = 0, bossData = false, wonGame = false, gameOver = false, starting = true;

//gameX = (winWidth - gameWidth) / 2

const storage = require('electron-json-storage'), winWidth = 640, winHeight = 480, gameWidth = 384, gameHeight = winHeight - 32,
	grid = 16, gameX = grid * 2, gameY = grid, browserWindow = require('electron').remote,
	mainWindow = browserWindow.getCurrentWindow(), game = new PIXI.Application(winWidth, winHeight, {
		backgroundColor: 0x140c1c,
		roundPixels: true
	});
	
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const colors = {
	dark: '#140c1c',
	purple: '#442434',
	blueLight: '#6dc2ca',
	blue: '#597dce',
	blueDark: '#30346d',
	green: '#6daa2c',
	greenDark: '#346524',
	red: '#d04648',
	peach: '#d2aa99',
	light: '#deeed6',
	purple: '#442434',
	orange: '#d27d2c',
	yellow: '#dad45e',
	brown: '#854c30'
},

randomId = () => { return Math.floor(Math.random() * 50000) + 1; },

getAngle = (a, b) => {
	const angle = Math.atan2(a.y - b.y, a.x - b.x);
	return angle;
},

processScore = input => {
	let scoreString = String(input);
	for(j = scoreString.length; j < 8; j++){
		scoreString = '0' + scoreString;
	}
	return scoreString;
},

sortZIndex = () => {
	game.stage.children.sort((a, b) => {
    a.zIndex = a.zIndex || 0;
    b.zIndex = b.zIndex || 0;
    return a.zIndex - b.zIndex
	});
};
let isFullscreen = false;

const toggleFullscreen = () => {
	if(isFullscreen){
		mainWindow.setFullScreen(false);
		isFullscreen = false;
	} else {
		mainWindow.setFullScreen(true);
		isFullscreen = true;
	}
},

mapControls = () => {
	const keysDown = e => {
		switch(e.which){
			case 38: if(!starting) player.data.moving.up = true; break;
			case 40: if(!starting) player.data.moving.down = true; break;
			case 37: if(!starting) player.data.moving.left = true; break;
			case 39: if(!starting) player.data.moving.right = true; break;
			case 90:
				if(starting) gameInit();
				else player.data.shooting = true;
				break;
			case 88: if(!starting) player.data.slow = true; break;
		}
	}, keysUp = e => {
		switch(e.which){
			case 38: if(!starting) player.data.moving.up = false; break;
			case 40: if(!starting) player.data.moving.down = false; break;
			case 37: if(!starting) player.data.moving.left = false; break;
			case 39: if(!starting) player.data.moving.right = false; break;
			case 90: if(!starting) player.data.shooting = false; break;
			case 88: if(!starting) player.data.slow = false; break;
			case 70: toggleFullscreen(); break;
			case 82: if(!starting) location.reload(); break;
		}
	};
	document.addEventListener('keydown', keysDown);
	document.addEventListener('keyup', keysUp);
};
const background = {

	bgTile: false,

	draw(){

		const container = new PIXI.projection.Container2d();
		container.x = gameX;
		container.y = gameY;
		container.zIndex = 1;

		background.bgTile = new PIXI.projection.TilingSprite2d(new PIXI.Texture.fromImage('img/bg.png'));
		background.bgTile.width = gameWidth;
		background.bgTile.height = gameHeight / 2;
		background.bgTile.x = 0;
		background.bgTile.y = 0;

		const overlay = PIXI.Sprite.fromImage('img/overlay.png')
		overlay.x = gameX;
		overlay.y = gameY;
		overlay.zIndex = 2;

		game.stage.addChild(container);
		container.addChild(background.bgTile);
		game.stage.addChild(overlay);

		const pos = container.toLocal({x: gameX + gameWidth / 2, y: -grid * 10}, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
		pos.y = -pos.y;
		pos.x = -pos.x;
		container.proj.setAxisY(pos, -1);

	},

	update(){
		background.bgTile.tilePosition.y += 1;
	},

	init(){
		background.draw();
		game.ticker.add(background.update);
	}

};
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
const explosions = {

	interval: 4,
	spawnTime: 12,

	spawn(bullet, big, bigger){
		const explosion = PIXI.Sprite.fromImage('img/explosiona.png');
		explosion.textureB = PIXI.Texture.fromImage('img/explosionb.png');
		explosion.textureC = PIXI.Texture.fromImage('img/explosionc.png');
		explosion.textureD = PIXI.Texture.fromImage('img/explosiond.png');
		explosion.textureE = PIXI.Texture.fromImage('img/explosione.png');
		explosion.anchor.set(0.5);
		explosion.x = bullet.x;
		explosion.y = bullet.y;
		explosion.clock = -1;
		explosion.zIndex = 100;
		explosion.isExplosion = true;
		if(big) explosion.scale.set(2);
		else if(bigger) explosion.scale.set(3);
		game.stage.addChild(explosion);
		spawnSound.explosion();
	},

	update(explosion, i){
		explosion.clock++;
		const interval = 3;
		if(explosion.clock == interval) explosion.texture = explosion.textureB;
		else if(explosion.clock == interval * 2) explosion.texture = explosion.textureC;
		else if(explosion.clock == interval * 3) explosion.texture = explosion.textureD;
		else if(explosion.clock == interval * 4) explosion.texture = explosion.textureE;
		else if(explosion.clock == interval * 5) game.stage.removeChildAt(i);
	}

};
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
		spawnSound.bgmOne();
	}

};
const collisionWidth = 11, collisionHeight = 14,

resetSects = () => {
	const sects = [];
	for(i = 0; i < collisionHeight; i++){
		const row = [];
		for(j = 0; j < collisionWidth; j++) row.push({bullet: false, enemy: false, enemyBullet: false});
		sects.push(row)
	};
	return sects;
},

collision = {

	sects: resetSects(),
	size: grid * 2,

	draw(){
		const outlines = new PIXI.Graphics();
		outlines.zIndex = 82;
		outlines.lineStyle(0);
		outlines.beginFill(0x442434);
		for(i = 0; i < collision.sects.length; i++){
			if(i > 0) outlines.drawRect(gameX, gameY - 1 + i * collision.size, gameWidth, 1);
			for(j = 0; j < collision.sects[i].length; j++){
				if(j > 0) outlines.drawRect(gameX + j * collision.size, gameY, 1, gameHeight);
			}
		}
		outlines.endFill();
		game.stage.addChild(outlines);
	},

	placeItem(item, index){


		const doPlace = (item, type) => {
			const x = Math.floor((item.x - gameX) / collision.size),
				y = Math.floor((item.y - gameY) / collision.size);
			if(x >= 0 && y >= 0 && collision.sects[y] && (collision.sects[y][x])){
				collision.sects[y][x][type] = index;
				if(type == 'enemy'){
					const widthDiff = Math.ceil(item.width / collision.size) - 1,
						heightDiff = Math.ceil(item.height / collision.size) - 1;
					if(collision.sects[y][x - 1]) collision.sects[y][x - 1].enemy = index;
					if(collision.sects[y - 1]){
						collision.sects[y - 1][x].enemy = index;
						if(collision.sects[y - 1][x - 1]) collision.sects[y - 1][x - 1].enemy = index;
					}
					if(widthDiff){
						for(i = 0; i < widthDiff; i++){
							if(collision.sects[y][x + i + 1]){
								collision.sects[y][x + i + 1].enemy = index;
								if(collision.sects[y - 1]) collision.sects[y - 1][x + i + 1].enemy = index;
							}
						}
					}
					if(heightDiff){
						for(i = 0; i < heightDiff; i++){
							if(collision.sects[y + i + 1]){
								collision.sects[y + i + 1][x].enemy = index;
								if(collision.sects[y + i + 1][x - 1]) collision.sects[y + i + 1][x - 1].enemy = index;
								if(collision.sects[y + i + 1][x + 1]) collision.sects[y + i + 1][x + 1].enemy = index;
							}
						}
					}
				} else if(type == 'bullet' || type == 'enemyBullet' || type == 'player' || type == 'chip'){
					if(collision.sects[y][x - 1]) collision.sects[y][x - 1][type] = index;
					if(collision.sects[y][x + 1]) collision.sects[y][x + 1][type] = index;
					if(collision.sects[y - 1]){
						collision.sects[y - 1][x][type] = index;
						if(collision.sects[y - 1][x - 1]) collision.sects[y - 1][x - 1][type] = index;
						if(collision.sects[y - 1][x + 1]) collision.sects[y - 1][x + 1][type] = index;
					}
					if(collision.sects[y + 1]){
						collision.sects[y + 1][x][type] = index;
						if(collision.sects[y + 1][x - 1]) collision.sects[y + 1][x - 1][type] = index;
						if(collision.sects[y + 1][x + 1]) collision.sects[y + 1][x + 1][type] = index;
					}
				}
			}
		};

		if(item.isBullet) doPlace(item, 'bullet');
		else if(item.isEnemy) doPlace(item, 'enemy');
		else if(item.isEnemyBullet) doPlace(item, 'enemyBullet');
		else if(item.isPlayer) doPlace(item, 'player');
		else if(item.isChip) doPlace(item, 'chip');
	},

	check(){
		for(i = 0; i < collision.sects.length; i++){
			for(j = 0; j < collision.sects[i].length; j++){
				if(collision.sects[i][j].bullet && collision.sects[i][j].enemy){
					const enemy = game.stage.getChildAt(collision.sects[i][j].enemy), bullet = game.stage.getChildAt(collision.sects[i][j].bullet);
					if(
						bullet.x + bullet.width / 2 >= enemy.x - enemy.width / 2 && bullet.x - bullet.height / 2 <= enemy.x + enemy.width - enemy.width / 2 &&
			      bullet.y + bullet.height / 2 >= enemy.y - enemy.height / 2 && bullet.y - bullet.height / 2 <= enemy.y + enemy.height - enemy.height / 2 &&
						bullet.y - bullet.height / 2 > gameY){
						explosions.spawn(bullet);
						bullet.y = -gameHeight;
						collision.sects[i][j].bullet = false;
						if(enemy.health) enemy.health--;
						else {
							if(enemy.isBoss){
								for(r = 0; r < 20; r++) chips.spawn(enemy, true);
							} else chips.spawn(enemy);
							enemy.y = gameHeight * 2;
							collision.sects[i][j].enemy = false;
							player.data.chain++;
							player.data.chainTime = 0;
							if(enemy.score) currentScore += enemy.score * player.data.punk;
							if(bossData){
								PIXI.setTimeout(1, () => {
									bossData = false;
								});
							}
						}
					}
				}
				if(collision.sects[i][j].player){
					if(collision.sects[i][j].enemyBullet && !player.data.invulnerableClock){
						const bullet = game.stage.getChildAt(collision.sects[i][j].enemyBullet);
						if(bullet.x + bullet.width / 2 >= player.hitbox.x - player.hitbox.width / 2 &&
							bullet.x - bullet.height / 2 <= player.hitbox.x + player.hitbox.width / 2 &&
				      bullet.y + bullet.height / 2 >= player.hitbox.y - player.hitbox.height / 2 &&
				      bullet.y - bullet.height / 2 <= player.hitbox.y + player.hitbox.height / 2){
							if(!gameOver){
								explosions.spawn(bullet, false, true);
								bullet.y = -gameHeight;
								if(player.data.lives - 1){
									player.data.invulnerableClock = 60 * 3;
									player.data.lives--;
								} else if(!gameOver) gameOver = true;
							}
						}
					}
					if(collision.sects[i][j].enemy && !player.data.invulnerableClock){
						const enemy = game.stage.getChildAt(collision.sects[i][j].enemy);
						if(enemy.x + enemy.width / 2 >= player.hitbox.x - player.hitbox.width / 2 &&
							enemy.x - enemy.height / 2 <= player.hitbox.x + player.hitbox.width / 2 &&
				      enemy.y + enemy.height / 2 >= player.hitbox.y - player.hitbox.height / 2 &&
				      enemy.y - enemy.height / 2 <= player.hitbox.y + player.hitbox.height / 2){
							if(!gameOver){
								explosions.spawn(enemy, false, true);
								enemy.y = gameHeight * 2;
								collision.sects[i][j].enemy = false;
								if(player.data.lives - 1){
									player.data.invulnerableClock = 60 * 3;
									player.data.lives--;
								} else if(!gameOver) gameOver = true;
							}
						}
					}
					if(collision.sects[i][j].chip){
						const chip = game.stage.getChildAt(collision.sects[i][j].chip);
						chip.flipped = true;
						if(chip.x + chip.width / 2 >= player.data.x - player.data.width / 2 &&
							chip.x - chip.height / 2 <= player.data.x + player.data.width / 2 &&
				      chip.y + chip.height / 2 >= player.data.y - player.data.height / 2 &&
				      chip.y - chip.height / 2 <= player.data.y + player.data.height / 2){
							currentScore += chip.score;
							chips.spawnScore(chip);
							chip.y = gameHeight * 2;
							collision.sects[i][j].score = false;
							player.data.drunk += player.data.drunkDiff;
						}
					}
				}
			}
		}
	},

	drawDebug(){
		const highlights = new PIXI.Graphics();
		highlights.zIndex = 81;
		highlights.isCollisionHighlight = true;
		highlights.lineStyle(0);
		highlights.alpha = 0.25;
		for(i = 0; i < collision.sects.length; i++){
			for(j = 0; j < collision.sects[i].length; j++){
				if(collision.sects[i][j].bullet){
					highlights.beginFill(0xd04648);
					highlights.drawRect(gameX + j * collision.size, gameY + i * collision.size, collision.size, collision.size);
					highlights.endFill();
				} else if(collision.sects[i][j].enemyBullet){
					highlights.beginFill(0x597dce);
					highlights.drawRect(gameX + j * collision.size, gameY + i * collision.size, collision.size, collision.size);
					highlights.endFill();
				} else if(collision.sects[i][j].enemy){
					highlights.beginFill(0x6daa2c);
					highlights.drawRect(gameX + j * collision.size, gameY + i * collision.size, collision.size, collision.size);
					highlights.endFill();
				}
			}
		}
		highlights.endFill();
		game.stage.addChild(highlights);
	},

	update(){
		collision.check();
		// collision.drawDebug();
		collision.sects = resetSects();
	},

	init(){
		// collision.draw();
	}

}
const chips = {

	spawn(enemy, isBoss){
		const chip = PIXI.Sprite.fromImage('img/medal.png');
		chip.anchor.set(0.5);
		chip.zIndex = 26;
		chip.x = enemy.x;
		chip.y = enemy.y;
		chip.speedInit = 3.5;
		chip.speed = chip.speedInit;
		chip.speedMod = 0.075;
		chip.flipSpeed = chip.speedInit;
		chip.flipMod = 0.25;
		chip.isChip = true;
		chip.scoreBase = 5;
		chip.score = chip.scoreBase;
		if(isBoss){
			chip.x = chip.x - grid + Math.floor(Math.random() * (chip.x + grid));
			chip.y = chip.y - grid + Math.floor(Math.random() * (chip.y + grid));
		}
		game.stage.addChild(chip);
	},

	spawnScore(chip){
		const chipScore = new PIXI.Text(String(chip.score), new PIXI.TextStyle({
			fill: colors.light,
			fontFamily: 'dies',
			fontSize: 16,
			dropShadow: true,
			dropShadowAlpha: 1,
			dropShadowAngle: Math.PI / 2,
			dropShadowDistance: 1,
			dropShadowColor: colors.dark
		}));
		chipScore.anchor.set(0.5);
		chipScore.x = chip.x;
		chipScore.y = chip.y;
		chipScore.zIndex = 999;
		chipScore.isChipScore = true;
		chipScore.clock = 0;
		chipScore.limit = 60;
		game.stage.addChild(chipScore);
	},

	update(chip, i){
		chip.score = Math.floor((winHeight - chip.y) * chip.scoreBase)
		if(chip.flipped && chip.y <= gameY + gameHeight + chip.height / 2){
			const angle = getAngle(chip, player.data);
			chip.x += -Math.cos(angle) * chip.flipSpeed;
			chip.y += -Math.sin(angle) * chip.flipSpeed;
			chip.flipSpeed += chip.flipMod;
		} else {
			chip.y -= chip.speed;
			if(chip.speed > chip.speedInit * -1) chip.speed -= chip.speedMod;
			if(chip.y > gameY + gameHeight + chip.height / 2) game.stage.removeChildAt(i);
		}
	},

	updateScore(chipScore, i){
		chipScore.clock++;
		chipScore.y -= 0.75;
		if(chipScore.clock >= chipScore.limit) game.stage.removeChildAt(i);
	}

};
const enemies = {

	currentWave: false,
	nextWave: 'one',

	waves: {},
	update: {},
	bulletSpawn: {},
	bulletUpdate: {},

	mainUpdate(enemy, i){
		if(!enemy.zIndex) enemy.zIndex = 30;
		if(enemy.y >= gameY - enemy.height / 2 &&
			enemy.x >= gameX - enemy.width / 2 &&
			enemy.x <= gameX + gameWidth + enemy.width / 2){
			enemy.seen = true;
		}
		if(enemy.seen &&
			(enemy.y - enemy.height / 2 > gameY + gameHeight ||
			enemy.y < -enemy.height / 2 + gameY ||
			enemy.x < gameX - enemy.height / 2 ||
			enemy.x > gameX + gameWidth + enemy.height / 2)) game.stage.removeChildAt(i)
	},

	mainBulletUpdate(bullet, i){
		if(!bullet.zIndex) bullet.zIndex = 40;
		if(bullet.y >= gameY - bullet.height / 2 &&
			bullet.x >= gameX - bullet.width / 2 &&
			bullet.x <= gameX + gameWidth + bullet.width / 2){
			bullet.seen = true;
		}
		if(bullet.seen){
			if(bullet.y > gameY + gameHeight + bullet.height / 2 ||
				bullet.y < gameY - bullet.height / 2 || bullet.x < 0 || bullet.x > winWidth) game.stage.removeChildAt(i);
		}
	},

	init(){
		if(enemies.nextWave){
			enemies.currentWave = enemies.nextWave;
			enemies.waves[enemies.currentWave]();
		} else {
			wonGame = true;
			gameOver = true;
		}
	}

};
enemies.waves.bossOne = () => {
	const enemy = PIXI.Sprite.fromImage('img/boss-one.png'), size = 76;
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'bossOne';
	enemy.x = gameX + gameWidth / 2;
	enemy.y = gameY - size / 2;
	enemy.score = 100000;
	enemy.isBoss = true;
	enemy.health = 300;
	bossData = enemy.health;
	enemy.zIndex = 35;
	enemy.zIndex = 51;
	enemy.speed = 2.65;
	enemy.speedDiff = 0.03;
	enemy.clock = 0;
	enemy.intervalA = 60 * 4;
	enemy.intervalB = 60 * 5;
	enemy.intervalC = 60 * 4;
	game.stage.addChild(enemy);
	enemies.nextWave = 'seven';
	spawnSound.bgmThree()
};

enemies.update.bossOne = enemy => {
	if(enemy.inPlace){
		if(enemy.speed != 0) enemy.speed = 0;
		if(enemy.clock < enemy.intervalA) bossOneCardOne(enemy);
		else if(enemy.clock >= enemy.intervalA && enemy.clock < enemy.intervalA + enemy.intervalB) bossOneCardTwo(enemy);
		else if(enemy.clock >= enemy.intervalA + enemy.intervalB && enemy.clock < enemy.intervalA + enemy.intervalB + enemy.intervalC) bossOneCardThree(enemy);
		else enemy.clock = 0;
		enemy.clock++;
	} else {
		enemy.y += enemy.speed;
		enemy.speed -= enemy.speedDiff;
		if(enemy.speed <= 0) enemy.inPlace = true;
	}
	// enemy.rotation = getAngle(enemy, player.data) + (Math.PI / 2)
};

const bossOneCardOne = enemy => {
	const dirClock = enemy.intervalA / 3;
	if(enemy.clock % dirClock == 0){
		let oAngle = 0;
		const count = 10;
		for(i = 0; i < count; i++){
			const spawnSub = (angle, offset) => {
				if(offset){
					if(enemy.clock >= dirClock && enemy.clock < dirClock * 2) angle -= offset / count;
					else angle += offset / count;
				}
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
				bullet.anchor.set(0.5);
				bullet.isEnemyBullet = true;
				bullet.initX = enemy.x;
				bullet.initY = enemy.y;
				bullet.x = bullet.initX;
				bullet.y = bullet.initY;
				bullet.angle = angle;
				bullet.alpha = 0;
				if(offset){
					bullet.x += Math.cos(angle) * (offset * 20);
					bullet.y += Math.sin(angle) * (offset * 20);
				}
				const speed = 3;
				bullet.velocity = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
				bullet.type = 'bossOneCardOne';
				game.stage.addChild(bullet);
			}
			spawnSub(oAngle)
			spawnSub(oAngle, 1)
			spawnSub(oAngle, 2)
			spawnSub(oAngle, 3)
			spawnSub(oAngle, 4)
			spawnSound.bulletOne();
			oAngle += Math.PI / (count / 2);
		}
	}
};

enemies.bulletUpdate.bossOneCardOne = bullet => {
	bullet.y += bullet.velocity.y;
	bullet.x += bullet.velocity.x;
	if(bullet.alpha == 0){
		if((bullet.velocity.x > 0 && bullet.x >= bullet.initX) || (bullet.velocity.x < 0 && bullet.x <= bullet.initX)) bullet.alpha = 1;
		if((bullet.velocity.y > 0 && bullet.y >= bullet.initY) || (bullet.velocity.y < 0 && bullet.xy <= bullet.initY)) bullet.alpha = 1;
	}
};

const bossOneCardTwo = enemy => {
	const spawnBullets = () => {
		const count = 13;
		let angle = 0;
		for(i = 0; i < count; i++){
			const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
			bullet.anchor.set(0.5);
			bullet.isEnemyBullet = true;
			bullet.x = enemy.x;
			bullet.y = enemy.y;
			const speed = 2;
			bullet.velocity = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
			bullet.type = 'bossOneCardTwo';
			game.stage.addChild(bullet);
			angle += Math.PI / (count / 2)
		}
		spawnSound.bulletThree();
	};
	const interval = 15, ySpeed = 3, xSpeed = 1.5, sec = 60, rotationTime = 0.005;
	if(enemy.clock % interval == 0) spawnBullets();
	if(enemy.clock < enemy.intervalA + sec){
		enemy.y += ySpeed;
		enemy.x -= xSpeed;
		enemy.rotation -= rotationTime;
	} else if(enemy.clock >= enemy.intervalA + (sec * 2) &&
		enemy.clock < enemy.intervalA + (sec * 3)){
		enemy.y -= ySpeed;
		enemy.x += xSpeed * 2;
		enemy.rotation += rotationTime * 2;
	} else if(enemy.clock >= enemy.intervalA + (sec * 4) &&
		enemy.clock < enemy.intervalA + (sec * 5)){
		enemy.x -= xSpeed;
		enemy.rotation -= rotationTime;
	}
};

enemies.bulletUpdate.bossOneCardTwo = bullet => {
	bullet.y += bullet.velocity.y;
	bullet.x += bullet.velocity.x;
};

const bossOneCardThree = enemy => {
	const interval = 2;
	if(enemy.clock % interval == 0){
		const speed = 2;
		let angle = getAngle(enemy, player.data);
		const spawnOBullet = () => {
			const img = enemy.clock % (interval * 2) == interval ? 'img/bullet-pink.png' : 'img/bullet-blue.png'
			const bullet = PIXI.Sprite.fromImage(img);
			bullet.anchor.set(0.5);
			bullet.x = enemy.x;
			bullet.y = enemy.y;
			bullet.isEnemyBullet = true;
			let iAngle = angle - Math.PI / 3 + Math.random() * (Math.PI / 3 * 2);
			bullet.velocity = {x: -Math.cos(iAngle) * speed, y: -Math.sin(iAngle) * speed};
			bullet.zIndex = 31;
			bullet.type = 'eight';
			game.stage.addChild(bullet);
		};
		spawnOBullet();
		spawnSound.bulletTwo();
	}

}
enemies.waves.bossTwo = () => {
	const enemy = PIXI.Sprite.fromImage('img/boss-two.png'), size = 76;
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'bossTwo';
	enemy.x = gameX + gameWidth / 2;
	enemy.y = gameY - size / 2;
	enemy.score = 100000;
	enemy.isBoss = true;
	enemy.health = 400;
	bossData = enemy.health;
	enemy.zIndex = 30.05;
	enemy.speed = 2.65;
	enemy.speedDiff = 0.03;
	enemy.clock = 0;
	enemy.intervalA = 60 * 7;
	enemy.intervalB = 60 * 6;
	enemy.intervalC = 60 * 6;
	game.stage.addChild(enemy);
	enemies.nextWave = false;
	spawnSound.bgmFour()
};

enemies.update.bossTwo = enemy => {
	if(enemy.inPlace){
		if(enemy.speed != 0) enemy.speed = 0;
		if(enemy.clock < enemy.intervalA) bossTwoCardOne(enemy);
		else if(enemy.clock >= enemy.intervalA && enemy.clock < enemy.intervalA + enemy.intervalB) bossTwoCardTwo(enemy);
		else if(enemy.clock >= enemy.intervalA + enemy.intervalB && enemy.clock < enemy.intervalA + enemy.intervalB + enemy.intervalC) bossTwoCardThree(enemy);
		else if(enemy.clock >= enemy.intervalA + enemy.intervalB + enemy.intervalC && enemy.clock < enemy.intervalA + enemy.intervalB + enemy.intervalC + enemy.intervalB) bossTwoCardTwo(enemy, true);
		else enemy.clock = 0;
		enemy.clock++;
	} else {
		enemy.y += enemy.speed;
		enemy.speed -= enemy.speedDiff;
		if(enemy.speed <= 0) enemy.inPlace = true;
	}
	// enemy.rotation = 0
};

const bossTwoCardOne = enemy => {
	const gravitySpray = () => {
		const interval = 30;
		if(enemy.clock % interval == 0){
			const count = 10;
			let angle = 0;
			for(i = 0; i < count; i++){
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
				bullet.anchor.set(0.5);
				bullet.isEnemyBullet = true;
				bullet.x = enemy.x;
				bullet.y = enemy.y;
				bullet.speed = {x: 2, y: 2.25};
				bullet.speedDiff = {x: 0.02, y: 0.035};
				let num = parseFloat((Math.random() * (count - 1)).toFixed(1))
				if(num < 1) num += num * 2;
				if(num > count - 2) num += num * 2;
				bullet.angle = Math.PI / (count - 1) * num;
				bullet.zIndex = 30;
				bullet.type = 'bossTwoCardOne';
				game.stage.addChild(bullet);
			}
			spawnSound.bulletTwo()
		}
	}, razor = () => {
		const dirClock = enemy.intervalA / 10, count = 5;
		if(enemy.clock % dirClock == 0){
			let oAngle = getAngle(enemy, player.data) - Math.PI / (count * 2);
			for(i = 0; i < count; i++){
				const spawnSub = (angle, index) => {
					const bullet = PIXI.Sprite.fromImage('img/bullet-blue.png');
					bullet.anchor.set(0.5);
					bullet.isEnemyBullet = true;
					bullet.x = enemy.x;
					bullet.y = enemy.y;
					bullet.zIndex = 29;
					const speed = 2;
					bullet.velocity = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
					if(enemy.clock >= dirClock && enemy.clock < dirClock * 2 ||
						enemy.clock >= dirClock * 3 && enemy.clock < dirClock * 4 ||
						enemy.clock >= dirClock * 5 && enemy.clock < dirClock * 6 ||
						enemy.clock >= dirClock * 7 && enemy.clock < dirClock * 8 ||
						enemy.clock >= dirClock * 9 && enemy.clock < dirClock * 10){
						bullet.velocity.x = -Math.cos(angle) * -speed
					}
					bullet.type = 'bossOneCardOne';
					game.stage.addChild(bullet);
				}
				let sCount = 0, tempAngle = oAngle;
				for(j = 0; j < count; j++) PIXI.setTimeout(.05 * j, () => {
					spawnSub(tempAngle + sCount * .15, sCount);
					sCount++;
				});
				oAngle += Math.PI / (count / 4);
			}
			spawnSound.bulletTwo()
		}
	};
	gravitySpray();
	razor();
};

enemies.bulletUpdate.bossTwoCardOne = bullet => {
	const velocity = {x: -Math.cos(bullet.angle) * bullet.speed.x, y: -Math.sin(bullet.angle) * bullet.speed.y};
	bullet.y += velocity.y;
	bullet.x += velocity.x;
	bullet.speed.y -= bullet.speedDiff.y;
	if(bullet.speed.y > 0) bullet.speed.x -= bullet.speedDiff.x;
	bullet.zIndex += 0.001;
};

const bossTwoCardTwo = (enemy, isAlt) => {
	const angleObj = {x: isAlt ? gameX + gameWidth : gameX, y: gameY + gameHeight}
	const angle = getAngle(enemy, angleObj), sec = 60, lasers = () => {
		const fire = (x, y, angleOffset) => {
			const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
			bullet.altTex = PIXI.Texture.fromImage('img/bullet-pink.png');
			bullet.anchor.set(0.5);
			bullet.isEnemyBullet = true;
			bullet.x = x;
			bullet.y = y;
			bullet.zIndex = 30;
			bullet.clock = 0;
			const speed = 3.5;
			let tempAngle = angle;
			if(angleOffset){
				tempAngle += (Math.PI / 8) * angleOffset
			}
			bullet.velocity = {x: -Math.cos(tempAngle) * speed, y: -Math.sin(tempAngle) * speed};
			bullet.type = 'bossTwoCardTwo';
			game.stage.addChild(bullet);
		};
		if(enemy.clock % 3 == 0){
			const offset = grid * 1.5;
			const lOffsetA = isAlt ? enemy.x + offset : enemy.x - offset,
				lOffsetB = isAlt ? enemy.x - offset : enemy.x + offset;
			fire(lOffsetA, enemy.y - offset, -2);
			fire(lOffsetA, enemy.y - offset, -1);
			fire(lOffsetA, enemy.y - offset, 0);
			fire(lOffsetA, enemy.y - offset, 1);
			fire(lOffsetA, enemy.y - offset, 2);
			fire(lOffsetB, enemy.y + offset, 2);
			fire(lOffsetB, enemy.y + offset, 1);
			fire(lOffsetB, enemy.y + offset, 0);
			fire(lOffsetB, enemy.y + offset, -1);
			fire(lOffsetB, enemy.y + offset, -2);
			spawnSound.bulletThree()
		}
	};
	let limitA = enemy.intervalA + sec, limitB = enemy.intervalA + enemy.intervalB - sec;
	if(isAlt){
		limitA = enemy.intervalA + enemy.intervalB + enemy.intervalC + sec
		limitB = enemy.intervalA + enemy.intervalB + enemy.intervalC + enemy.intervalB - sec;
	}
	if(enemy.clock < limitA) enemy.x += isAlt ? -1.5 : 1.5;
	else if(enemy.clock >= limitA && enemy.clock < limitB) lasers();
	else if(enemy.clock >= limitB) enemy.x -= isAlt ? -1.5 : 1.5;
};

enemies.bulletUpdate.bossTwoCardTwo = bullet => {
	bullet.x += bullet.velocity.x;
	bullet.y += bullet.velocity.y;
	if(bullet.clock >= 20 && !bullet.flipped){
		bullet.flipped = true;
		bullet.texture = bullet.altTex
	}
	bullet.clock++;
};

const bossTwoCardThree = enemy => {
	const offset = grid * 3, interval = 60, circle = (x, altTex) => {
		const count = 90, playerAngle = getAngle({x: x, y: enemy.y}, player.data), aOffset = .1;
		let angle = playerAngle;
		for(i = 0; i < count; i++){
			const bullet = altTex ? PIXI.Sprite.fromImage('img/bullet-pink-big.png') : PIXI.Sprite.fromImage('img/bullet-blue-big.png');
			bullet.anchor.set(0.5);
			bullet.isEnemyBullet = true;
			bullet.x = x;
			bullet.y = enemy.y;
			bullet.speed = 3;
			bullet.angle = angle
			bullet.zIndex = 30;
			bullet.type = 'bossTwoCardThree';
			bullet.speedDiff = 0.01;
			if(angle >= playerAngle + aOffset) game.stage.addChild(bullet);
			angle += Math.PI / (count / 2);
		}
	};
	if(enemy.clock % interval == 0){
		circle(enemy.x - offset);
		spawnSound.bulletOne()
	} else if(enemy.clock % interval == interval / 2){
		circle(enemy.x + offset, true);
		spawnSound.bulletOne()
	}
};

enemies.bulletUpdate.bossTwoCardThree = bullet => {
	const velocity = {x: -Math.cos(bullet.angle) * bullet.speed, y: -Math.sin(bullet.angle) * bullet.speed};
	bullet.x += velocity.x;
	bullet.y += velocity.y;
	if(bullet.y <= gameY + gameHeight + bullet.height / 2 &&
		bullet.x >= gameX - bullet.width / 2 && bullet.x <= gameX + gameWidth + bullet.width / 2) bullet.speed -= bullet.speedDiff;
};
enemies.waves.seven = () => {
	const size = 36, yOffset = gameHeight * .75, spawnEnemy = (x, y, opposite) => {
		enemy = PIXI.Sprite.fromImage('img/enemy-four.png');
		enemy.anchor.set(0.5);
		enemy.x = gameX + x;
		enemy.y = (gameY - size / 2) - y;
		enemy.isEnemy = true;
		enemy.type = 'seven';
		enemy.speed = 3.5;
		enemy.alcohol = true
		enemy.health = 22;
		enemy.score = 8210;
		enemy.speedDiff = 0.04;
		enemy.opposite = opposite;
		game.stage.addChild(enemy);
	};
	spawnEnemy(gameWidth / 5, 0, false);
	spawnEnemy(gameWidth / 5 * 2, yOffset, true);
	spawnEnemy(gameWidth / 5 * 3, yOffset * 2, false);
	spawnEnemy(gameWidth / 5 * 4, yOffset * 3, true);
	enemies.nextWave = 'eight';
	spawnSound.bgmTwo()
};

enemies.update.seven = enemy => {
	if(enemy.y >= gameY - enemy.height / 2) enemy.speed -= enemy.speedDiff;
	if(enemy.speed <= 0 && !enemy.fired) waveSevenBullet(enemy);
	enemy.y += enemy.speed >= 0 ? enemy.speed : enemy.speed / 2;
};

const waveSevenBullet = enemy => {
	enemy.fired = true;
	const bulletX = enemy.x, bulletY = enemy.y, count = 20, timeout = 1 / 3,
	spawnBullets = () => {
		if(enemy.y < winHeight){
			let angle = 0;
			for(i = 0; i < count; i++){
				const img = enemy.opposite ? 'img/bullet-blue-big.png' : 'img/bullet-pink-big.png';
				const bullet = PIXI.Sprite.fromImage(img);
				bullet.anchor.set(0.5);
				bullet.x = bulletX;
				bullet.y = bulletY;
				bullet.isEnemyBullet = true;
				bullet.speed = 3.25;
				bullet.zIndex = 30;
				bullet.type = 'seven';
				bullet.angleDiff = 0.015;
				bullet.angle = angle;
				bullet.opposite = enemy.opposite;
				game.stage.addChild(bullet);
				angle += Math.PI / count * 2;
			}
		}
		spawnSound.bulletOne();
	}
	spawnBullets();
	PIXI.setTimeout(timeout, spawnBullets);
	PIXI.setTimeout(timeout * 2, spawnBullets);
};

enemies.bulletUpdate.seven = bullet => {
	bullet.velocity = {x: -Math.cos(bullet.angle), y: -Math.sin(bullet.angle)};
	bullet.x += bullet.velocity.x * bullet.speed;
	bullet.y += bullet.velocity.y * bullet.speed;
	bullet.angle += bullet.opposite ? -bullet.angleDiff : bullet.angleDiff;
};
const waveSixLine = (initialX, opposite, yOffset) => {
	const size = 36;
	let count = -.5;
	const spawnEnemy = () => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png');
		enemy.anchor.set(0.5);
		enemy.x = initialX;
		enemy.y = (gameY - size / 2) - i * (size + 4);
		if(opposite) enemy.y -= gameHeight;
		if(yOffset) enemy.y -= yOffset
		enemy.isEnemy = true;
		enemy.type = 'six';
		enemy.speed = {x: 1.25, y: 2.5};
		enemy.opposite = opposite;
		enemy.health = 0;
		enemy.count = count;
		enemy.alcohol = true;
		enemy.score = 1000;
		enemy.speedDiff = 0.01;
		count -= .25;
		game.stage.addChild(enemy);
	}
	for(i = 0; i < 5; i++) spawnEnemy();
},
waveSixDrop = x => {
	const size = 36, enemy = PIXI.Sprite.fromImage('img/enemy-two.png');
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'sixDrop';
	enemy.y = gameY - size / 2;
	enemy.x = x;
	enemy.speed = 4.5;
	enemy.speedDiff = 0.05;
	enemy.health = 20;
	enemy.score = 6250;
	enemy.zIndex = 31;
	game.stage.addChild(enemy);
},
waveSixDropBullet = (enemy, opposite) => {
	const bulletX = enemy.x, bulletY = enemy.y;
	const count = 4, spawnBullets = angle => {
		if(enemy.y < winHeight){
			for(i = 0; i < count; i++){
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink.png');
				bullet.anchor.set(0.5);
				bullet.x = bulletX;
				bullet.y = bulletY;
				bullet.isEnemyBullet = true;
				bullet.speed = 4;
				bullet.zIndex = 30;
				bullet.type = 'fiveDrop';
				bullet.velocity = {x: -Math.cos(angle), y: -Math.sin(angle)};
				game.stage.addChild(bullet);
				angle += Math.PI / count * 2;
			}
			spawnSound.bulletThree();
		}
	};
	const initAngle = opposite ? Math.PI / count : 0;
	spawnBullets(initAngle);
}

enemies.waves.six = () => {
	const lineOffset = -grid , dropOffset = grid * 3, lineDiff = grid * 3;

	waveSixLine(gameX + gameWidth - lineOffset);
	waveSixLine(gameX + gameWidth - lineOffset - lineDiff, false, 12);

	waveSixLine(gameX + lineOffset, true);
	waveSixLine(gameX + lineOffset + lineDiff, true);

	waveSixDrop(gameX + dropOffset);
	waveSixDrop(gameX + gameWidth - dropOffset);

	enemies.nextWave = 'bossOne';
};

enemies.update.six = enemy => {
	if(enemy.y >= gameY - enemy.height / 2){
		enemy.x += enemy.opposite ? -Math.sin(enemy.count) : Math.sin(enemy.count);
		enemy.x += enemy.opposite ? enemy.speed.x : -enemy.speed.x;
		enemy.count -= 90 / 180 * Math.PI / (grid * 4.5);
		enemy.rotation = (enemy.opposite ? Math.cos(enemy.count - 1) : -Math.cos(enemy.count - 1)) / 4;
	}
	enemy.y += enemy.speed.y;
};

enemies.update.sixDrop = enemy => {
	enemy.y += enemy.speed;
	if(enemy.flipped){
		if(enemy.done) enemy.speed -= enemy.speedDiff;
		else {
			if(enemy.speed != 0) enemy.speed = 0;
			if(enemy.doneClock){
				const limit = 60 * 4, mod = 2;
				if(enemy.doneClock < limit / 2 && enemy.doneClock % mod == 0) waveSixDropBullet(enemy);
				else if(enemy.doneClock >= limit / 2 && enemy.doneClock < limit && enemy.doneClock % mod == 0) waveSixDropBullet(enemy, true);
				if(enemy.doneClock >= limit) enemy.done = true;
				enemy.doneClock++;
			} else enemy.doneClock = 1;
		}
	} else {
		if(enemy.speed <= 0) enemy.flipped = true;
		enemy.speed -= enemy.speedDiff;
	}
}
const levelOneFirstWave = (initialX, opposite) => {
	let count = 0;
	const spawnEnemy = i => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png'), size = 36;
		enemy.anchor.set(0.5);
		enemy.x = initialX;
		enemy.initialX = initialX;
		enemy.y = (gameY - size / 2) - i * (size + 4);
		enemy.isEnemy = true;
		enemy.type = 'one';
		enemy.speed = 2.75;
		enemy.opposite = opposite;
		enemy.count = count;
		enemy.health = 1;
		enemy.alcohol = true;
		enemy.score = 1000;
		game.stage.addChild(enemy);
		count -= .5;
	}
	for(i = 0; i < 8; i++) spawnEnemy(i);
};

enemies.waves.one = () => {
	levelOneFirstWave(gameX + grid * 8);
	enemies.nextWave = 'two';
};

enemies.waves.two = () => {
	levelOneFirstWave(gameX + gameWidth - grid * 8, true);
	enemies.nextWave = 'three';
};

enemies.update.one = enemy => {
	const iCount = enemy.opposite ? Math.sin(enemy.count) : -Math.sin(enemy.count); 
	enemy.x = (enemy.initialX + iCount * (grid * 3));
	const count = 90 / 180 * Math.PI / (grid * 2);
	enemy.count += count;
	enemy.y += enemy.speed;
	enemy.rotation = (enemy.opposite ? -Math.cos(enemy.count) : Math.cos(enemy.count)) / 2
};
const waveTen = opposite => {
	const size = 36, spawnEnemy = i => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-two.png');
		enemy.anchor.set(0.5);
		enemy.isEnemy = true;
		enemy.type = 'ten';
		enemy.speed = 3.5;
		enemy.x = gameX + gameWidth / 6 * (i + 1) + (8 * i) - grid;
		if(opposite) enemy.x = gameX + gameWidth - (gameWidth / 6 * (i + 1) + (8 * i) - grid)
		enemy.y = gameY - size / 2 - size * i;
		enemy.score = 12000;
		enemy.speedDiff = 0.05;
		enemy.health = 20;
		enemy.zIndex = 31;
		enemy.dropClock = 0;
		enemy.dropLimit = 60 * 3;
		game.stage.addChild(enemy);
	};
	for(i = 0; i < 4; i++) spawnEnemy(i);
},

waveTenUpdate = enemy => {
	enemy.y += enemy.speed;
	if(enemy.flipped){
		if(enemy.dropClock >= enemy.dropLimit) enemy.speed -= enemy.speedDiff
		else {
			if(enemy.speed != 0) enemy.speed = 0;
			if(enemy.dropClock % 2 == 0) waveTenBullet(enemy);
		}
		enemy.dropClock++;
	} else {
		if(enemy.speed <= 0) enemy.flipped = true;
		else if(enemy.y >= gameY - enemy.height / 2) enemy.speed -= enemy.speedDiff;
	}
};

enemies.waves.ten = () => {
	waveTen();
	enemies.nextWave = 'eleven';
};

enemies.waves.eleven = () => {
	waveTen(true);
	enemies.nextWave = 'bossTwo';
};

enemies.update.ten = enemy => {
	waveTenUpdate(enemy);
};

const waveTenBullet = enemy => {
	const limit = enemy.dropLimit / 3
	const img = enemy.dropClock < limit ? 'img/bullet-blue.png' : 'img/bullet-blue-big.png';
	const spawnBullet = offset => {
		const bullet = PIXI.Sprite.fromImage(img);
		bullet.anchor.set(0.5);
		bullet.x = enemy.x;
		if(offset) bullet.x += offset;
		bullet.y = enemy.y;
		bullet.isEnemyBullet = true;
		bullet.speed = 5;
		bullet.zIndex = 30;
		bullet.type = 'ten';
		game.stage.addChild(bullet);
	};
	if(enemy.dropClock < limit){
		spawnBullet();
		spawnSound.bulletThree();
	} else {
		spawnBullet(4);
		spawnBullet(-4);
		spawnSound.bulletTwo();
	}
};

enemies.bulletUpdate.ten = bullet => {
	bullet.y += bullet.speed;
}
const eightLine = (opposite, yOffset) => {
	const size = 36;
	let count = -.5;
	const spawnEnemy = index => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png');
		enemy.anchor.set(0.5);
		enemy.x = opposite ? gameX + gameWidth + size / 2 : gameX - size / 2;
		const offset = (size + 4) * index;
		enemy.x += opposite ? offset : -offset;
		enemy.y = gameY + gameHeight / 2;
		if(yOffset){
			enemy.yOffset = (size + grid) * yOffset;
			enemy.y -= enemy.yOffset;
		}
		enemy.isEnemy = true;
		enemy.type = 'eight';
		enemy.speed = {y: 2, x: 2.5};
		enemy.opposite = opposite;
		enemy.health = 0;
		enemy.count = count;
		enemy.alcohol = true;
		enemy.score = 1000;
		enemy.speedDiff = 0.02;
		count -= .25;
		game.stage.addChild(enemy);
	}
	for(i = 0; i < 8; i++) spawnEnemy(i);
},

eightDrop = opposite => {
	const enemy = PIXI.Sprite.fromImage('img/enemy-three.png');
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'eightDrop';
	enemy.speed = {x: 2.25, y: 0};
	enemy.x = opposite ? gameX - enemy.width / 2 : gameX + gameWidth + enemy.width / 2;
	enemy.y = gameY + grid * 6;
	enemy.score = 9020;
	enemy.dropClock = 0;
	enemy.speedDiff = 0.025;
	enemy.dropLimit = 60;
	enemy.health = 5;
	enemy.zIndex = 32;
	if(opposite) enemy.opposite = true;
	game.stage.addChild(enemy);
},

eightUpdate = enemy => {
	enemy.x += enemy.opposite ? -enemy.speed.x : enemy.speed.x;
	let limit = gameY + gameHeight - grid * 6;
	if(enemy.yOffset) limit -= enemy.yOffset;
	if(enemy.x >= gameX - enemy.width / 2 && enemy.x <= gameX + gameWidth + enemy.width / 2){
		if(enemy.y >= limit && !enemy.flipped) enemy.flipped = true;
		enemy.y += enemy.flipped ? -enemy.speed.y : enemy.speed.y;
		enemy.speed.x += enemy.flipped ? enemy.speedDiff : -enemy.speedDiff;
	}
	enemy.rotation = getAngle(enemy, {x: winWidth / 2, y: winHeight}) / 2
	enemy.rotation += Math.PI / 4;
},

eightDropUpdate = enemy => {
	if(enemy.dropClock){
		enemy.y -= enemy.speed.y;
		if(!enemy.fired) waveEightBullet(enemy);
		if(enemy.dropClock >= enemy.dropLimit){
			enemy.speed.y += enemy.speedDiff;
		}
		enemy.dropClock++;
	} else {
		enemy.x += enemy.opposite ? enemy.speed.x : -enemy.speed.x;
		enemy.speed.x -= enemy.speedDiff;
		if(enemy.speed.x <= 0) enemy.dropClock = 1;
	}
	enemy.rotation = Math.cos(getAngle(enemy, player.data));
};

enemies.waves.eight = () => {
	eightLine();
	eightLine(false, 1);
	eightDrop();
	enemies.nextWave = 'nine';
};

enemies.waves.nine = () => {
	eightLine(true);
	eightLine(true, 1);
	eightDrop(true);
	enemies.nextWave = 'ten';
};

enemies.update.eight = enemy => {
	eightUpdate(enemy);
};

enemies.update.eightDrop = enemy => {
	eightDropUpdate(enemy);
};

const waveEightBullet = enemy => {
	enemy.fired = true;
	let angle = getAngle(enemy, player.data) - Math.PI / 6;
	const bulletX = enemy.x, bulletY = enemy.y, timeout = .05, count = 5, speed = 3;
	spawnBullets = () => {
		if(enemy.y < winHeight){
			for(i = 0; i < count; i++){
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
				bullet.anchor.set(0.5);
				bullet.x = bulletX;
				bullet.y = bulletY;
				bullet.isEnemyBullet = true;
				bullet.velocity = {x: -Math.cos(angle) * (speed * .8), y: -Math.sin(angle) * (speed * .8)};
				bullet.zIndex = 30;
				bullet.type = 'eight';
				game.stage.addChild(bullet);
				angle += enemy.opposite ? -(Math.PI / count * 2) : Math.PI / count * 2;
			}
			angle += enemy.opposite ? -(Math.PI / count / 4) : Math.PI / count / 4;
		}
		spawnSound.bulletTwo();
	}
	for(i = 0; i < 8; i++) PIXI.setTimeout(timeout * i, spawnBullets);
	PIXI.setTimeout(timeout * 2, () => {
		let oAngle = getAngle(enemy, player.data);
		const spawnOBullet = () => {
			if(enemy.y < winHeight){
				const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
				bullet.anchor.set(0.5);
				bullet.x = enemy.x;
				bullet.y = enemy.y;
				bullet.isEnemyBullet = true;
				let iAngle = oAngle - Math.PI / 2 + Math.random() * Math.PI;
				bullet.velocity = {x: -Math.cos(iAngle) * speed, y: -Math.sin(iAngle) * speed};
				bullet.zIndex = 31;
				bullet.type = 'eight';
				game.stage.addChild(bullet);
			}
			spawnSound.bulletTwo();
		};
		for(i = 0; i < 30; i++) PIXI.setTimeout((timeout) * i, spawnOBullet);
	})
};

enemies.bulletUpdate.eight = bullet => {
	bullet.y += bullet.velocity.y;
	bullet.x += bullet.velocity.x;
};
const levelOneFifthWave = () => {
	const spawnEnemy = i => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-three.png'), size = 36;
		enemy.anchor.set(0.5);
		enemy.isEnemy = true;
		enemy.type = 'five';
		enemy.y = gameY + -size / 2 - Math.round(Math.random() * (gameHeight * 1.5));
		enemy.x = gameX + Math.round(Math.random() * (gameHeight));
		enemy.health = 0;
		const angle = getAngle(enemy, player.data), speed = 3;
		enemy.speed = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
		enemy.rotation = Math.cos(angle);
		enemy.score = 1250;
		game.stage.addChild(enemy);
	};
	for(i = 0; i < 8; i++) spawnEnemy(i);
},

levelOneFifthDrop = (x, y, opposite) => {
	const enemy = PIXI.Sprite.fromImage('img/enemy-one.png');
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'fiveDrop';
	enemy.y = y;
	enemy.x = x;
	enemy.speedLimit = 3;
	enemy.speed = 3;
	enemy.opposite = opposite;
	enemy.speedMod = 0.025;
	enemy.health = 15;
	enemy.score = 7575;
	enemy.clock = 0;
	game.stage.addChild(enemy);
},

levelOneFifthDropBullet = (enemy, count, angle) => {
	for(i = 0; i < count; i++){
		const img = enemy.opposite ? 'img/bullet-blue-big.png' : 'img/bullet-pink-big.png'
		const bullet = PIXI.Sprite.fromImage(img);
		bullet.anchor.set(0.5);
		bullet.x = enemy.x;
		bullet.y = enemy.y;
		bullet.isEnemyBullet = true;
		bullet.speed = 2.5;
		bullet.type = 'fiveDrop';
		bullet.velocity = {x: -Math.cos(angle), y: -Math.sin(angle)};
		game.stage.addChild(bullet);
		angle += Math.PI / count * 2;
	}
	spawnSound.bulletTwo();
};

enemies.waves.five = () => {
	const size = 36;
	levelOneFifthWave();
	levelOneFifthDrop(gameX + gameWidth - grid * 4.5, gameY - size / 2 - grid * 5);
	levelOneFifthDrop(gameX + grid * 4.5, gameY - size / 2 - grid * 30, true);
	enemies.nextWave = 'six';
};

enemies.update.five = enemy => {
	enemy.x += enemy.speed.x;
	enemy.y += enemy.speed.y;
}

enemies.update.fiveDrop = enemy => {
	if(enemy.speed < .5){
		const count = 20, interval = 20;
		if(enemy.clock == 0 || enemy.clock == interval * 2) levelOneFifthDropBullet(enemy, count, 0);
		else if(enemy.clock == interval) levelOneFifthDropBullet(enemy, count, Math.PI / count);
		enemy.clock++;
	}
	enemy.y += enemy.speed;
	if(enemy.speed <= enemy.speedLimit && enemy.speed >= -enemy.speedLimit && enemy.y >= gameY - enemy.height / 2) enemy.speed -= enemy.speedMod;
	enemy.rotation = Math.cos(getAngle(enemy, player.data));
};

enemies.bulletUpdate.fiveDrop = bullet => {
	bullet.x += bullet.velocity.x * bullet.speed;
	bullet.y += bullet.velocity.y * bullet.speed;
};
const levelOneFirstWaveTwo = (initialX, opposite, yOffset) => {
	const size = 36;
	let count = -.75;
	const spawnEnemy = (index, id) => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-four.png');
		enemy.anchor.set(0.5);
		enemy.x = initialX;
		enemy.y = (gameY - size / 2) - i * (size + 4);
		if(yOffset) enemy.y -= yOffset;
		enemy.isEnemy = true;
		enemy.type = 'oneTwo';
		enemy.speed = 3;
		enemy.opposite = opposite;
		enemy.health = 0;
		enemy.count = count;
		enemy.alcohol = true;
		enemy.score = 1000;
		count -= .5;
		game.stage.addChild(enemy);
	}
	for(i = 0; i < 8; i++) spawnEnemy(i, 'a');
},

levelOneFirstWaveDrop = x => {
	const size = 36, enemy = PIXI.Sprite.fromImage('img/enemy-two.png');
	enemy.anchor.set(0.5);
	enemy.x = x;
	enemy.y = gameY - size / 2 - grid * 15;
	enemy.isEnemy = true;
	enemy.type = 'oneDrop';
	enemy.speedInit = 4;
	enemy.speed = enemy.speedInit;
	enemy.speedMod = 0.06;
	enemy.zIndex = 35;
	enemy.health = 10;
	enemy.score = 5500;
	game.stage.addChild(enemy);
},

levelOneFirstWaveDropBullet = enemy => {
	enemy.fired = true;
	let angle = false;
	const doBullet = dir => {
		const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
		bullet.anchor.set(0.5);
		bullet.x = enemy.x;
		bullet.y = enemy.y;
		bullet.isEnemyBullet = true;
		if(!angle) angle = getAngle(bullet, player.data);
		let tempAngle = angle;
		const angleDiff = 1 / 3;
		if(dir){
			switch(dir){
				case 'left':
					tempAngle += angleDiff;
					break;
				case 'leftB':
					tempAngle += angleDiff * 2;
					break;
				case 'right':
					tempAngle -= angleDiff;
					break;
				case 'rightB':
					tempAngle -= angleDiff * 2;
					break;
			}
		}
		bullet.speed = 6;
		bullet.speedMin = bullet.speed / 3;
		bullet.speedDiff = 0.1;
		bullet.velocity = {x: -Math.cos(tempAngle), y: -Math.sin(tempAngle)};
		bullet.type = 'oneDrop';
		bullet.zIndex = 34;
		game.stage.addChild(bullet);
	}
	doBullet();
	doBullet('left');
	doBullet('leftB');
	doBullet('right');
	doBullet('rightB');
	spawnSound.bulletOne();
};

enemies.waves.three = () => {
	const x = grid * 9, size = 36;
	levelOneFirstWaveTwo(gameX + x);
	levelOneFirstWaveTwo(gameX + x + size + 4, false, -4);
	levelOneFirstWaveTwo(gameX + x + size * 2 + 8, false, -8);
	levelOneFirstWaveDrop(gameX + gameWidth - grid * 5);
	enemies.nextWave = 'four';
};

enemies.waves.four = () => {
	const x = gameWidth - grid * 9, size = 36;
	levelOneFirstWaveTwo(gameX + x, true);
	levelOneFirstWaveTwo(gameX + x - size + 4, true, -4);
	levelOneFirstWaveTwo(gameX + x - size * 2 + 8, true, -8);
	levelOneFirstWaveDrop(gameX + grid * 5);
	enemies.nextWave = 'five';
};

enemies.update.oneTwo = enemy => {
	enemy.x += enemy.opposite ? -Math.sin(enemy.count) : Math.sin(enemy.count); 
	enemy.count += 90 / 180 * Math.PI / (grid * 5);
	enemy.y += enemy.speed;
	enemy.rotation = (enemy.opposite ? Math.cos(enemy.count - 1) : -Math.cos(enemy.count - 1)) / 2;
};

enemies.update.oneDrop = enemy => {
	enemy.y += enemy.speed;
	if(enemy.y >= gameY - enemy.height / 2){
		enemy.speed -= enemy.fired ? enemy.speedMod / 4 : enemy.speedMod;
		if(!enemy.fired && enemy.speed <= -0.5) levelOneFirstWaveDropBullet(enemy);
	}
};

enemies.bulletUpdate.oneDrop = bullet => {
	bullet.x += bullet.velocity.x * bullet.speed;
	bullet.y += bullet.velocity.y * bullet.speed;
	if(bullet.speed > bullet.speedMin) bullet.speed -= bullet.speedDiff;
	else if(bullet.speed < bullet.speedMin) bullet.speed = bullet.speedMin;
};
const player = {

	data: PIXI.Sprite.fromImage('img/player.png'),
	hitbox: new PIXI.Graphics(),
	
	floatOffset: grid * 2.5,

	spawnBullet(type){

		const bullet = PIXI.Sprite.fromImage('img/bullet.png');
		bullet.speedY = 20;
		bullet.anchor.set(0.5);
		bullet.x = player.data.x;
		bullet.initialY = player.data.y - 8;
		bullet.y = bullet.initialY;
		bullet.isBullet = true;
		bullet.zIndex = 20;
		bullet.alpha = 0;
		if(type){
			bullet.type = type;
			let diffA = grid * 3, angle;
			const speedX = 20, diffB = diffA * 2, diffC = diffA * 3, diffD = diffA * 4 + 2,
				xOffsetA = 3, xOffsetB = 6, xOffsetC = 9, xOffsetD = 12,
				yOffsetA = 1, yOffsetB = 2, yOffsetC = 4, yOffsetD = 6;
			switch(type){
				case 'leftA':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffA, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 19;
					break;
				case 'rightA':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffA, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 19;
					break;
					break;
				case 'leftB':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffB, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 18;
					break;
				case 'rightB':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffB, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 18;
					break;
					break;
				case 'leftC':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffC, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 17;
					break;
				case 'rightC':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffC, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 17;
					break;
				case 'leftD':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffD, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 16;
					break;
				case 'rightD':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffD, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 16;
					break;
			}
			bullet.speedY *= Math.sin(angle);
		}
		game.stage.addChild(bullet);
	},

	update(){

		const move = () => {
			let speed = player.data.speed;
			if(player.data.slow) speed = speed / 3;
			if(player.data.moving.left){
				player.data.skew.y = -player.data.skewOffset;
				player.data.x -= speed;
				player.hitbox.x -= speed;
			} else if(player.data.moving.right){
				player.data.skew.y = player.data.skewOffset;
				player.data.x += speed;
				player.hitbox.x += speed;
			} else if(player.data.skew.y != 0) player.data.skew.y = 0;

			if(player.data.moving.up){
				player.data.y -= speed;
				player.hitbox.y -= speed;
			} else if(player.data.moving.down){
				player.data.y += speed;
				player.hitbox.y += speed;
			}
			if(player.data.x < player.data.width / 2 + gameX){
				player.data.x = player.data.width / 2 + gameX;
				player.hitbox.x = player.data.x - 2;
			} else if(player.data.x > gameWidth - player.data.width / 2 + gameX){
				player.data.x = gameWidth - player.data.width / 2 + gameX;
				player.hitbox.x = player.data.x - 2;
			}
			if(player.data.y < player.data.height / 2 + gameY){
				player.data.y = player.data.height / 2 + gameY;
				player.hitbox.y = player.data.y - 4;
			} else if(player.data.y > gameHeight - player.data.height / 2 + gameY){
				player.data.y = gameHeight - player.data.height / 2 + gameY;
				player.hitbox.y = player.data.y - 4;
			}
		},
		shoot = () => {
			if(player.data.shooting){
				if(player.data.shotInterval != player.data.shotIntervalInit) player.data.shotInterval = player.data.shotIntervalInit;
				if((player.data.shotClock % player.data.shotInterval == 0) || !player.data.shotInterval){
					player.spawnBullet();
					if(player.data.drunk >= 25){
						player.spawnBullet('leftA');
						player.spawnBullet('rightA');
					}
					if(player.data.drunk >= 50){
						player.spawnBullet('leftB');
						player.spawnBullet('rightB');
					}
					if(player.data.drunk >= 75){
						player.spawnBullet('leftC');
						player.spawnBullet('rightC');
					}
					if(player.data.drunk >= 100){
						player.spawnBullet('leftD');
						player.spawnBullet('rightD');
					}
					spawnSound.bulletPlayer();
				}
				player.data.shotClock++;
			} else if(player.data.shotClock) player.data.shotClock = 0;
		},
		die = () => {
			if(player.data.invulnerableClock > 0){
				if(!player.removed){
					player.removed = true;
					player.data.x = gameWidth / 2 + gameX;
					player.data.y = gameHeight - grid * 3 + gameY;
					player.hitbox.x = player.data.x - 2;
					player.hitbox.y = player.data.y - 4;
					player.data.drunk -= 25;
					if(player.data.drunk < 0) player.data.drunk = 0;
				}
				const interval = grid * 2;
				if(player.data.invulnerableClock % interval < interval / 2) player.data.alpha = 0;
				else if(!player.data.alpha) player.data.alpha = 1;
				player.data.invulnerableClock--;
			} else {
				if(!player.data.alpha) player.data.alpha = 1;
				if(player.removed) player.removed = false;
			}
		};
		if(gameOver){
			if(wonGame){
				player.data.y -= player.data.speed;
				player.data.speed += 0.15;
			} else if(player.data.alpha) player.data.alpha = 0;
		} else {
			move();
			shoot();
			die();
		}
	},

	updateBullet(bullet, i){
		if(bullet.y != bullet.initialY && bullet.alpha != 1) bullet.alpha = 1;
		bullet.y -= bullet.speedY;
		if(bullet.speedX) bullet.x += bullet.speedX;
		if(bullet.y < -bullet.height){
			game.stage.removeChildAt(i);
			return false;
		}
		if(bullet.lastY && (bullet.lastY == bullet.y)){
			game.stage.removeChildAt(i);
			return false;
		}
		bullet.lastY = bullet.y;
	},

	init(){
		const drawPlayer = () => {
			player.data.moving = {up: false, down: false, left: false, right: false};
			player.data.moved = {up: false, down: false, left: false, right: false};
			player.data.speed = 4.25;
			player.data.shooting = false;
			player.data.shotClock = 0;
			player.data.shotIntervalInit = 8;
			player.data.shotInterval = player.data.shotIntervalInit;
			player.data.drunk = 100;
			player.data.drunkDiff = 2;
			player.data.anchor.set(0.5);
			player.data.x = gameWidth / 2 + gameX;
			player.data.y = gameHeight - grid * 3 + gameY;
			player.data.zIndex = 21;
			player.data.lives = 3;
			player.data.bombs = 2;
			player.data.skewOffset = 0.1;
			player.data.chain = 0;
			player.data.chainTime = 0;
			player.data.chainLimit = 60 * 1.5;
			player.data.punk = 1;
			player.data.invulnerableClock = 0;
			game.stage.addChild(player.data);
		},
		drawHitbox = () => {
			const size = 3;
			player.data.anchor.set(0.5);
			player.hitbox.zIndex = 9999;
			player.hitbox.lineStyle(0);
			player.hitbox.beginFill(0xdad45e);
			player.hitbox.drawRect(0, 0, size, size);
			player.hitbox.endFill();
			player.hitbox.x = player.data.x - 1;
			player.hitbox.y = player.data.y - 4;
			player.hitbox.alpha = 0;
			player.data.isPlayer = true;
			game.stage.addChild(player.hitbox);
		};

		drawPlayer();
		drawHitbox();

		game.ticker.add(player.update);
	}

};



// ended up not liking the float for this game, but at least it's in now
// floatLeft: PIXI.Sprite.fromImage('img/player-float-left.png'),
// floatRight: PIXI.Sprite.fromImage('img/player-float-left.png'),

// player.floatLeft.x = player.data.x - player.floatOffset; 
// player.floatLeft.y = player.data.y;
// player.floatRight.x = player.data.x + player.floatOffset; 
// player.floatRight.y = player.data.y;


// player.floatLeft.anchor.set(0.5);
// player.floatLeft.x = player.data.x - player.floatOffset;
// player.floatLeft.y = player.data.y;
// player.floatLeft.zIndex = 21;
// game.stage.addChild(player.floatLeft);

// player.floatRight.anchor.set(0.5);
// player.floatRight.x = player.data.x + player.floatOffset;
// player.floatRight.y = player.data.y;
// player.floatRight.zIndex = 21;
// game.stage.addChild(player.floatRight);
let lastEnemyCount = 0, enemyCount = 0, bulletCount = 0, chipCount = 0;

const mainLoop = () => {
	enemyCount = 0;
	bulletCount = 0;
	chipCount = 0;

	game.stage.children.forEach((child, i) => {
		if(child.isBullet){
			player.updateBullet(child, i);
			collision.placeItem(child, i);
			bulletCount++;
		} else if(child.isEnemy){
			enemies.update[child.type](child, i);
			enemies.mainUpdate(child, i);
			collision.placeItem(child, i);
			if(child.isBoss) chrome.drawBoss(child);
			else if(drewBoss) drewBoss = false;
			enemyCount++;
		} else if(child.isEnemyBullet){
			enemies.bulletUpdate[child.type](child, i);
			enemies.mainBulletUpdate(child, i);
			collision.placeItem(child, i);
			bulletCount++;
		} else if(child.isPlayer){
			collision.placeItem(child, i);
		} else if(child.isFps) chrome.updateFps(child);
		else if(child.isDrunk) chrome.updateDrunk(child);
		else if(child.isScore) chrome.updateScore(child);
		else if(child.isHighScore) chrome.updateHighScore(child);
		else if(child.isPunk) chrome.updatePunk(child);
		else if(child.isLives) chrome.updateLives(child);
		else if(child.isDebug) chrome.updateDebug(child);
		else if(child.isExplosion) explosions.update(child, i);
		else if(child.isChip){
			chips.update(child, i);
			collision.placeItem(child, i);
			chipCount++;
		}
		else if(child.isChipScore) chips.updateScore(child, i);
		else if(child.isStart) game.stage.removeChildAt(i)
		else if(child.isBossBar){
			chrome.updateBossBar(child);
			if(!drewBoss && !bossData) child.alpha = 0;
		}
		else if(child.isBossBarBg && !drewBoss) game.stage.removeChildAt(i)
		else if(child.isCollisionHighlight) game.stage.removeChildAt(i);
	});
	collision.update();

	if(enemyCount == 0 && lastEnemyCount == 0 && !bossData) enemies.init();
	lastEnemyCount = enemyCount;

	if(gameOver && !drewGameOver){
		bossData = false;
		drewBoss = false;
		chrome.drawGameOver();
	}

	sortZIndex();
},

startLoop = () => {
	sortZIndex();
},

startInit = () => {
	// start.init();
	game.ticker.add(startLoop);
	gameInit();
},

gameInit = () => {
	starting = false;
	game.ticker.remove(startLoop);
	background.init();
	player.init();
	collision.init();
	chrome.init();
	game.ticker.add(mainLoop);
	spawnSound.bgmTwo()
},

init = () => {
	storage.get('savedData', (err, data) => {
		savedData = data;
		if(savedData.highScore) highScore = savedData.highScore;
		PIXI.loader.add('crass', 'crass.xml').
			add('font', 'font.ttf').load(data => {
			document.body.appendChild(game.view);
			mapControls();
			startInit();
		});
	});
};

setTimeout(init, 100);