let currentScore = 0, highScore = 0, boss = false;

const winWidth = 640, winHeight = 480, gameWidth = 384 - 32, gameHeight = winHeight - 32, grid = 16, gameX = (winWidth - gameWidth) / 2,
	gameY = grid, browserWindow = require('electron').remote, mainWindow = browserWindow.getCurrentWindow(),
	game = new PIXI.Application(winWidth, winHeight, {
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
	for(j = scoreString.length; j < 6; j++){
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






// let gameClock = 0, 

// const context = document.getElementById('canvas').getContext('2d'), browserWindow = require('electron').remote,
// 	storage = require('electron-json-storage'), mainWindow = browserWindow.getCurrentWindow(), grid = 16,
// 	gameWidth = 384, gameHeight = 480,

// colors = {
// 	dark: '#140c1c',
// 	purple: '#442434',
// 	blueLight: '#6dc2ca',
// 	blue: '#597dce',
// 	blueDark: '#30346d',
// 	green: '#6daa2c',
// 	greenDark: '#346524',
// 	red: '#d04648',
// 	peach: '#d2aa99',
// 	light: '#deeed6',
// 	purple: '#442434',
// 	orange: '#d27d2c',
// 	yellow: '#dad45e'
// },

// drawRect = (x, y, width, height, color) => {
// 	context.beginPath();
// 	context.rect(Math.round(x), Math.round(y), width, height);
// 	context.fillStyle = color;
// 	context.fill();
// },

// drawImage = (img, dx, dy, dWidth, dHeight, rotate) => {
// 	if(dWidth && dHeight) context.drawImage(img, Math.floor(dx), Math.floor(dy), dWidth, dHeight);
// 	else context.drawImage(img, Math.floor(dx), Math.floor(dy));
// },

// drawString = (input, x, y, isAlt) => {
// 	const size = 9, sizeY = 14;
// 	const drawChar = (input, x) => {
// 		let charLeft = 0;
// 		switch(input){
// 			case '!': charLeft = size; break;
// 			case '"': charLeft = size * 2; break;
// 			case '#': charLeft = size * 3; break;
// 			case '$': charLeft = size * 4; break;
// 			case '%': charLeft = size * 4; break;
// 			case '&': charLeft = size * 5; break;
// 			case '\'': charLeft = size * 7; break;
// 			case '(': charLeft = size * 7; break;
// 			case ')': charLeft = size * 8; break;
// 			case '*': charLeft = size * 10; break;
// 			case '+': charLeft = size * 11; break;
// 			case ',': charLeft = size * 12; break;
// 			case '-': charLeft = size * 12; break;
// 			case '.': charLeft = size * 13; break;
// 			case '/': charLeft = size * 14; break;
// 			case '0': charLeft = size * 15; break;
// 			case '1': charLeft = size * 16; break;
// 			case '2': charLeft = size * 17; break;
// 			case '3': charLeft = size * 18; break;
// 			case '4': charLeft = size * 19; break;
// 			case '5': charLeft = size * 20; break;
// 			case '6': charLeft = size * 21; break;
// 			case '7': charLeft = size * 22; break;
// 			case '8': charLeft = size * 23; break;
// 			case '9': charLeft = size * 24; break;
// 			case ':': charLeft = size * 25; break;
// 			case ';': charLeft = size * 27; break;
// 			case '<': charLeft = size * 28; break;
// 			case '=': charLeft = size * 29; break;
// 			case '>': charLeft = size * 30; break;
// 			case '?': charLeft = size * 31; break;
// 			case '@': charLeft = size * 32; break;
// 			case 'A': charLeft = size * 32; break;
// 			case 'B': charLeft = size * 33; break;
// 			case 'C': charLeft = size * 34; break;
// 			case 'D': charLeft = size * 35; break;
// 			case 'E': charLeft = size * 36; break;
// 			case 'F': charLeft = size * 37; break;
// 			case 'G': charLeft = size * 38; break;
// 			case 'H': charLeft = size * 39; break;
// 			case 'I': charLeft = size * 40; break;
// 			case 'J': charLeft = size * 41; break;
// 			case 'K': charLeft = size * 42; break;
// 			case 'L': charLeft = size * 43; break;
// 			case 'M': charLeft = size * 44; break;
// 			case 'N': charLeft = size * 45; break;
// 			case 'O': charLeft = size * 46; break;
// 			case 'P': charLeft = size * 47; break;
// 			case 'Q': charLeft = size * 48; break;
// 			case 'R': charLeft = size * 49; break;
// 			case 'S': charLeft = size * 50; break;
// 			case 'T': charLeft = size * 51; break;
// 			case 'U': charLeft = size * 52; break;
// 			case 'V': charLeft = size * 53; break;
// 			case 'W': charLeft = size * 54; break;
// 			case 'X': charLeft = size * 55; break;
// 			case 'Y': charLeft = size * 56; break;
// 			case 'Z': charLeft = size * 57; break;
// 			case '[': charLeft = size * 58; break;
// 			case '\\': charLeft = size * 59; break;
// 			case ']': charLeft = size * 60; break;
// 			case '^': charLeft = size * 61; break;
// 			case '_': charLeft = size * 62; break;
// 			case '`': charLeft = size * 63; break;
// 			case 'a': charLeft = size * 64; break;
// 			case 'b': charLeft = size * 65; break;
// 			case 'c': charLeft = size * 66; break;
// 			case 'd': charLeft = size * 67; break;
// 			case 'e': charLeft = size * 68; break;
// 			case 'f': charLeft = size * 69; break;
// 			case 'g': charLeft = size * 70; break;
// 			case 'h': charLeft = size * 71; break;
// 			case 'i': charLeft = size * 72; break;
// 			case 'j': charLeft = size * 73; break;
// 			case 'k': charLeft = size * 74; break;
// 			case 'l': charLeft = size * 75; break;
// 			case 'm': charLeft = size * 76; break;
// 			case 'n': charLeft = size * 77; break;
// 			case 'o': charLeft = size * 78; break;
// 			case 'p': charLeft = size * 79; break;
// 			case 'q': charLeft = size * 80; break;
// 			case 'r': charLeft = size * 81; break;
// 			case 's': charLeft = size * 82; break;
// 			case 't': charLeft = size * 83; break;
// 			case 'u': charLeft = size * 84; break;
// 			case 'v': charLeft = size * 85; break;
// 			case 'w': charLeft = size * 86; break;
// 			case 'x': charLeft = size * 87; break;
// 			case 'y': charLeft = size * 88; break;
// 			case 'z': charLeft = size * 89; break;
// 			case ' ': charLeft = size * 90; break;
// 		};
// 		context.drawImage(images.font, charLeft, 0, size, sizeY, x, y, size, sizeY);
// 	};
// 	input.split('').forEach(function(char, i){
// 		drawChar(char, x + i * size);
// 	});
// },

// centerText = str => {
// 	return gameWidth / 2 - str.length * 9 / 2;
// };
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
			case 38: player.data.moving.up = true; break;
			case 40: player.data.moving.down = true; break;
			case 37: player.data.moving.left = true; break;
			case 39: player.data.moving.right = true; break;
			case 90: player.data.shooting = true; break;
			case 88: player.data.slow = true; break;
		}
	}, keysUp = e => {
		switch(e.which){
			case 38: player.data.moving.up = false; break;
			case 40: player.data.moving.down = false; break;
			case 37: player.data.moving.left = false; break;
			case 39: player.data.moving.right = false; break;
			case 90: player.data.shooting = false; break;
			case 88: player.data.slow = false; break;
			case 70: toggleFullscreen(); break;
			case 82: location.reload(); break;
		}
	};
	document.addEventListener('keydown', keysDown);
	document.addEventListener('keyup', keysUp);
};
const background = {

	clock: 0,

	draw(){
		const bgGraphic = new PIXI.Graphics();
		bgGraphic.lineStyle(0);
		bgGraphic.beginFill(0x442434);
		bgGraphic.drawRect(gameX, gameY, gameWidth, gameHeight);
		bgGraphic.endFill();
		bgGraphic.zIndex = 1;
		game.stage.addChild(bgGraphic);
	},

	spawn(){
		const type = Math.floor(Math.random() * 3);
		let img = 'img/star-tiny.png', speed = 1, size = 4, zIndex = 4;
		if(type == 1){
			img = 'img/star-small.png';
			speed *= 2;
			size = 8;
			zIndex = 2;
		} else if(type == 2){
			img = 'img/star-big.png';
			speed *= 4;
			size = 16;
			zIndex = 3;
		}
		const star = PIXI.Sprite.fromImage(img);
		star.anchor.set(0.5);
		star.speed = speed;
		star.y = gameY - size / 2;
		star.x = gameX + Math.floor(Math.random() * gameWidth);
		star.zIndex = zIndex;
		star.isBackground = true;
		game.stage.addChild(star);
	},

	spawnUpdate(){
		if(background.clock % 15 == 0) background.spawn();
		background.clock++;
	},

	update(star, i){
		star.y += star.speed;
		if(star.y > gameY + gameHeight + star.height / 2) game.stage.removeChildAt(i);
	},

	init(){
		background.draw();
		game.ticker.add(background.spawnUpdate);
	}

};

