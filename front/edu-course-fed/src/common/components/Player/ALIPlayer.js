import SpeedComponent from '../AliPlayerComponents/RateComponent';
import QualityComponent from '../AliPlayerComponents/QualityComponent';

export default class ALIPlayer {
    constructor(options) {
        this.options = options;
    }

    videoOptions() {
        const { playbackRateMenuButton, vid, playauth, id } = this.options;
        const componentsArr = playbackRateMenuButton ? [{
            name: 'QualityComponent',
            type: QualityComponent
        }, {
            name: 'SpeedComponent',
            type: SpeedComponent
        }] : [{
            name: 'QualityComponent',
            type: QualityComponent
        }];
        return Object.assign({}, {
            'id': 'player-con',
            'autoplay': true,
            'isLive': !playbackRateMenuButton,
            'rePlay': false,
            'playsinline': true,
            'preload': true,
            'controlBarVisibility': 'hover',
            'useH5Prism': true,
            'cover': '',
            'width': '100%',
            'height': '100%',
            components: componentsArr,
            'skinLayout': [
                { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
                { name: 'H5Loading', align: 'cc' },
                { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
                { name: 'tooltip', align: 'blabs', x: 0, y: 56 },
                { name: 'thumbnail' },
                {
 name: 'controlBar', align: 'blabs', x: 0, y: 0,
                    children: [
                        { name: 'progress', align: 'blabs', x: 0, y: 40 },
                        { name: 'playButton', align: 'tl', x: 15, y: 12 },
                        { name: 'volume', align: 'tl', x: 15, y: 10 },
                        { name: 'timeDisplay', align: 'tl', x: 15, y: 4 },
                        { name: 'fullScreenButton', align: 'tr', x: 10, y: 10 }
                    ]
                }
            ]
        }, {
            vid,
            playauth,
            id
        });
    }

    playingButtonStyle() {
        $('.prism-big-play-btn').hide();
        $('.prism-play-btn').addClass('playing');
    }

    pauseButtonStyle() {
        $('.prism-big-play-btn').show();
        $('.prism-play-btn').removeClass('playing');
    }

    getPlayer() {
        let that = this;
        let options = that.videoOptions();
        return new Promise((resolve, reject) => {
            let player = new window.Aliplayer(options);
            player.on('pause', () => {
                this.pauseButtonStyle();
            });
            player.on('play', () => {
                this.playingButtonStyle();
            });
            player.on('click', ({ target }) => {
                if (target.nodeName !== 'VIDEO') {
                    return;
                }
                if (player.getStatus() === 'pause') {
                    player.play();
                } else {
                    player.pause();
                }
            });
            this.initKeyAuth();
            resolve(player);
        });
    }

    initKeyAuth(){
        (function(open) {

            XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

                this.addEventListener("readystatechange", function() {
                    console.log(this.readyState); // this one I changed
                }, false);
                console.log(url)
                if(url.indexOf('/front/course/media/alikey') > -1){
                    this.needHeader = true;
                }
                open.call(this, method, url, async, user, pass);
            };

        })(XMLHttpRequest.prototype.open);

        (function(send) {

            XMLHttpRequest.prototype.send = function(data) {
                // in this case I'm injecting an access token (eg. accessToken) in the request headers before it gets sent
                this.needHeader && this.setRequestHeader('Authorization', window.localStorage.getItem('accessToken'));

                send.call(this, data);
                this.needHeader && (this.needHeader = false)
            };

        })(XMLHttpRequest.prototype.send);
    }

    setCurrentTime(currentTime, player) {
        player.seek && player.seek(currentTime);
    }

    getCurrentTime(player) {
        return player.getCurrentTime();
    }

    getDuration(player) {
        return player.getDuration();
    }

    loadVideo(options, player) {
        player && player.replayByVidAndPlayAuth(options.vid, options.playauth);
    }
    exitFullscreen(player) {
        player.cancelFullScreen();
    }
    replay(player) {
        player.replay();
    }
}
