const chips = {

	spawn(enemy, isBoss){
		const chip = PIXI.Sprite.fromImage('img/medal.png');
		chip.anchor.set(0.5);
		chip.zIndex = 26;
		chip.x = enemy.x;
		chip.y = enemy.y;
		chip.speedInit = 3.5;
		chip.speed = chip.speedInit;
		chip.speedMod = 0.075;
		chip.flipSpeed = chip.speedInit;
		chip.flipMod = 0.25;
		chip.isChip = true;
		chip.scoreBase = 5;
		chip.score = chip.scoreBase;
		if(isBoss){
			const chipLeft = enemy.x - enemy.width / 2 - grid, chipRight = enemy.x + enemy.width / 2 + grid,
				chipTop = enemy.y - enemy.height / 2 - grid, chipBottom = enemy.y + enemy.height / 2 + grid;
			chip.x = chipLeft + Math.floor(Math.random() * (chipRight - chipLeft))
			chip.y = chipTop + Math.floor(Math.random() * (chipBottom - chipTop))
		}
		game.stage.addChild(chip);
	},

	spawnScore(chip){
		const chipScore = new PIXI.Text(String(chip.score), new PIXI.TextStyle({
			fill: colors.light,
			fontFamily: 'dies',
			fontSize: 16,
			dropShadow: true,
			dropShadowAlpha: 1,
			dropShadowAngle: Math.PI / 2,
			dropShadowDistance: 1,
			dropShadowColor: colors.dark
		}));
		chipScore.anchor.set(0.5);
		chipScore.x = chip.x;
		chipScore.y = chip.y;
		chipScore.zIndex = 300;
		chipScore.isChipScore = true;
		chipScore.clock = 0;
		chipScore.limit = 60;
		game.stage.addChild(chipScore);
	},

	update(chip, i){
		chip.score = Math.floor((winHeight - chip.y) * chip.scoreBase)
		if(chip.flipped && chip.y <= gameY + gameHeight + chip.height / 2){
			const angle = getAngle(chip, player.data);
			chip.x += -Math.cos(angle) * chip.flipSpeed;
			chip.y += -Math.sin(angle) * chip.flipSpeed;
			chip.flipSpeed += chip.flipMod;
		} else {
			chip.y -= chip.speed;
			chip.rotation += 0.05;
			if(chip.speed > chip.speedInit * -1) chip.speed -= chip.speedMod;
			if(chip.y > gameY + gameHeight + chip.height / 2) game.stage.removeChildAt(i);
		}
	},

	updateScore(chipScore, i){
		chipScore.clock++;
		chipScore.y -= 0.75;
		if(chipScore.clock >= chipScore.limit) game.stage.removeChildAt(i);
	}

};