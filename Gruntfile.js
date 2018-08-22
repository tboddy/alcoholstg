module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			development: {
				src: [
					'src/sound.js',
					'src/global.js',
					'src/controls.js',
					'src/background.js',
					'src/chrome.js',
					'src/explosion.js',
					'src/start.js',
					'src/collision.js',
					'src/chips.js',
					'src/enemies.js',
					'src/enemies/*.js',
					'src/player.js',
					'src/game.js'
				],
				dest: 'game.js'
			}
		},
		watch: {
			files: ['src/*.js', 'src/*/*.js'],
			tasks: ['concat']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'watch']);
};