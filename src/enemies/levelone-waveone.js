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
		enemy.alcohol = true;
		enemy.score = 1000;
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
	enemy.health = 20;
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
	const x = grid * 9, size = 34;
	levelOneFirstWaveTwo(gameX + x);
	levelOneFirstWaveTwo(gameX + x + size + 4, false, 8);
	levelOneFirstWaveDrop(gameX + gameWidth - grid * 5);
	enemies.nextWave = 'four';
};

enemies.waves.four = () => {
	const x = gameWidth - grid * 9, size = 34;
	levelOneFirstWaveTwo(gameX + x, true);
	levelOneFirstWaveTwo(gameX + x - size + 4, true, 8);
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