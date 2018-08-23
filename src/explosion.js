const explosions = {

	interval: 4,
	spawnTime: 12,

	spawn(bullet, big, bigger){
		const explosion = PIXI.Sprite.fromImage('img/explosiona.png');
		explosion.textureB = PIXI.Texture.fromImage('img/explosionb.png');
		explosion.textureC = PIXI.Texture.fromImage('img/explosionc.png');
		explosion.textureD = PIXI.Texture.fromImage('img/explosiond.png');
		explosion.textureE = PIXI.Texture.fromImage('img/explosione.png');
		explosion.anchor.set(0.5);
		explosion.x = bullet.x;
		explosion.y = bullet.y;
		explosion.clock = -1;
		explosion.zIndex = 100;
		explosion.isExplosion = true;
		if(big) explosion.scale.set(2);
		else if(bigger) explosion.scale.set(3);
		game.stage.addChild(explosion);
		spawnSound.explosion();
	},

	update(explosion, i){
		explosion.clock++;
		const interval = 3;
		if(explosion.clock == interval) explosion.texture = explosion.textureB;
		else if(explosion.clock == interval * 2) explosion.texture = explosion.textureC;
		else if(explosion.clock == interval * 3) explosion.texture = explosion.textureD;
		else if(explosion.clock == interval * 4) explosion.texture = explosion.textureE;
		else if(explosion.clock == interval * 5) game.stage.removeChildAt(i);
	}

};