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