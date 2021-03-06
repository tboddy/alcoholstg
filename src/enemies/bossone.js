enemies.waves.bossOne = () => {
	const enemy = PIXI.Sprite.fromImage('img/boss-one.png'), size = 76;
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'bossOne';
	enemy.x = gameX + gameWidth / 2;
	enemy.y = gameY - size / 2;
	enemy.score = 100000;
	enemy.isBoss = true;
	enemy.health = 300;
	bossData = enemy.health;
	enemy.zIndex = 35;
	enemy.zIndex = 51;
	enemy.speed = 2.65;
	enemy.speedDiff = 0.03;
	enemy.clock = 0;
	enemy.intervalA = 60 * 4;
	enemy.intervalB = 60 * 5;
	enemy.intervalC = 60 * 4;
	game.stage.addChild(enemy);
	enemies.nextWave = 'seven';
	// spawnSound.bgmThree()
};

enemies.update.bossOne = enemy => {
	if(enemy.inPlace){
		if(enemy.speed != 0) enemy.speed = 0;
		if(enemy.clock < enemy.intervalA) bossOneCardOne(enemy);
		else if(enemy.clock >= enemy.intervalA && enemy.clock < enemy.intervalA + enemy.intervalB) bossOneCardTwo(enemy);
		else if(enemy.clock >= enemy.intervalA + enemy.intervalB && enemy.clock < enemy.intervalA + enemy.intervalB + enemy.intervalC) bossOneCardThree(enemy);
		else enemy.clock = 0;
		enemy.clock++;
	} else {
		enemy.y += enemy.speed;
		enemy.speed -= enemy.speedDiff;
		if(enemy.speed <= 0) enemy.inPlace = true;
	}
	// enemy.rotation = getAngle(enemy, player.data) + (Math.PI / 2)
};

const bossOneCardOne = enemy => {
	const dirClock = enemy.intervalA / 3;
	if(enemy.clock % dirClock == 0){
		let oAngle = 0;
		const count = 10;
		for(i = 0; i < count; i++){
			const spawnSub = (angle, offset) => {
				if(offset){
					if(enemy.clock >= dirClock && enemy.clock < dirClock * 2) angle -= offset / count;
					else angle += offset / count;
				}
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
				bullet.anchor.set(0.5);
				bullet.isEnemyBullet = true;
				bullet.initX = enemy.x;
				bullet.initY = enemy.y;
				bullet.x = bullet.initX;
				bullet.y = bullet.initY;
				bullet.angle = angle;
				bullet.alpha = 0;
				if(offset){
					bullet.x += Math.cos(angle) * (offset * 20);
					bullet.y += Math.sin(angle) * (offset * 20);
				}
				const speed = 3;
				bullet.velocity = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
				bullet.type = 'bossOneCardOne';
				game.stage.addChild(bullet);
			}
			spawnSub(oAngle)
			spawnSub(oAngle, 1)
			spawnSub(oAngle, 2)
			spawnSub(oAngle, 3)
			spawnSub(oAngle, 4)
			// spawnSound.bulletOne();
			oAngle += Math.PI / (count / 2);
		}
	}
};

enemies.bulletUpdate.bossOneCardOne = bullet => {
	bullet.y += bullet.velocity.y;
	bullet.x += bullet.velocity.x;
	if(bullet.alpha == 0){
		if((bullet.velocity.x > 0 && bullet.x >= bullet.initX) || (bullet.velocity.x < 0 && bullet.x <= bullet.initX)) bullet.alpha = 1;
		if((bullet.velocity.y > 0 && bullet.y >= bullet.initY) || (bullet.velocity.y < 0 && bullet.xy <= bullet.initY)) bullet.alpha = 1;
	}
};

const bossOneCardTwo = enemy => {
	const spawnBullets = () => {
		const count = 13;
		let angle = 0;
		for(i = 0; i < count; i++){
			const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
			bullet.anchor.set(0.5);
			bullet.isEnemyBullet = true;
			bullet.x = enemy.x;
			bullet.y = enemy.y;
			const speed = 2;
			bullet.velocity = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
			bullet.type = 'bossOneCardTwo';
			game.stage.addChild(bullet);
			angle += Math.PI / (count / 2)
		}
		// spawnSound.bulletThree();
	};
	const interval = 15, ySpeed = 3, xSpeed = 1.5, sec = 60, rotationTime = 0.005;
	if(enemy.clock % interval == 0) spawnBullets();
	if(enemy.clock < enemy.intervalA + sec){
		enemy.y += ySpeed;
		enemy.x -= xSpeed;
		enemy.rotation -= rotationTime;
	} else if(enemy.clock >= enemy.intervalA + (sec * 2) &&
		enemy.clock < enemy.intervalA + (sec * 3)){
		enemy.y -= ySpeed;
		enemy.x += xSpeed * 2;
		enemy.rotation += rotationTime * 2;
	} else if(enemy.clock >= enemy.intervalA + (sec * 4) &&
		enemy.clock < enemy.intervalA + (sec * 5)){
		enemy.x -= xSpeed;
		enemy.rotation -= rotationTime;
	}
};

enemies.bulletUpdate.bossOneCardTwo = bullet => {
	bullet.y += bullet.velocity.y;
	bullet.x += bullet.velocity.x;
};

const bossOneCardThree = enemy => {
	const interval = 2;
	if(enemy.clock % interval == 0){
		const speed = 2;
		let angle = getAngle(enemy, player.data);
		const spawnOBullet = () => {
			const img = enemy.clock % (interval * 2) == interval ? 'img/bullet-pink.png' : 'img/bullet-blue.png'
			const bullet = PIXI.Sprite.fromImage(img);
			bullet.anchor.set(0.5);
			bullet.x = enemy.x;
			bullet.y = enemy.y;
			bullet.isEnemyBullet = true;
			let iAngle = angle - Math.PI / 3 + Math.random() * (Math.PI / 3 * 2);
			bullet.velocity = {x: -Math.cos(iAngle) * speed, y: -Math.sin(iAngle) * speed};
			bullet.zIndex = 31;
			bullet.type = 'eight';
			game.stage.addChild(bullet);
		};
		spawnOBullet();
		// spawnSound.bulletTwo();
	}

}