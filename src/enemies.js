const enemies = {

	currentWave: false,
	nextWave: 'bossOne',

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