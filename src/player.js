const player = {

	data: PIXI.Sprite.fromImage('img/player.png'),
	hitbox: new PIXI.Graphics(),
	
	floatOffset: grid * 2.5,

	spawnBullet(type){

		const bullet = PIXI.Sprite.fromImage('img/bullet.png');
		bullet.speedY = 20;
		bullet.anchor.set(0.5);
		bullet.x = player.data.x;
		bullet.initialY = player.data.y - 8;
		bullet.y = bullet.initialY;
		bullet.isBullet = true;
		bullet.zIndex = 20;
		bullet.alpha = 0;
		if(type){
			bullet.type = type;
			let diffA = grid * 3, angle;
			const speedX = 20, diffB = diffA * 2, diffC = diffA * 3, diffD = diffA * 4 + 2,
				xOffsetA = 3, xOffsetB = 6, xOffsetC = 9, xOffsetD = 12,
				yOffsetA = 1, yOffsetB = 2, yOffsetC = 4, yOffsetD = 6;
			switch(type){
				case 'leftA':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffA, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 19;
					break;
				case 'rightA':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffA, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 19;
					break;
					break;
				case 'leftB':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffB, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 18;
					break;
				case 'rightB':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffB, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 18;
					break;
					break;
				case 'leftC':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffC, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 17;
					break;
				case 'rightC':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffC, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 17;
					break;
				case 'leftD':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffD, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = -Math.cos(angle) * speedX;
					bullet.rotation = -Math.cos(angle);
					bullet.zIndex = 16;
					break;
				case 'rightD':
					angle = getAngle(
						{x: player.data.x, y: player.data.y, width: player.data.width, height: player.data.height},
						{x: player.data.x - diffD, y: player.data.y - gameHeight, width: grid, height: grid}
					);
					bullet.speedX = Math.cos(angle) * speedX;
					bullet.rotation = Math.cos(angle);
					bullet.zIndex = 16;
					break;
			}
			bullet.speedY *= Math.sin(angle);
		}
		game.stage.addChild(bullet);
	},

	update(){

		const move = () => {
			let speed = player.data.speed;
			if(player.data.slow) speed = speed / 3;
			if(player.data.moving.left){
				player.data.skew.y = -player.data.skewOffset;
				player.data.x -= speed;
				player.hitbox.x -= speed;
			} else if(player.data.moving.right){
				player.data.skew.y = player.data.skewOffset;
				player.data.x += speed;
				player.hitbox.x += speed;
			} else if(player.data.skew.y != 0) player.data.skew.y = 0;

			if(player.data.moving.up){
				player.data.y -= speed;
				player.hitbox.y -= speed;
			} else if(player.data.moving.down){
				player.data.y += speed;
				player.hitbox.y += speed;
			}
			if(player.data.x < player.data.width / 2 + gameX){
				player.data.x = player.data.width / 2 + gameX;
				player.hitbox.x = player.data.x - 2;
			} else if(player.data.x > gameWidth - player.data.width / 2 + gameX){
				player.data.x = gameWidth - player.data.width / 2 + gameX;
				player.hitbox.x = player.data.x - 2;
			}
			if(player.data.y < player.data.height / 2 + gameY){
				player.data.y = player.data.height / 2 + gameY;
				player.hitbox.y = player.data.y - 4;
			} else if(player.data.y > gameHeight - player.data.height / 2 + gameY){
				player.data.y = gameHeight - player.data.height / 2 + gameY;
				player.hitbox.y = player.data.y - 4;
			}
		},
		shoot = () => {
			if(player.data.shooting){
				if(player.data.shotInterval != player.data.shotIntervalInit) player.data.shotInterval = player.data.shotIntervalInit;
				if((player.data.shotClock % player.data.shotInterval == 0) || !player.data.shotInterval){
					player.spawnBullet();
					if(player.data.drunk >= 25){
						player.spawnBullet('leftA');
						player.spawnBullet('rightA');
					}
					if(player.data.drunk >= 50){
						player.spawnBullet('leftB');
						player.spawnBullet('rightB');
					}
					if(player.data.drunk >= 75){
						player.spawnBullet('leftC');
						player.spawnBullet('rightC');
					}
					if(player.data.drunk >= 100){
						player.spawnBullet('leftD');
						player.spawnBullet('rightD');
					}
					// spawnSound.bulletPlayer();
					sounds.spawn.playerShot();
				}
				player.data.shotClock++;
			} else if(player.data.shotClock) player.data.shotClock = 0;
		},
		die = () => {
			if(player.data.invulnerableClock > 0){
				if(!player.removed){
					player.removed = true;
					player.data.x = gameWidth / 2 + gameX;
					player.data.y = gameHeight - grid * 3 + gameY;
					player.hitbox.x = player.data.x - 2;
					player.hitbox.y = player.data.y - 4;
					player.data.drunk -= 25;
					if(player.data.drunk < 0) player.data.drunk = 0;
				}
				const interval = grid * 2;
				if(player.data.invulnerableClock % interval < interval / 2) player.data.alpha = 0;
				else if(!player.data.alpha) player.data.alpha = 1;
				player.data.invulnerableClock--;
			} else {
				if(!player.data.alpha) player.data.alpha = 1;
				if(player.removed) player.removed = false;
			}
		};
		if(gameOver){
			if(wonGame){
				player.data.y -= player.data.speed;
				player.data.speed += 0.15;
			} else if(player.data.alpha) player.data.alpha = 0;
		} else {
			move();
			shoot();
			die();
		}
	},

	updateBullet(bullet, i){
		if(bullet.y != bullet.initialY && bullet.alpha != 1) bullet.alpha = 1;
		bullet.y -= bullet.speedY;
		if(bullet.speedX) bullet.x += bullet.speedX;
		if(bullet.y < -bullet.height){
			game.stage.removeChildAt(i);
			return false;
		}
		if(bullet.lastY && (bullet.lastY == bullet.y)){
			game.stage.removeChildAt(i);
			return false;
		}
		bullet.lastY = bullet.y;
	},

	init(){
		const drawPlayer = () => {
			player.data.moving = {up: false, down: false, left: false, right: false};
			player.data.moved = {up: false, down: false, left: false, right: false};
			player.data.speed = 4.25;
			player.data.shooting = false;
			player.data.shotClock = 0;
			player.data.shotIntervalInit = 8;
			player.data.shotInterval = player.data.shotIntervalInit;
			player.data.drunk = 0;
			player.data.drunkDiff = 1;
			player.data.anchor.set(0.5);
			player.data.x = gameWidth / 2 + gameX;
			player.data.y = gameHeight - grid * 3 + gameY;
			player.data.zIndex = 21;
			player.data.lives = 3;
			player.data.bombs = 2;
			player.data.skewOffset = 0.1;
			player.data.chain = 0;
			player.data.chainTime = 0;
			player.data.chainLimit = 60 * 1.5;
			player.data.punk = 1;
			player.data.invulnerableClock = 0;
			game.stage.addChild(player.data);
		},
		drawHitbox = () => {
			const size = 3;
			player.data.anchor.set(0.5);
			player.hitbox.zIndex = 9999;
			player.hitbox.lineStyle(0);
			player.hitbox.beginFill(0xdad45e);
			player.hitbox.drawRect(0, 0, size, size);
			player.hitbox.endFill();
			player.hitbox.x = player.data.x - 1;
			player.hitbox.y = player.data.y - 4;
			player.hitbox.alpha = 0;
			player.data.isPlayer = true;
			game.stage.addChild(player.hitbox);
		};

		drawPlayer();
		drawHitbox();

		game.ticker.add(player.update);
	}

};



// ended up not liking the float for this game, but at least it's in now
// floatLeft: PIXI.Sprite.fromImage('img/player-float-left.png'),
// floatRight: PIXI.Sprite.fromImage('img/player-float-left.png'),

// player.floatLeft.x = player.data.x - player.floatOffset; 
// player.floatLeft.y = player.data.y;
// player.floatRight.x = player.data.x + player.floatOffset; 
// player.floatRight.y = player.data.y;


// player.floatLeft.anchor.set(0.5);
// player.floatLeft.x = player.data.x - player.floatOffset;
// player.floatLeft.y = player.data.y;
// player.floatLeft.zIndex = 21;
// game.stage.addChild(player.floatLeft);

// player.floatRight.anchor.set(0.5);
// player.floatRight.x = player.data.x + player.floatOffset;
// player.floatRight.y = player.data.y;
// player.floatRight.zIndex = 21;
// game.stage.addChild(player.floatRight);