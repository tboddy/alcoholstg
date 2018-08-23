const chips = {

	spawn(enemy){
		const chip = PIXI.Sprite.fromImage('img/medal.png');
		chip.anchor.set(0.5);
		chip.zIndex = 26;
		chip.x = enemy.x;
		chip.y = enemy.y;
		chip.speedInit = 3.5;
		chip.speed = chip.speedInit;
		chip.speedMod = 0.075;
		chip.isChip = true;
		chip.scoreBase = 5;
		chip.score = chip.scoreBase;
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
		chipScore.zIndex = 999;
		chipScore.isChipScore = true;
		chipScore.clock = 0;
		chipScore.limit = 60;
		game.stage.addChild(chipScore);
	},

	update(chip, i){
		chip.score = Math.floor((winHeight - chip.y) * chip.scoreBase)
		chip.y -= chip.speed;
		if(chip.speed > chip.speedInit * -1) chip.speed -= chip.speedMod;
		if(chip.y > gameY + gameHeight + chip.height / 2) game.stage.removeChildAt(i);
	},

	updateScore(chipScore, i){
		chipScore.clock++;
		if(chipScore.clock >= chipScore.limit) game.stage.removeChildAt(i);
	}

};