// const starTime = 5;

// const background = {

// 	dump: {},

// 	spawn(){
// 		let size = 4, speed = 10, image = images.starTiny;
// 		const type = Math.floor(Math.random() * 3);
// 		if(type == 1){
// 			size = 8;
// 			speed = 15;
// 			image = images.starSmall;
// 		} else if(type == 2){
// 			size = 16;
// 			speed = 20;
// 			image = images.starBig;
// 		}
// 		const isAlt = Math.floor(Math.random() * 3),
// 		starObj = {
// 			position: {x: Math.floor(Math.random() * gameWidth), y: -size},
// 			speed: speed,
// 			type: type,
// 			image: image,
// 			id: randomId()
// 		};
// 		background.dump[starObj.id] = starObj
// 	},

// 	update(){
// 		const updateStar = star => {
// 			star.position.y += star.speed;
// 			if(star.position.y >= gameHeight) delete background.dump[star.id]
// 		};
// 		for(star in background.dump) updateStar(background.dump[star]);
// 		if(gameClock % starTime == 0) background.spawn();
// 	},

// 	draw(){
// 		const drawStar = star => {
// 			drawImage(star.image, star.position.x, star.position.y);
// 		};
// 		drawRect(0, 0, gameWidth, gameHeight, colors.dark)
// 		for(star in background.dump) drawStar(background.dump[star]);
// 	}

