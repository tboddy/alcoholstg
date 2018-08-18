// enemies.waves.four = () => {
// 	const enemy = PIXI.Sprite.fromImage('img/enemy-two.png');
// 	enemy.type = 'four';
// 	enemy.isEnemy = true;
// 	enemy.anchor.set(0.5);
// 	enemy.initialX = grid * 4;
// 	enemy.initialY = -grid * 4 - enemy.height / 2;
// 	enemy.x = enemy.initialX;
// 	enemy.y = enemy.initialY;
// 	enemy.initialSpeedY = 2;
// 	enemy.speedY = enemy.initialSpeedY;
// 	enemy.speedX = 0;
// 	enemy.speedYDiff = 0.075;
// 	enemy.speedXDiff = 0.075;
// 	enemy.count = 90;
// 	game.stage.addChild(enemy);
// };

// enemies.update.four = enemy => {
// 	const increase = 90 / (360 * 2) * Math.PI / grid;
// 	if(enemy.y >= gameHeight / 4){
// 		// enemy.x = enemy.initialX - Math.sin(enemy.count) * (grid * 9);
// 		// enemy.y = enemy.initialY - Math.cos(enemy.count) * (grid * 9);
// 		// enemy.count += increase;
// 		// enemy.anchor.set(5, 5)
// 		// enemy.pivot.set(0, 100);
// 		// enemy.rotation -= 0.05
// 	} else {
// 		enemy.y += enemy.speedY
// 	}
// 	// enemy.x += enemy.speedX;
// 	// enemy.speedY -= enemy.speedYDiff;
// 	// if(enemy.x < gameWidth / 2){
// 	// 	enemy.speedX += enemy.speedXDiff;
// 	// } else {
// 	// 	enemy.speedX -= enemy.speedXDiff;
// 	// }
// };

// enemies.bulletUpdate.four = bullet => {

// };


// 	// initialY = -34;
// 	// enemy.anchor.set(0.5);
// 	// enemy.x = initialX;
// 	// enemy.y = yOffset ? initialY - yOffset : initialY;
// 	// enemy.isEnemy = true;
// 	// enemy.zIndex = 6;
// 	// enemy.initialSpeedY = 5;
// 	// enemy.speedY = enemy.initialSpeedY;
// 	// enemy.triggerY = grid * 3;
// 	// enemy.speedDiff = 0.15;
// 	// enemy.type = type;
// 	// game.stage.addChild(enemy);




// 	// if(enemy.y > enemy.triggerY && !enemy.triggered) enemy.triggered = true
// 	// if(enemy.triggered) enemy.speedY -= enemy.speedDiff;
// 	// else enemy.speedY = Math.round(enemy.speedY);
// 	// enemy.y += enemy.speedY;
// 	// const angle = getAngle(enemy, player.data);
// 	// enemy.rotation = angle + Math.PI / 2
// 	// if(Math.ceil(enemy.speedY) == 0 && !enemy.shot) enemies.bulletSpawn.one(enemy);

// // levelOneFirstBulletSpawn = (enemy, type) => {
// // 	enemy.shot = true;
// // 	let angle = false;
// // 	const doBullet = dir => {
// // 		const bullet = PIXI.Sprite.fromImage('img/bullet-blue-big.png');
// // 		bullet.x = enemy.x;
// // 		bullet.y = enemy.y;
// // 		bullet.isEnemyBullet = true;
// // 		bullet.anchor.set(0.5);
// // 		bullet.zIndex = 5;
// // 		bullet.speed = 3.5;
// // 		if(!angle) angle = getAngle(bullet, player.data);
// // 		let tempAngle = angle;
// // 		const angleDiff = 1 / 3;
// // 		if(dir) tempAngle += dir == 'left' ? angleDiff : -angleDiff;
// // 		bullet.speedX = -Math.cos(tempAngle);
// // 		bullet.speedY = -Math.sin(tempAngle);
// // 		bullet.type = type;
// // 		game.stage.addChild(bullet);
// // 	}
// // 	doBullet();
// // 	doBullet('left');
// // 	doBullet('right');
// // },

// // levelOneFirstBulletUpdate = bullet => {
// // 	bullet.x += bullet.speedX * bullet.speed;
// // 	bullet.y += bullet.speedY * bullet.speed;
// // 	if(bullet.speed > 2) bullet.speed -= 0.02;
// // };