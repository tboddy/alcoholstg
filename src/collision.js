const collisionWidth = 11, collisionHeight = 14,

resetSects = () => {
	const sects = [];
	for(i = 0; i < collisionHeight; i++){
		const row = [];
		for(j = 0; j < collisionWidth; j++) row.push({bullet: false, enemy: false, enemyBullet: false});
		sects.push(row)
	};
	return sects;
},

collision = {

	sects: resetSects(),
	size: grid * 2,

	draw(){
		const outlines = new PIXI.Graphics();
		outlines.zIndex = 82;
		outlines.lineStyle(0);
		outlines.beginFill(0x442434);
		for(i = 0; i < collision.sects.length; i++){
			if(i > 0) outlines.drawRect(gameX, gameY - 1 + i * collision.size, gameWidth, 1);
			for(j = 0; j < collision.sects[i].length; j++){
				if(j > 0) outlines.drawRect(gameX + j * collision.size, gameY, 1, gameHeight);
			}
		}
		outlines.endFill();
		game.stage.addChild(outlines);
	},

	placeItem(item, index){


		const doPlace = (item, type) => {
			const x = Math.floor((item.x - gameX) / collision.size),
				y = Math.floor((item.y - gameY) / collision.size);
			if(x >= 0 && y >= 0 && collision.sects[y] && (collision.sects[y][x])){
				collision.sects[y][x][type] = index;
				if(type == 'enemy'){
					const widthDiff = Math.ceil(item.width / collision.size) - 1,
						heightDiff = Math.ceil(item.height / collision.size) - 1;
					if(collision.sects[y][x - 1]) collision.sects[y][x - 1].enemy = index;
					if(collision.sects[y - 1]){
						collision.sects[y - 1][x].enemy = index;
						if(collision.sects[y - 1][x - 1]) collision.sects[y - 1][x - 1].enemy = index;
					}
					if(widthDiff){
						for(i = 0; i < widthDiff; i++){
							if(collision.sects[y][x + i + 1]){
								collision.sects[y][x + i + 1].enemy = index;
								if(collision.sects[y - 1]) collision.sects[y - 1][x + i + 1].enemy = index;
							}
						}
					}
					if(heightDiff){
						for(i = 0; i < heightDiff; i++){
							if(collision.sects[y + i + 1]){
								collision.sects[y + i + 1][x].enemy = index;
								if(collision.sects[y + i + 1][x - 1]) collision.sects[y + i + 1][x - 1].enemy = index;
								if(collision.sects[y + i + 1][x + 1]) collision.sects[y + i + 1][x + 1].enemy = index;
							}
						}
					}
				} else if(type == 'bullet' || type == 'enemyBullet' || type == 'player' || type == 'chip'){
					if(collision.sects[y][x - 1]) collision.sects[y][x - 1][type] = index;
					if(collision.sects[y][x + 1]) collision.sects[y][x + 1][type] = index;
					if(collision.sects[y - 1]){
						collision.sects[y - 1][x][type] = index;
						if(collision.sects[y - 1][x - 1]) collision.sects[y - 1][x - 1][type] = index;
						if(collision.sects[y - 1][x + 1]) collision.sects[y - 1][x + 1][type] = index;
					}
					if(collision.sects[y + 1]){
						collision.sects[y + 1][x][type] = index;
						if(collision.sects[y + 1][x - 1]) collision.sects[y + 1][x - 1][type] = index;
						if(collision.sects[y + 1][x + 1]) collision.sects[y + 1][x + 1][type] = index;
					}
				}
			}
		};

		if(item.isBullet) doPlace(item, 'bullet');
		else if(item.isEnemy) doPlace(item, 'enemy');
		else if(item.isEnemyBullet) doPlace(item, 'enemyBullet');
		else if(item.isPlayer) doPlace(item, 'player');
		else if(item.isChip) doPlace(item, 'chip');
	},

	check(){
		for(i = 0; i < collision.sects.length; i++){
			for(j = 0; j < collision.sects[i].length; j++){
				if(collision.sects[i][j].bullet && collision.sects[i][j].enemy){
					const enemy = game.stage.getChildAt(collision.sects[i][j].enemy), bullet = game.stage.getChildAt(collision.sects[i][j].bullet);
					if(
						bullet.x + bullet.width / 2 >= enemy.x - enemy.width / 2 && bullet.x - bullet.height / 2 <= enemy.x + enemy.width - enemy.width / 2 &&
			      bullet.y + bullet.height / 2 >= enemy.y - enemy.height / 2 && bullet.y - bullet.height / 2 <= enemy.y + enemy.height - enemy.height / 2 &&
						bullet.y - bullet.height / 2 > gameY){
						explosions.spawn(bullet);
						bullet.y = -gameHeight;
						collision.sects[i][j].bullet = false;
						if(enemy.health) enemy.health--;
						else {
							chips.spawn(enemy);
							enemy.y = gameHeight * 2;
							collision.sects[i][j].enemy = false;
							player.data.chain++;
							player.data.chainTime = 0;
							if(enemy.alcohol) player.data.drunk += player.data.drunkDiff;
							if(enemy.score) currentScore += enemy.score * player.data.punk;
							if(bossData){
								PIXI.setTimeout(1, () => {
									bossData = false;
								});
							}
						}
					}
				}
				if(collision.sects[i][j].player){
					if(collision.sects[i][j].enemyBullet && !player.data.invulnerableClock){
						const bullet = game.stage.getChildAt(collision.sects[i][j].enemyBullet);
						if(bullet.x + bullet.width / 2 >= player.hitbox.x - player.hitbox.width / 2 &&
							bullet.x - bullet.height / 2 <= player.hitbox.x + player.hitbox.width / 2 &&
				      bullet.y + bullet.height / 2 >= player.hitbox.y - player.hitbox.height / 2 &&
				      bullet.y - bullet.height / 2 <= player.hitbox.y + player.hitbox.height / 2){
							if(!gameOver) explosions.spawn(bullet, true);
							bullet.y = -gameHeight;
							if(player.data.lives - 1){
								player.data.invulnerableClock = 60 * 3;
								player.data.lives--;
							} else if(!gameOver) {
								gameOver = true;
							}
						}
					}
					if(collision.sects[i][j].enemy && !player.data.invulnerableClock){
						const enemy = game.stage.getChildAt(collision.sects[i][j].enemy);
						if(enemy.x + enemy.width / 2 >= player.hitbox.x - player.hitbox.width / 2 &&
							enemy.x - enemy.height / 2 <= player.hitbox.x + player.hitbox.width / 2 &&
				      enemy.y + enemy.height / 2 >= player.hitbox.y - player.hitbox.height / 2 &&
				      enemy.y - enemy.height / 2 <= player.hitbox.y + player.hitbox.height / 2){
							if(!gameOver) explosions.spawn(enemy, true);
							enemy.y = gameHeight * 2;
							collision.sects[i][j].enemy = false;
							if(player.data.lives - 1){
								player.data.invulnerableClock = 60 * 3;
								player.data.lives--;
							} else if(!gameOver) {
								gameOver = true;
							}
						}
					}
					if(collision.sects[i][j].chip){
						const chip = game.stage.getChildAt(collision.sects[i][j].chip);
						if(chip.x + chip.width / 2 >= player.data.x - player.data.width / 2 &&
							chip.x - chip.height / 2 <= player.data.x + player.data.width / 2 &&
				      chip.y + chip.height / 2 >= player.data.y - player.data.height / 2 &&
				      chip.y - chip.height / 2 <= player.data.y + player.data.height / 2){
							currentScore += chip.score;
							chips.spawnScore(chip);
							chip.y = gameHeight * 2;
							collision.sects[i][j].score = false;
						}
					}
				}
			}
		}
	},

	drawDebug(){
		const highlights = new PIXI.Graphics();
		highlights.zIndex = 81;
		highlights.isCollisionHighlight = true;
		highlights.lineStyle(0);
		highlights.alpha = 0.25;
		for(i = 0; i < collision.sects.length; i++){
			for(j = 0; j < collision.sects[i].length; j++){
				if(collision.sects[i][j].bullet){
					highlights.beginFill(0xd04648);
					highlights.drawRect(gameX + j * collision.size, gameY + i * collision.size, collision.size, collision.size);
					highlights.endFill();
				} else if(collision.sects[i][j].enemyBullet){
					highlights.beginFill(0x597dce);
					highlights.drawRect(gameX + j * collision.size, gameY + i * collision.size, collision.size, collision.size);
					highlights.endFill();
				} else if(collision.sects[i][j].enemy){
					highlights.beginFill(0x6daa2c);
					highlights.drawRect(gameX + j * collision.size, gameY + i * collision.size, collision.size, collision.size);
					highlights.endFill();
				}
			}
		}
		highlights.endFill();
		game.stage.addChild(highlights);
	},

	update(){
		collision.check();
		// collision.drawDebug();
		collision.sects = resetSects();
	},

	init(){
		// collision.draw();
	}

}