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

	update(chip, i){
		chip.score = Math.floor((winHeight - chip.y) * chip.scoreBase)
		chip.y -= chip.speed;
		if(chip.speed > chip.speedInit * -1) chip.speed -= chip.speedMod;
		if(chip.y > gameY + gameHeight + chip.height / 2) game.stage.removeChildAt(i);
	}

};