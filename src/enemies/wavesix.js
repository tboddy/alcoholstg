const eightLine = (opposite, yOffset) => {
	const size = 36;
	let count = -.5;
	const spawnEnemy = index => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png');
		enemy.anchor.set(0.5);
		enemy.x = opposite ? gameX + gameWidth + size / 2 : gameX - size / 2;
		const offset = (size + 4) * index;
		enemy.x += opposite ? offset : -offset;
		enemy.y = gameY + gameHeight / 2;
		if(yOffset){
			enemy.yOffset = (size + grid) * yOffset;
			enemy.y -= enemy.yOffset;
		}
		enemy.isEnemy = true;
		enemy.type = 'eight';
		enemy.speed = {y: 2, x: 2.5};
		enemy.opposite = opposite;
		enemy.health = 0;
		enemy.count = count;
		enemy.alcohol = true;
		enemy.score = 1000;
		enemy.speedDiff = 0.02;
		count -= .25;
		game.stage.addChild(enemy);
	}
	for(i = 0; i < 8; i++) spawnEnemy(i);
},

eightDrop = opposite => {
	const enemy = PIXI.Sprite.fromImage('img/enemy-three.png');
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'eightDrop';
	enemy.speed = {x: 2.25, y: 0};
	enemy.x = opposite ? gameX - enemy.width / 2 : gameX + gameWidth + enemy.width / 2;
	enemy.y = gameY + grid * 6;
	enemy.score = 9020;
	enemy.dropClock = 0;
	enemy.speedDiff = 0.025;
	enemy.dropLimit = 60;
	enemy.health = 30;
	enemy.zIndex = 32;
	if(opposite) enemy.opposite = true;
	game.stage.addChild(enemy);
},

eightUpdate = enemy => {
	enemy.x += enemy.opposite ? -enemy.speed.x : enemy.speed.x;
	let limit = gameY + gameHeight - grid * 6;
	if(enemy.yOffset) limit -= enemy.yOffset;
	if(enemy.x >= gameX - enemy.width / 2 && enemy.x <= gameX + gameWidth + enemy.width / 2){
		if(enemy.y >= limit && !enemy.flipped) enemy.flipped = true;
		enemy.y += enemy.flipped ? -enemy.speed.y : enemy.speed.y;
		enemy.speed.x += enemy.flipped ? enemy.speedDiff : -enemy.speedDiff;
	}
	enemy.rotation = getAngle(enemy, {x: winWidth / 2, y: winHeight}) / 2
	enemy.rotation += Math.PI / 4;
},

eightDropUpdate = enemy => {
	if(enemy.dropClock){
		enemy.y -= enemy.speed.y;
		if(!enemy.fired) waveEightBullet(enemy);
		if(enemy.dropClock >= enemy.dropLimit){
			enemy.speed.y += enemy.speedDiff;
		}
		enemy.dropClock++;
	} else {
		enemy.x += enemy.opposite ? enemy.speed.x : -enemy.speed.x;
		enemy.speed.x -= enemy.speedDiff;
		if(enemy.speed.x <= 0) enemy.dropClock = 1;
	}
	enemy.rotation = Math.cos(getAngle(enemy, player.data));
};

enemies.waves.eight = () => {
	eightLine();
	eightLine(false, 1);
	eightDrop();
	enemies.nextWave = 'nine';
};

enemies.waves.nine = () => {
	eightLine(true);
	eightLine(true, 1);
	eightDrop(true);
	enemies.nextWave = 'ten';
};

enemies.update.eight = enemy => {
	eightUpdate(enemy);
};

enemies.update.eightDrop = enemy => {
	eightDropUpdate(enemy);
};

const waveEightBullet = enemy => {
	enemy.fired = true;
	let angle = getAngle(enemy, player.data) - Math.PI / 6;
	const bulletX = enemy.x, bulletY = enemy.y, timeout = .05, count = 5, speed = 3;
	spawnBullets = () => {
		if(enemy.y < winHeight){
			for(i = 0; i < count; i++){
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
				bullet.anchor.set(0.5);
				bullet.x = bulletX;
				bullet.y = bulletY;
				bullet.isEnemyBullet = true;
				bullet.velocity = {x: -Math.cos(angle) * (speed * .8), y: -Math.sin(angle) * (speed * .8)};
				bullet.zIndex = 30;
				bullet.type = 'eight';
				game.stage.addChild(bullet);
				angle += enemy.opposite ? -(Math.PI / count * 2) : Math.PI / count * 2;
			}
			angle += enemy.opposite ? -(Math.PI / count / 4) : Math.PI / count / 4;
		}
	}
	for(i = 0; i < 8; i++) PIXI.setTimeout(timeout * i, spawnBullets);
	PIXI.setTimeout(timeout * 2, () => {
		let oAngle = getAngle(enemy, player.data);
		const spawnOBullet = () => {
			if(enemy.y < winHeight){
				const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
				bullet.anchor.set(0.5);
				bullet.x = enemy.x;
				bullet.y = enemy.y;
				bullet.isEnemyBullet = true;
				let iAngle = oAngle - Math.PI / 2 + Math.random() * Math.PI;
				bullet.velocity = {x: -Math.cos(iAngle) * speed, y: -Math.sin(iAngle) * speed};
				bullet.zIndex = 31;
				bullet.type = 'eight';
				game.stage.addChild(bullet);
			}
		};
		for(i = 0; i < 30; i++) PIXI.setTimeout((timeout) * i, spawnOBullet);
	})
};

enemies.bulletUpdate.eight = bullet => {
	bullet.y += bullet.velocity.y;
	bullet.x += bullet.velocity.x;
};