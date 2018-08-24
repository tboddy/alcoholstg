const background = {

	bgTile: false,

	draw(){

		const container = new PIXI.projection.Container2d();
		container.x = gameX;
		container.y = gameY;
		container.zIndex = 1;

		background.bgTile = new PIXI.projection.TilingSprite2d(new PIXI.Texture.fromImage('img/bg.png'));
		background.bgTile.width = gameWidth;
		background.bgTile.height = gameHeight / 2;
		background.bgTile.x = 0;
		background.bgTile.y = 0;

		const overlay = PIXI.Sprite.fromImage('img/overlay.png')
		overlay.x = gameX;
		overlay.y = gameY;
		overlay.zIndex = 2;

		game.stage.addChild(container);
		container.addChild(background.bgTile);
		game.stage.addChild(overlay);

		const pos = container.toLocal({x: gameX + gameWidth / 2, y: -grid * 10}, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
		pos.y = -pos.y;
		pos.x = -pos.x;
		container.proj.setAxisY(pos, -1);

	},

	update(){
		background.bgTile.tilePosition.y += 1;
	},

	init(){
		background.draw();
		game.ticker.add(background.update);
	}

};