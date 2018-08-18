enemies.waves.seven = () => {
	const size = 36, yOffset = gameHeight * .75, spawnEnemy = (x, y, opposite) => {
		enemy = PIXI.Sprite.fromImage('img/enemy-four.png');
		enemy.anchor.set(0.5);
		enemy.x = gameX + x;
		enemy.y = (gameY - size / 2) - y;
		enemy.isEnemy = true;
		enemy.type = 'seven';
		enemy.speed = 3.5;
		enemy.health = 40;
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