export default class TCPlayer {
    constructor(options) {
        this.options = options;
    }

    getPlayer() {
        return window.TCPlayer(this.options.id, this.options);
    }

    setCurrentTime(currentTime, player) {
        player.currentTime && player.currentTime(window.parseInt(currentTime));
    }

    getCurrentTime(player) {
        return player.currentTime();
    }

    getDuration(player) {
        return player.duration();
    }

    loadVideo(options, player) {
        player.loadVideoByID && player.loadVideoByID(options);
    }
    exitFullscreen(player) {
        player.exitFullscreen();
    }
    replay(player) {
        player.play();
    }
}
