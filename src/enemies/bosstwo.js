enemies.waves.bossTwo = () => {
	const enemy = PIXI.Sprite.fromImage('img/boss-two.png'), size = 76;
	enemy.anchor.set(0.5);
	enemy.isEnemy = true;
	enemy.type = 'bossTwo';
	enemy.x = gameX + gameWidth / 2;
	enemy.y = gameY - size / 2;
	enemy.score = 100000;
	enemy.isBoss = true;
	enemy.health = 400;
	bossData = enemy.health;
	enemy.zIndex = 30.05;
	enemy.speed = 2.65;
	enemy.speedDiff = 0.03;
	enemy.clock = 0;
	enemy.intervalA = 60 * 7;
	enemy.intervalB = 60 * 6;
	enemy.intervalC = 60 * 6;
	game.stage.addChild(enemy);
	enemies.nextWave = false;
	spawnSound.bgmFour()
};

enemies.update.bossTwo = enemy => {
	if(enemy.inPlace){
		if(enemy.speed != 0) enemy.speed = 0;
		if(enemy.clock < enemy.intervalA) bossTwoCardOne(enemy);
		else if(enemy.clock >= enemy.intervalA && enemy.clock < enemy.intervalA + enemy.intervalB) bossTwoCardTwo(enemy);
		else if(enemy.clock >= enemy.intervalA + enemy.intervalB && enemy.clock < enemy.intervalA + enemy.intervalB + enemy.intervalC) bossTwoCardThree(enemy);
		else if(enemy.clock >= enemy.intervalA + enemy.intervalB + enemy.intervalC && enemy.clock < enemy.intervalA + enemy.intervalB + enemy.intervalC + enemy.intervalB) bossTwoCardTwo(enemy, true);
		else enemy.clock = 0;
		enemy.clock++;
	} else {
		enemy.y += enemy.speed;
		enemy.speed -= enemy.speedDiff;
		if(enemy.speed <= 0) enemy.inPlace = true;
	}
	// enemy.rotation = 0
};

const bossTwoCardOne = enemy => {
	const gravitySpray = () => {
		const interval = 30;
		if(enemy.clock % interval == 0){
			const count = 10;
			let angle = 0;
			for(i = 0; i < count; i++){
				const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
				bullet.anchor.set(0.5);
				bullet.isEnemyBullet = true;
				bullet.x = enemy.x;
				bullet.y = enemy.y;
				bullet.speed = {x: 2, y: 2.25};
				bullet.speedDiff = {x: 0.02, y: 0.035};
				let num = parseFloat((Math.random() * (count - 1)).toFixed(1))
				if(num < 1) num += num * 2;
				if(num > count - 2) num += num * 2;
				bullet.angle = Math.PI / (count - 1) * num;
				bullet.zIndex = 30;
				bullet.type = 'bossTwoCardOne';
				game.stage.addChild(bullet);
			}
			spawnSound.bulletTwo()
		}
	}, razor = () => {
		const dirClock = enemy.intervalA / 10, count = 5;
		if(enemy.clock % dirClock == 0){
			let oAngle = getAngle(enemy, player.data) - Math.PI / (count * 2);
			for(i = 0; i < count; i++){
				const spawnSub = (angle, index) => {
					const bullet = PIXI.Sprite.fromImage('img/bullet-blue.png');
					bullet.anchor.set(0.5);
					bullet.isEnemyBullet = true;
					bullet.x = enemy.x;
					bullet.y = enemy.y;
					bullet.zIndex = 29;
					const speed = 2;
					bullet.velocity = {x: -Math.cos(angle) * speed, y: -Math.sin(angle) * speed};
					if(enemy.clock >= dirClock && enemy.clock < dirClock * 2 ||
						enemy.clock >= dirClock * 3 && enemy.clock < dirClock * 4 ||
						enemy.clock >= dirClock * 5 && enemy.clock < dirClock * 6 ||
						enemy.clock >= dirClock * 7 && enemy.clock < dirClock * 8 ||
						enemy.clock >= dirClock * 9 && enemy.clock < dirClock * 10){
						bullet.velocity.x = -Math.cos(angle) * -speed
					}
					bullet.type = 'bossOneCardOne';
					game.stage.addChild(bullet);
				}
				let sCount = 0, tempAngle = oAngle;
				for(j = 0; j < count; j++) PIXI.setTimeout(.05 * j, () => {
					spawnSub(tempAngle + sCount * .15, sCount);
					sCount++;
				});
				oAngle += Math.PI / (count / 4);
			}
			spawnSound.bulletTwo()
		}
	};
	gravitySpray();
	razor();
};

enemies.bulletUpdate.bossTwoCardOne = bullet => {
	const velocity = {x: -Math.cos(bullet.angle) * bullet.speed.x, y: -Math.sin(bullet.angle) * bullet.speed.y};
	bullet.y += velocity.y;
	bullet.x += velocity.x;
	bullet.speed.y -= bullet.speedDiff.y;
	if(bullet.speed.y > 0) bullet.speed.x -= bullet.speedDiff.x;
	bullet.zIndex += 0.001;
};

