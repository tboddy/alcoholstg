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
		enemy.health = 7;
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
	enemy.rotation += 0.02;
};

enemies.waves.ten = () => {
	waveTen();
	enemies.nextWave = 'eleven';
};

enemies.waves.eleven = () => {
	waveTen(true);
	enemies.nextWave = 'one';
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
	if(enemy.dropClock < limit) spawnBullet();
	else {
		spawnBullet(4);
		spawnBullet(-4);
	}
};

enemies.bulletUpdate.ten = bullet => {
	bullet.y += bullet.speed;
}