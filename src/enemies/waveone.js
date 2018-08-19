const levelOneFirstWave = (initialX, opposite) => {
	let count = 0;
	const spawnEnemy = i => {
		const enemy = PIXI.Sprite.fromImage('img/enemy-one.png'), size = 36;
		enemy.anchor.set(0.5);
		enemy.x = initialX;
		enemy.initialX = initialX;
		enemy.y = (gameY - size / 2) - i * (size + 4);
		enemy.isEnemy = true;
		enemy.type = 'one';
		enemy.speed = 2.75;
		enemy.opposite = opposite;
		enemy.count = count;
		enemy.health = 1;
		enemy.alcohol = true;
		enemy.score = 1000;
		game.stage.addChild(enemy);
		count -= .5;
	}
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