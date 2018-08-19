const explosions = {

	interval: 4,
	spawnTime: 12,
	spawnClock: 0,
	size: 32,

	spawn(bullet, big){
			const explosion = PIXI.Sprite.fromImage('img/explosiona.png');
			explosion.textureB = PIXI.Texture.fromImage('img/explosionb.png');
			explosion.textureC = PIXI.Texture.fromImage('img/explosionc.png');
			explosion.textureD = PIXI.Texture.fromImage('img/explosiond.png');
			explosion.textureE = PIXI.Texture.fromImage('img/explosione.png');
			explosion.anchor.set(0.5);
			explosion.height = explosions.size;
			explosion.width = explosions.size;
			explosion.x = bullet.x;
			explosion.y = bullet.y;
			explosion.clock = -1;
			explosion.zIndex = 100;
			explosion.isExplosion = true;
			explosion.scale.set(big ? 3 : 2);
			if(big) explosion.big = true;
			game.stage.addChild(explosion);

			explosions.spawnClock = 1;
			spawnSound.explosion();
	},

	updateExplosion(explosion, i){
		explosion.clock++;
		const interval = explosion.big ? 5 : 3;
		if(explosion.clock == interval) explosion.texture = explosion.textureB;
		else if(explosion.clock == interval * 2) explosion.texture = explosion.textureC;
		else if(explosion.clock == interval * 3) explosion.texture = explosion.textureD;
		else if(explosion.clock == interval * 4) explosion.texture = explosion.textureE;
		else if(explosion.clock == interval * 5) game.stage.removeChildAt(i);
	}

};