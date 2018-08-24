const enemyOne = opposite => {
	const spawnEnemy = offset => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png'), size = 36;
		enemy.anchor.set(0.5);
		enemy.x = gameX + size / 2;
		enemy.y = gameY - size / 2 - ((size + grid * .75) * (offset));
		if(opposite){
			enemy.x = gameX + gameWidth - size / 2;
			enemy.opposite = true;
		}
		enemy.isEnemy = true;
		enemy.type = 'one';
		enemy.health = 1;
		enemy.score = 1200;
		enemy.speed = {x: 2.75, y: 3.5};
		enemy.angleDiff = 0.01;
		enemy.angle = getAngle(enemy, {x: gameX + gameWidth / 2 + enemy.width / 2, y: gameY + gameHeight + enemy.height / 2});
		game.stage.addChild(enemy);
	};
	spawnEnemy(0);
	spawnEnemy(1);
	spawnEnemy(2);
	spawnEnemy(3);
	spawnEnemy(4);
	spawnEnemy(5);
	spawnEnemy(6);
	spawnEnemy(7);
};

enemies.waves.one = () => {
	enemyOne();
	enemies.nextWave = 'two';
};

enemies.waves.two = () => {
	enemyOne(true);
	enemies.nextWave = 'one';
};

enemies.update.one = enemy => {
	enemy.velocity = {x: -Math.cos(enemy.angle), y: -Math.sin(enemy.angle)};
	enemy.y += enemy.velocity.y * enemy.speed.y;

	enemy.rotation = enemy.opposite ? enemy.angle + Math.PI / 6 * 2 : enemy.angle + Math.PI / 6 * 4;

	if(enemy.y > gameY - enemy.height / 2){
		enemy.x += enemy.velocity.x * enemy.speed.x;
		if(!enemy.flippedA){
			enemy.angle += enemy.opposite ? enemy.angleDiff : -enemy.angleDiff;

			if(enemy.opposite){
				if(enemy.angle > 0 && !enemy.flippedB){
					enemy.percent = (gameX + gameWidth - enemy.x) / gameWidth;
					enemy.flippedA = true;
					enemy.angle = 0;
				}
			} else {
				if(enemy.angle < -Math.PI && !enemy.flippedB){
					enemy.percent = (1 - (gameX + gameWidth - enemy.x) / gameWidth);
					enemy.flippedA = true;
					enemy.angle = -Math.PI;
				}
			}
		} else {
			if(enemy.opposite && enemy.x <= gameX + gameWidth * enemy.percent) enemy.angle -= enemy.angleDiff;
			if(!enemy.opposite && enemy.x >= gameX + gameWidth - gameWidth * enemy.percent) enemy.angle += enemy.angleDiff;
		}
	}
};




	// let count = 0;
	// const spawnEnemy = i => {
	// 	const enemy = PIXI.Sprite.fromImage('img/enemy-one.png'), size = 36;
	// 	enemy.anchor.set(0.5);
	// 	enemy.x = initialX;
	// 	enemy.initialX = initialX;
	// 	enemy.y = (gameY - size / 2) - i * (size + 4);
	// 	enemy.isEnemy = true;
	// 	enemy.type = 'one';
	// 	enemy.speed = 2.75;
	// 	enemy.opposite = opposite;
	// 	enemy.count = count;
	// 	enemy.health = 1;
	// 	enemy.alcohol = true;
	// 	enemy.score = 1000;
	// 	game.stage.addChild(enemy);
	// 	count -= .5;
	// }
	// for(i = 0; i < 8; i++) spawnEnemy(i);



	// levelOneFirstWave(gameX + grid * 8);
	// enemies.nextWave = 'two';


	// levelOneFirstWave(gameX + gameWidth - grid * 8, true);
	// enemies.nextWave = 'three';


	// const iCount = enemy.opposite ? Math.sin(enemy.count) : -Math.sin(enemy.count); 
	// enemy.x = (enemy.initialX + iCount * (grid * 3));
	// const count = 90 / 180 * Math.PI / (grid * 2);
	// enemy.count += count;
	// enemy.y += enemy.speed;
	// enemy.rotation = (enemy.opposite ? -Math.cos(enemy.count) : Math.cos(enemy.count)) / 2