const bossTwoCardTwo = (enemy, isAlt) => {
	const angleObj = {x: isAlt ? gameX + gameWidth : gameX, y: gameY + gameHeight}
	const angle = getAngle(enemy, angleObj), sec = 60, lasers = () => {
		const fire = (x, y, angleOffset) => {
			const bullet = PIXI.Sprite.fromImage('img/bullet-pink-big.png');
			bullet.altTex = PIXI.Texture.fromImage('img/bullet-pink.png');
			bullet.anchor.set(0.5);
			bullet.isEnemyBullet = true;
			bullet.x = x;
			bullet.y = y;
			bullet.zIndex = 30;
			bullet.clock = 0;
			const speed = 3.5;
			let tempAngle = angle;
			if(angleOffset){
				tempAngle += (Math.PI / 8) * angleOffset
			}
			bullet.velocity = {x: -Math.cos(tempAngle) * speed, y: -Math.sin(tempAngle) * speed};
			bullet.type = 'bossTwoCardTwo';
			game.stage.addChild(bullet);
		};
		if(enemy.clock % 3 == 0){
			const offset = grid * 1.5;
			const lOffsetA = isAlt ? enemy.x + offset : enemy.x - offset,
				lOffsetB = isAlt ? enemy.x - offset : enemy.x + offset;
			fire(lOffsetA, enemy.y - offset, -2);
			fire(lOffsetA, enemy.y - offset, -1);
			fire(lOffsetA, enemy.y - offset, 0);
			fire(lOffsetA, enemy.y - offset, 1);
			fire(lOffsetA, enemy.y - offset, 2);
			fire(lOffsetB, enemy.y + offset, 2);
			fire(lOffsetB, enemy.y + offset, 1);
			fire(lOffsetB, enemy.y + offset, 0);
			fire(lOffsetB, enemy.y + offset, -1);
			fire(lOffsetB, enemy.y + offset, -2);
			spawnSound.bulletThree()
		}
	};
	let limitA = enemy.intervalA + sec, limitB = enemy.intervalA + enemy.intervalB - sec;
	if(isAlt){
		limitA = enemy.intervalA + enemy.intervalB + enemy.intervalC + sec
		limitB = enemy.intervalA + enemy.intervalB + enemy.intervalC + enemy.intervalB - sec;
	}
	if(enemy.clock < limitA) enemy.x += isAlt ? -1.5 : 1.5;
	else if(enemy.clock >= limitA && enemy.clock < limitB) lasers();
	else if(enemy.clock >= limitB) enemy.x -= isAlt ? -1.5 : 1.5;
};

enemies.bulletUpdate.bossTwoCardTwo = bullet => {
	bullet.x += bullet.velocity.x;
	bullet.y += bullet.velocity.y;
	if(bullet.clock >= 20 && !bullet.flipped){
		bullet.flipped = true;
		bullet.texture = bullet.altTex
	}
	bullet.clock++;
};

const bossTwoCardThree = enemy => {
	const offset = grid * 3, interval = 60, circle = (x, altTex) => {
		const count = 90, playerAngle = getAngle({x: x, y: enemy.y}, player.data), aOffset = .1;
		let angle = playerAngle;
		for(i = 0; i < count; i++){
			const bullet = altTex ? PIXI.Sprite.fromImage('img/bullet-pink-big.png') : PIXI.Sprite.fromImage('img/bullet-blue-big.png');
			bullet.anchor.set(0.5);
			bullet.isEnemyBullet = true;
			bullet.x = x;
			bullet.y = enemy.y;
			bullet.speed = 3;
			bullet.angle = angle
			bullet.zIndex = 30;
			bullet.type = 'bossTwoCardThree';
			bullet.speedDiff = 0.01;
			if(angle >= playerAngle + aOffset) game.stage.addChild(bullet);
			angle += Math.PI / (count / 2);
		}
	};
	if(enemy.clock % interval == 0){
		circle(enemy.x - offset);
		spawnSound.bulletOne()
	} else if(enemy.clock % interval == interval / 2){
		circle(enemy.x + offset, true);
		spawnSound.bulletOne()
	}
};

enemies.bulletUpdate.bossTwoCardThree = bullet => {
	const velocity = {x: -Math.cos(bullet.angle) * bullet.speed, y: -Math.sin(bullet.angle) * bullet.speed};
	bullet.x += velocity.x;
	bullet.y += velocity.y;
	if(bullet.y <= gameY + gameHeight + bullet.height / 2 &&
		bullet.x >= gameX - bullet.width / 2 && bullet.x <= gameX + gameWidth + bullet.width / 2) bullet.speed -= bullet.speedDiff;
};