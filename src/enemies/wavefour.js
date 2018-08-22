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