// };
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
				}
				else if(type == 'bullet' || type == 'enemyBullet'){
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
		if(item.isEnemy) doPlace(item, 'enemy');
		// if(item.isEnemyBullet) doPlace(item, 'enemyBullet');

	},

	check(){
		for(i = 0; i < collision.sects.length; i++){
			for(j = 0; j < collision.sects[i].length; j++){
				if(collision.sects[i][j].bullet && collision.sects[i][j].enemy){
					const enemy = game.stage.getChildAt(collision.sects[i][j].enemy), bullet = game.stage.getChildAt(collision.sects[i][j].bullet);
					if(bullet.x - bullet.width / 2 >= enemy.x - enemy.width / 2 && bullet.x + bullet.width / 2 <= enemy.x + enemy.width / 2 &&
						bullet.y - bullet.height / 2 >= enemy.y - enemy.height / 2 && bullet.y + bullet.height / 2 <= enemy.y + enemy.height / 2 &&
						bullet.y - bullet.height / 2 > gameY){
						if(enemy.health) enemy.health--;
						else {
							enemy.y = gameHeight * 2;
							bullet.y = -gameHeight;
							collision.sects[i][j].enemy = false;
							collision.sects[i][j].bullet = false;
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
const enemies = {

	currentWave: false,
	nextWave: 'five',

	waves: {},
	update: {},
	bulletSpawn: {},
	bulletUpdate: {},

	mainUpdate(enemy, i){
		if(!enemy.zIndex) enemy.zIndex = 30;
		if(enemy.y >= gameY) enemy.seen = true;
		if(enemy.seen){
			if(enemy.y - enemy.height / 2 > gameY + gameHeight || enemy.y < -enemy.height / 2 + gameY ||
				enemy.x - enemy.width / 2 > gameX + gameWidth || enemy.x + enemy.width / 2 < gameX) game.stage.removeChildAt(i)
		}
	},

	mainBulletUpdate(bullet, i){
		if(!bullet.zIndex) bullet.zIndex = 40;
		if(bullet.y >= 0) bullet.seen = true;
		if(bullet.seen){
			if(bullet.y > gameY + gameHeight + bullet.height / 2 ||
				bullet.y < gameY - bullet.height / 2 ||
				bullet.x < gameX - bullet.width / 2 ||
				bullet.x > gameX + gameWidth + bullet.width / 2)
				game.stage.removeChildAt(i);
		}
	},

	init(){
		if(enemies.nextWave){
			enemies.currentWave = enemies.nextWave;
			enemies.waves[enemies.currentWave]();
		}
	}

};
const levelOneFirstWave = (initialX, opposite) => {
	let count = 0;
	const spawnEnemy = i => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png'), size = 34;
		enemy.anchor.set(0.5);
		enemy.x = initialX;
		enemy.initialX = initialX;
		enemy.y = (gameY - size / 2) - i * (size + 4);
		enemy.isEnemy = true;
		enemy.type = 'one';
		enemy.speed = 2.75;
		enemy.opposite = opposite;
		enemy.count = count;
		enemy.health = 0;
		game.stage.addChild(enemy);
		count -= .5;
	}
	// spawnEnemy();
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

enemies.update.oneTwo = enemy => {
	enemy.x += enemy.opposite ? -Math.sin(enemy.count) : Math.sin(enemy.count); 
	enemy.count += 90 / 180 * Math.PI / (grid * 5);
	enemy.y += enemy.speed;
	enemy.rotation = (enemy.opposite ? Math.cos(enemy.count - 1) : -Math.cos(enemy.count - 1)) / 2;
};


const levelOneFirstWaveTwo = (initialX, opposite, yOffset) => {
	const size = 34;
	let count = -.75;
	const spawnEnemy = (index, id) => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png');
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
		count -= .5;
		game.stage.addChild(enemy);
	}
	for(i = 0; i < 8; i++) spawnEnemy(i, 'a');
},

levelOneFirstWaveDrop = x => {
	const size = 46, enemy = PIXI.Sprite.fromImage('img/enemy-two.png');
	enemy.anchor.set(0.5);
	enemy.x = x;
	enemy.y = gameY - size / 2 - grid * 15;
	enemy.isEnemy = true;
	enemy.type = 'oneDrop';
	enemy.speedInit = 4;
	enemy.speed = enemy.speedInit;
	enemy.speedMod = 0.06;
	enemy.zIndex = 35;
	enemy.health = 30;
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
};

enemies.waves.three = () => {
	const x = grid * 9, size = 34;
	levelOneFirstWaveTwo(gameX + x);
	levelOneFirstWaveTwo(gameX + x + size + 4, false, 8);
	levelOneFirstWaveTwo(gameX + x + size * 2 + 8, false, 16);
	levelOneFirstWaveDrop(gameX + gameWidth - grid * 5);
	enemies.nextWave = 'four';
};

enemies.waves.four = () => {
	const x = gameWidth - grid * 9, size = 34;
	levelOneFirstWaveTwo(gameX + x, true);
	levelOneFirstWaveTwo(gameX + x - size + 4, true, 8);
	levelOneFirstWaveTwo(gameX + x - size * 2 + 8, true, 16);
	levelOneFirstWaveDrop(gameX + grid * 5);
	enemies.nextWave = 'five';
};

enemies.update.oneDrop = enemy => {
	enemy.y += enemy.speed;
	if(enemy.y >= gameY - enemy.height / 2){
		enemy.speed -= enemy.fired ? enemy.speedMod / 4 : enemy.speedMod;
		enemy.rotation += 0.02;
		if(!enemy.fired && enemy.speed <= -0.5) levelOneFirstWaveDropBullet(enemy);
	}
};

enemies.bulletUpdate.oneDrop = bullet => {
	bullet.x += bullet.velocity.x * bullet.speed;
	bullet.y += bullet.velocity.y * bullet.speed;
	if(bullet.speed > bullet.speedMin) bullet.speed -= bullet.speedDiff;
	else if(bullet.speed < bullet.speedMin) bullet.speed = bullet.speedMin;
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
		enemy.rotation = Math.cos(angle)
		game.stage.addChild(enemy);
	};
	for(i = 0; i < 10; i++) spawnEnemy(i);
},

levelOneFifthDrop = (x, y, opposite) => {
	const enemy = PIXI.Sprite.fromImage('img/enemy-four.png');
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'fiveDrop';
	enemy.y = y;
	enemy.x = x;
	enemy.speedLimit = 3;
	enemy.speed = 3;
	enemy.opposite = opposite;
	enemy.speedMod = 0.025;
	enemy.health = 30;
	game.stage.addChild(enemy);
},

levelOneFifthDropBullet = enemy => {
	enemy.fired = true;
	const count = 20, timeout = .4, spawnBullets = angle => {
		for(i = 0; i < count; i++){
			const img = enemy.opposite ? 'img/bullet-blue-big.png' : 'img/bullet-pink-big.png'
			const bullet = PIXI.Sprite.fromImage(img);
			bullet.anchor.set(0.5);
			bullet.x = enemy.x;
			bullet.y = enemy.y;
			bullet.isEnemyBullet = true;
			bullet.speed = 2;
			bullet.type = 'fiveDrop';
			bullet.velocity = {x: -Math.cos(angle), y: -Math.sin(angle)};
			game.stage.addChild(bullet);
			angle += Math.PI / count * 2;
		}
	};
	spawnBullets(0)
	PIXI.setTimeout(timeout, () => {
		spawnBullets(Math.PI / count);
	});
	PIXI.setTimeout(timeout * 2, () => {
		spawnBullets(0);
	});
};

enemies.waves.five = () => {
	const size = 36;
	levelOneFifthWave();
	levelOneFifthDrop(gameX + gameWidth - grid * 4.5, gameY - size / 2 - grid * 5);
	levelOneFifthDrop(gameX + grid * 4.5, gameY - size / 2 - grid * 30, true);
	enemies.nextWave = 'one';
};

enemies.update.five = enemy => {
	enemy.x += enemy.speed.x;
	enemy.y += enemy.speed.y;
}

enemies.update.fiveDrop = enemy => {
	if(enemy.speed < .5 && !enemy.fired) levelOneFifthDropBullet(enemy);
	enemy.y += enemy.speed;
	if(enemy.speed <= enemy.speedLimit && enemy.speed >= -enemy.speedLimit && enemy.y >= gameY - enemy.height / 2) enemy.speed -= enemy.speedMod;
	enemy.rotation = Math.cos(getAngle(enemy, player.data));
};

enemies.bulletUpdate.fiveDrop = bullet => {
	bullet.x += bullet.velocity.x * bullet.speed;
	bullet.y += bullet.velocity.y * bullet.speed;
};
// enemies.waves.four = () => {
// 	const enemy = PIXI.Sprite.fromImage('img/enemy-two.png');
// 	enemy.type = 'four';
// 	enemy.isEnemy = true;
// 	enemy.anchor.set(0.5);
// 	enemy.initialX = grid * 4;
// 	enemy.initialY = -grid * 4 - enemy.height / 2;
// 	enemy.x = enemy.initialX;
// 	enemy.y = enemy.initialY;
// 	enemy.initialSpeedY = 2;
// 	enemy.speedY = enemy.initialSpeedY;
// 	enemy.speedX = 0;
// 	enemy.speedYDiff = 0.075;
// 	enemy.speedXDiff = 0.075;
// 	enemy.count = 90;
// 	game.stage.addChild(enemy);
// };

// enemies.update.four = enemy => {
// 	const increase = 90 / (360 * 2) * Math.PI / grid;
// 	if(enemy.y >= gameHeight / 4){
// 		// enemy.x = enemy.initialX - Math.sin(enemy.count) * (grid * 9);
// 		// enemy.y = enemy.initialY - Math.cos(enemy.count) * (grid * 9);
// 		// enemy.count += increase;
// 		// enemy.anchor.set(5, 5)
// 		// enemy.pivot.set(0, 100);
// 		// enemy.rotation -= 0.05
// 	} else {
// 		enemy.y += enemy.speedY
// 	}
// 	// enemy.x += enemy.speedX;
// 	// enemy.speedY -= enemy.speedYDiff;
// 	// if(enemy.x < gameWidth / 2){
// 	// 	enemy.speedX += enemy.speedXDiff;
// 	// } else {
// 	// 	enemy.speedX -= enemy.speedXDiff;
// 	// }
// };

// enemies.bulletUpdate.four = bullet => {

// };


// 	// initialY = -34;
// 	// enemy.anchor.set(0.5);
// 	// enemy.x = initialX;
// 	// enemy.y = yOffset ? initialY - yOffset : initialY;
// 	// enemy.isEnemy = true;
// 	// enemy.zIndex = 6;
// 	// enemy.initialSpeedY = 5;
// 	// enemy.speedY = enemy.initialSpeedY;
// 	// enemy.triggerY = grid * 3;
// 	// enemy.speedDiff = 0.15;
// 	// enemy.type = type;
// 	// game.stage.addChild(enemy);




// 	// if(enemy.y > enemy.triggerY && !enemy.triggered) enemy.triggered = true
// 	// if(enemy.triggered) enemy.speedY -= enemy.speedDiff;
// 	// else enemy.speedY = Math.round(enemy.speedY);
// 	// enemy.y += enemy.speedY;
// 	// const angle = getAngle(enemy, player.data);
// 	// enemy.rotation = angle + Math.PI / 2
// 	// if(Math.ceil(enemy.speedY) == 0 && !enemy.shot) enemies.bulletSpawn.one(enemy);

// // levelOneFirstBulletSpawn = (enemy, type) => {
// // 	enemy.shot = true;
// // 	let angle = false;
// // 	const doBullet = dir => {
// // 		const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
// // 		bullet.x = enemy.x;
// // 		bullet.y = enemy.y;
// // 		bullet.isEnemyBullet = true;
// // 		bullet.anchor.set(0.5);
// // 		bullet.zIndex = 5;
// // 		bullet.speed = 3.5;
// // 		if(!angle) angle = getAngle(bullet, player.data);
// // 		let tempAngle = angle;
// // 		const angleDiff = 1 / 3;
// // 		if(dir) tempAngle += dir == 'left' ? angleDiff : -angleDiff;
// // 		bullet.speedX = -Math.cos(tempAngle);
// // 		bullet.speedY = -Math.sin(tempAngle);
// // 		bullet.type = type;
// // 		game.stage.addChild(bullet);
// // 	}
// // 	doBullet();
// // 	doBullet('left');
// // 	doBullet('right');
// // },

// // levelOneFirstBulletUpdate = bullet => {
// // 	bullet.x += bullet.speedX * bullet.speed;
// // 	bullet.y += bullet.speedY * bullet.speed;
// // 	if(bullet.speed > 2) bullet.speed -= 0.02;
// // };
const player = {

	data: PIXI.Sprite.fromImage('img/player.png'),

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
			} else if(player.data.moving.right){
				player.data.skew.y = player.data.skewOffset;
				player.data.x += speed;
			} else if(player.data.skew.y != 0) player.data.skew.y = 0;

			if(player.data.moving.up) player.data.y -= speed;
			else if(player.data.moving.down) player.data.y += speed;
			if(player.data.x < player.data.width / 2 + gameX) player.data.x = player.data.width / 2 + gameX;
			else if(player.data.x > gameWidth - player.data.width / 2 + gameX) player.data.x = gameWidth - player.data.width / 2 + gameX;
			if(player.data.y < player.data.height / 2 + gameY) player.data.y = player.data.height / 2 + gameY;
			else if(player.data.y > gameHeight - player.data.height / 2 + gameY) player.data.y = gameHeight - player.data.height / 2 + gameY;
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
				}
				player.data.shotClock++;
			} else if(player.data.shotClock) player.data.shotClock = 0;
		};

		move();
		shoot();

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
		player.data.moving = {up: false, down: false, left: false, right: false};
		player.data.moved = {up: false, down: false, left: false, right: false};
		player.data.speed = 4.25;
		player.data.shooting = false;
		player.data.shotClock = 0;
		player.data.shotIntervalInit = 8;
		player.data.shotInterval = player.data.shotIntervalInit;
		player.data.punk = 1;
		player.data.drunk = 20;
		player.data.anchor.set(0.5);
		player.data.x = gameWidth / 2 + gameX;
		player.data.y = gameHeight - grid * 3 + gameY;
		player.data.zIndex = 21;
		player.data.lives = 3;
		player.data.bombs = 2;
		player.data.skewOffset = 0.1;
		game.stage.addChild(player.data);
		game.ticker.add(player.update);
	}

};
let lastEnemyCount = 0, enemyCount = 0, bulletCount = 0;

