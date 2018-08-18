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