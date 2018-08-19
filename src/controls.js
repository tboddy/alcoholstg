let isFullscreen = false;

const toggleFullscreen = () => {
	if(isFullscreen){
		mainWindow.setFullScreen(false);
		isFullscreen = false;
	} else {
		mainWindow.setFullScreen(true);
		isFullscreen = true;
	}
},

mapControls = () => {
	const keysDown = e => {
		switch(e.which){
			case 38: if(!starting) player.data.moving.up = true; break;
			case 40: if(!starting) player.data.moving.down = true; break;
			case 37: if(!starting) player.data.moving.left = true; break;
			case 39: if(!starting) player.data.moving.right = true; break;
			case 90:
				if(starting) gameInit();
				else player.data.shooting = true;
				break;
			case 88: if(!starting) player.data.slow = true; break;
		}
	}, keysUp = e => {
		switch(e.which){
			case 38: if(!starting) player.data.moving.up = false; break;
			case 40: if(!starting) player.data.moving.down = false; break;
			case 37: if(!starting) player.data.moving.left = false; break;
			case 39: if(!starting) player.data.moving.right = false; break;
			case 90: if(!starting) player.data.shooting = false; break;
			case 88: if(!starting) player.data.slow = false; break;
			case 70: toggleFullscreen(); break;
			case 82: if(!starting) location.reload(); break;
		}
	};
	document.addEventListener('keydown', keysDown);
	document.addEventListener('keyup', keysUp);
};