const mainLoop = () => {
	enemyCount = 0;
	bulletCount = 0;

	game.stage.children.forEach((child, i) => {
		if(child.isBullet){
			player.updateBullet(child, i);
			collision.placeItem(child, i);
			bulletCount++;
		} else if(child.isEnemy){
			enemies.update[child.type](child, i);
			enemies.mainUpdate(child, i);
			collision.placeItem(child, i);
			enemyCount++;
		} else if(child.isEnemyBullet){
			enemies.bulletUpdate[child.type](child, i);
			enemies.mainBulletUpdate(child, i);
			bulletCount++;
			// collision.placeItem(child, i);
		} else if(child.isFps) chrome.updateFps(child);
		else if(child.isBackground) background.update(child, i);
		else if(child.isDebug) chrome.updateDebug(child);
		else if(child.isCollisionHighlight) game.stage.removeChildAt(i);
	});
	collision.update();

	if(enemyCount == 0 && lastEnemyCount == 0) enemies.init();
	lastEnemyCount = enemyCount;
	sortZIndex();
},

init = () => {


	PIXI.loader.add('crass', 'crass.xml').load(data => {
		document.body.appendChild(game.view);
		mapControls();
		background.init();
		player.init();
		collision.init();
		chrome.init();
		game.ticker.add(mainLoop);
	});
};

setTimeout(init, 100);