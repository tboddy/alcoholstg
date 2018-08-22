const isMuted = true, bgmVol = 0.175, bgmMuted = false;

sounds = {
	bulletOne: new Howl({src: ['sound/bullet1.wav'], volume: .05}),
	bulletTwo: new Howl({src: ['sound/bullet2.wav'], volume: .12}),
	bulletThree: new Howl({src: ['sound/bullet3.wav'], volume: .12}),
	bulletPlayer: new Howl({src: ['sound/explosion.wav'], volume: .2}),
	explosion: new Howl({src: ['sound/explosion.wav'], volume: .2}),
	graze: new Howl({src: ['sound/graze.wav'], volume: 0.1}),
	bgmOne: new Howl({src: ['sound/bgm-01.mp3'], volume: bgmVol}),
	bgmTwo: new Howl({src: ['sound/bgm-02.mp3'], loop: true, volume: bgmVol}),
	bgmThree: new Howl({src: ['sound/bgm-03.mp3'], loop: true, volume: bgmVol}),
	bgmFour: new Howl({src: ['sound/bgm-04.mp3'], loop: true, volume: bgmVol})
};

if(isMuted){
	for(soundName in sounds){
		sounds[soundName].volume(0);
	};
}

const clearBullets = () => {
	if(sounds.bulletOne.playing()) sounds.bulletOne.stop();
	if(sounds.bulletTwo.playing()) sounds.bulletTwo.stop();
	if(sounds.bulletThree.playing()) sounds.bulletThree.stop();
},

clearBgm = () => {
	if(sounds.bgmOne.playing()) sounds.bgmOne.stop();
	if(sounds.bgmTwo.playing()) sounds.bgmTwo.stop();
	if(sounds.bgmThree.playing()) sounds.bgmThree.stop();
	if(sounds.bgmFour.playing()) sounds.bgmFour.stop();
};

spawnSound = {

	bulletOne(){
		clearBullets()
		sounds.bulletOne.play();
	},

	bulletTwo(){
		clearBullets()
		sounds.bulletTwo.play();
	},

	bulletThree(){
		clearBullets();
		sounds.bulletThree.play();
	},

	explosion(){
		if(sounds.bulletPlayer.playing()) sounds.bulletPlayer.stop();
		if(sounds.explosion.playing()) sounds.explosion.stop();
		sounds.explosion.play();
	},

	graze(){
		if(sounds.graze.playing()) sounds.graze.stop();
		sounds.graze.play();
	},

	bulletPlayer(){
		if(sounds.bulletPlayer.playing()) sounds.bulletPlayer.stop();
		sounds.bulletPlayer.play();
	},

	bgmOne(){
		clearBgm();
		if(!bgmMuted) sounds.bgmOne.play();
	},

	bgmTwo(){
		clearBgm();
		if(!bgmMuted) sounds.bgmTwo.play();
	},

	bgmThree(){
		clearBgm();
		if(!bgmMuted) sounds.bgmThree.play();
	},

	bgmFour(){
		clearBgm();
		if(!bgmMuted) sounds.bgmFour.play();
	},

}