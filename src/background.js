const background = {

	clock: 0,

	draw(){
		const bgGraphic = new PIXI.Graphics();
		bgGraphic.lineStyle(0);
		bgGraphic.beginFill(0x442434);
		bgGraphic.drawRect(gameX, gameY, gameWidth, gameHeight);
		bgGraphic.endFill();
		bgGraphic.zIndex = 1;
		game.stage.addChild(bgGraphic);
	},

	spawn(){
		const type = Math.floor(Math.random() * 3);
		let img = 'img/star-tiny.png', speed = 1, size = 4, zIndex = 4;
		if(type == 1){
			img = 'img/star-small.png';
			speed *= 2;
			size = 8;
			zIndex = 2;
		} else if(type == 2){
			img = 'img/star-big.png';
			speed *= 4;
			size = 16;
			zIndex = 3;
		}
		const star = PIXI.Sprite.fromImage(img);
		star.anchor.set(0.5);
		star.speed = speed;
		star.y = gameY - size / 2;
		star.x = gameX + Math.floor(Math.random() * gameWidth);
		star.zIndex = zIndex;
		star.isBackground = true;
		game.stage.addChild(star);
	},

	spawnUpdate(){
		if(background.clock % 15 == 0) background.spawn();
		background.clock++;
	},

	update(star, i){
		star.y += star.speed;
		if(star.y > gameY + gameHeight + star.height / 2) game.stage.removeChildAt(i);
	},

	init(){
		background.draw();
		game.ticker.add(background.spawnUpdate);
	}

};

// const starTime = 5;

// const background = {

// 	dump: {},

// 	spawn(){
// 		let size = 4, speed = 10, image = images.starTiny;
// 		const type = Math.floor(Math.random() * 3);
// 		if(type == 1){
// 			size = 8;
// 			speed = 15;
// 			image = images.starSmall;
// 		} else if(type == 2){
// 			size = 16;
// 			speed = 20;
// 			image = images.starBig;
// 		}
// 		const isAlt = Math.floor(Math.random() * 3),
// 		starObj = {
// 			position: {x: Math.floor(Math.random() * gameWidth), y: -size},
// 			speed: speed,
// 			type: type,
// 			image: image,
// 			id: randomId()
// 		};
// 		background.dump[starObj.id] = starObj
// 	},

// 	update(){
// 		const updateStar = star => {
// 			star.position.y += star.speed;
// 			if(star.position.y >= gameHeight) delete background.dump[star.id]
// 		};
// 		for(star in background.dump) updateStar(background.dump[star]);
// 		if(gameClock % starTime == 0) background.spawn();
// 	},

// 	draw(){
// 		const drawStar = star => {
// 			drawImage(star.image, star.position.x, star.position.y);
// 		};
// 		drawRect(0, 0, gameWidth, gameHeight, colors.dark)
// 		for(star in background.dump) drawStar(background.dump[star]);
// 	}

// };