import TCPlayer from './TCPlayer';
import ALIPlayer from './ALIPlayer';

export default class Player {
    constructor(options, isTCPlayer) {
        this.player = null;
        console.log('constructor', options, isTCPlayer);
        this.options = options || {};
        this.isTCPlayer = isTCPlayer;
        this.playerInstance = null;
    }

    getDefaultOptions() {
        return {
            width: '100%',
            height: '100%'
        };
    }

    getPlayer() {
        if (this.player) {
            return Promise.resolve(this.player);
        }
        let options = Object.assign({}, this.getDefaultOptions(), this.options);
        if (this.isTCPlayer) {
            this.playerInstance = new TCPlayer(options);
            this.player = this.playerInstance.getPlayer();
            return Promise.resolve(this.player);
        }
        else {
            this.playerInstance = new ALIPlayer(options);
            return this.playerInstance.getPlayer().then(player => {
                this.player = player;
                return player;
            });
        }
    }

    getCurrentTime() {
        return this.playerInstance.getCurrentTime(this.player);
    }

    getDuration() {
        return this.playerInstance.getDuration(this.player);
    }

    setCurrentTime(currentTime) {
        this.playerInstance.setCurrentTime(currentTime, this.player);
    }

    loadVideo(options) {
        this.getPlayer().then(player => {
            this.playerInstance.loadVideo(options, player);
        });
    }
    exitFullscreen() {
        this.playerInstance.exitFullscreen(this.player);
    }
    replay() {
        this.playerInstance.replay(this.player);
    }
    pause() {
        this.player && this.player.pause();
    }
    play() {
        this.player && this.player.play();
    }
    dispose() {
        this.player && this.player.dispose();
    }
}
