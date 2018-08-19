let currentScore = 0, highScore = 0, bossData = false, wonGame = false, gameOver = false, starting = true;

const storage = require('electron-json-storage'), winWidth = 640, winHeight = 480, gameWidth = 384 - 32, gameHeight = winHeight - 32,
	grid = 16, gameX = (winWidth - gameWidth) / 2, gameY = grid, browserWindow = require('electron').remote,
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