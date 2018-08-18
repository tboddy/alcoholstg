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
	enemy.health = 30;
	enemy.score = 7575;
	enemy.alcohol = true;
	game.stage.addChild(enemy);
},

levelOneFifthDropBullet = enemy => {
	enemy.fired = true;
	const bulletX = enemy.x, bulletY = enemy.y;
	const count = 20, timeout = .4, spawnBullets = angle => {
		if(enemy.y < winHeight){
			for(i = 0; i < count; i++){
				const img = enemy.opposite ? 'img/bullet-blue-big.png' : 'img/bullet-pink-big.png'
				const bullet = PIXI.Sprite.fromImage(img);
				bullet.anchor.set(0.5);
				bullet.x = bulletX;
				bullet.y = bulletY;
				bullet.isEnemyBullet = true;
				bullet.speed = 2.5;
				bullet.type = 'fiveDrop';
				bullet.velocity = {x: -Math.cos(angle), y: -Math.sin(angle)};
				game.stage.addChild(bullet);
				angle += Math.PI / count * 2;
			}
		}
	};
	spawnBullets(0);
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
	enemies.nextWave = 'six';
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