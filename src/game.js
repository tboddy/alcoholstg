let lastEnemyCount = 0, enemyCount = 0, bulletCount = 0;

const mainLoop = () => {
	enemyCount = 0;
	bulletCount = 0;

	game.stage.children.forEach((child, i) => {
		if(child.isBullet){
			player.updateBullet(child, i);
			collision.placeItem(child, i);
			bulletCount++;
		} else if(child.isEnemy){
			enemies.update[child.type](child, i);
			enemies.mainUpdate(child, i);
			collision.placeItem(child, i);
			enemyCount++;
		} else if(child.isEnemyBullet){
			enemies.bulletUpdate[child.type](child, i);
			enemies.mainBulletUpdate(child, i);
			bulletCount++;
			// collision.placeItem(child, i);
		} else if(child.isFps) chrome.updateFps(child);
		else if(child.isDrunk) chrome.updateDrunk(child);
		else if(child.isScore) chrome.updateScore(child);
		else if(child.isPunk) chrome.updatePunk(child);
		else if(child.isBackground) background.update(child, i);
		else if(child.isDebug) chrome.updateDebug(child);
		else if(child.isCollisionHighlight) game.stage.removeChildAt(i);
	});
	collision.update();

	if(enemyCount == 0 && lastEnemyCount == 0 && !bossData) enemies.init();
	lastEnemyCount = enemyCount;

	if(gameOver && !drewGameOver){
		chrome.drawGameOver();
	}

	sortZIndex();
},

init = () => {


	PIXI.loader.add('crass', 'crass.xml').load(data => {
		document.body.appendChild(game.view);
		mapControls();
		background.init();
		player.init();
		collision.init();
		chrome.init();
		game.ticker.add(mainLoop);
	});
};

setTimeout(init, 100);