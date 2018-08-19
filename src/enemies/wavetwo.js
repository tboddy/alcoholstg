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
	enemy.health = 7;
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