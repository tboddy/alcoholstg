const sounds = {

	muted: true,
	volume: 1,

	list: {
		enemyDeath: new Howl({src: ['sound/enemydeath.wav']}),
		playerShot: new Howl({src: ['sound/playerbullet.wav']}),
	},

	spawn: {
		enemyDeath(){
			if(sounds.list.enemyDeath.playing()) sounds.list.enemyDeath.stop();
			sounds.list.enemyDeath.play();
		},
		playerShot(){
			if(sounds.list.playerShot.playing()) sounds.list.playerShot.stop();
			sounds.list.playerShot.play();
		}
	},

	init(){
		const level = sounds.muted ? 0 : sounds.volume;
		for(sound in sounds.list){
			sounds.list[sound].volume(level)
		};
	}

};