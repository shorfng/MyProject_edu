<template>
    <div
        id="player-video-vontainer"
        class="player-container"
    >
        <video
            v-if="isTCPlayer"
            id="tcPlayer"
            ref="tcPlayer"
            class="tc-player-container"
            preload="auto"
            playsinline
            webkit-playsinline
            x5-playsinline
        />
        <div
            v-else
            id="aliPlayer"
            class="ali-player-container"
        />
    </div>
</template>

<script>
import Player from './Player';
import { fetchVideoPlayInfo, fetchWatermarkInfo, reportDelete } from '@/common/service/getAliPlayerAuth.js';
import addStyleJs from '@/common/js/util/addStyleJS.js';
import { isApp } from '@/common/js/userAgent/getVersion';
import { OSName } from '@/common/js/userAgent/browser-name-and-OS';
export default {
    name: 'VideoPlayer',
    props: {
        // fileId
        // appId
        // lessonId
        // isTCPlayer
        videoConfig: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            isFirstCanPlay: true,
            player: null,
            isTCPlayer: false,
            lastTime: 0,
            watermarkTimer: null,
            watermarkText: 'kaiwu.lagou.com',
            sourceDom: null,
            isFullScreen: false,
            linstenDeleteDomTimer: null,
            showWatermarkInterval: 180000,
            isDeleteingDom: false,
            firstPlayNotUseWatermark: true,
            firstPlayNotUseWatermarkTimer: null,
            plantSource: OSName,
            isPause: false,
            previous: 0,
            isEnd: false
        };
    },
    computed: {
        playbackRateMenuButton() {
            const { controlBar = {} } = this.videoConfig;
            if (controlBar.playbackRateMenuButton === 'undefined') {
                return true;
            } else {
                return controlBar.playbackRateMenuButton;
            }
        },
    },
    watch: {
        videoConfig: {
            handler(val, old) {
                this.initVideo();
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        //水印
        // this.getWatermarkInfo();
        // this.initVideo();
    },
    mounted() {
        isApp() && this.listenerVisibility();
        this.linstenDeleteDom();
        this.isPc && this.enterKeyup();
    },
    destroyed() {
        this.deleteLinstenDeleteDom();
        this.isPc && this.enterKeyupDestroyed();
        this.cancleWatermark();
        this.endListenDeleteDom();
        this.cleanFirstPlayNotUseWatermarkTimer();
        isApp() && document.body.removeEventListener('visibilitychange', this.autoPlayOrPause);
        try {
            this.player.dispose();
        } catch (e) {
            console.log(e);
        }
    },
    methods: {
        initVideo() {
            addStyleJs([
                'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js',
                'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css'
            ], () => {
                this.getPlayAuth().then(({playAuth, fileId}) => {
                    this.initPlayer({
                        vid: fileId, //aliplayer 参数
                        playauth: playAuth, //aliplayer 参数
                        id: 'aliPlayer',    // 播放器外层容器的dom元素id
                        playbackRateMenuButton: this.playbackRateMenuButton
                     });
                });
            });
        },
        getPlayAuth() {
            return new Promise((resolve, reject) => {
                this.videoConfig && this.videoConfig.lessonId && fetchVideoPlayInfo(this.videoConfig).then(res => {
                    let content = res.data.content;
                    resolve(content && content);
                }).catch(e => {
                    reject(e.message);
                });
            });
        },
        initPlayer(options) {
            console.log('common video initPlayer+++++++', this.player);
            console.log('common video options+++++++', options);
            if (this.player) {
                this.player.loadVideo(options);
                this.isFirstCanPlay = true;
                return;
            }
            this.player = new Player(options, this.isTCPlayer);
            this.$emit('setPlayer', this.player);
            this.player.getPlayer().then(player => {
                player.on('canplay', () => {
                    this.isFirstCanPlay && this.$emit('canplay');
                    this.isFirstCanPlay = false;
                    this.setRateEvent();
                    console.log('canplay');
                });
                player.on('play', () => {
                    this.isPause = false;
                    this.isEnd = false;
                    this.$emit('play');
                    console.log('play');
                    if (window.courseInfo && window.courseInfo.courseType && this.plantSource === 'iOS') return;
                });
                player.on('timeupdate', () => {
                    this.$emit('timeupdate');
                });
                player.on('pause', () => {
                    this.isPause = true;
                    this.$emit('pause');
                    this.cancleWatermark();
                });
                player.on('ended', () => {
                    this.isEnd = true;
                    this.cancleWatermark();
                    this.$emit('ended');
                });
                player.on('error', (e) => {
                    this.cancleWatermark();
                    this.$emit('error', e);
                });
                player.on('fullscreenchange', (e) => {
                    this.isFullScreen = !this.isFullScreen;
                    console.log('fullscreenchange', e);
                });

            });
        },
        setRateEvent() {
            let video = document.getElementsByTagName('video');
            if (!video) return;
            let v = video[0];
            if (!v || !sessionStorage || !sessionStorage.getItem) return;
            let rate = sessionStorage.getItem('videoRate');
            if (rate) {
                v.playbackRate = rate;
            }
        },
        listenerVisibility() {
            document.addEventListener('visibilitychange', this.autoPlayOrPause);
        },
        autoPlayOrPause() {
            if (!this.player) return;
            if (document.visibilityState === 'hidden') {
                try {
                    this.player.pause();
                }
                catch (err) {
                    console.log(err);
                }
            }
            else if (document.visibilityState === 'visible') {
                try {
                    this.player.play();
                }
                catch (err) {
                    console.log(err);
                }
            }
        },
        addWatermark() {
            let contentDom = this.sourceDom;
            let deleteDom = contentDom.querySelectorAll('.watermark-dom-template');
            if (deleteDom.length > 0) {
                this.isDeleteingDom = true;
                for (let i = 0; i < deleteDom.length; i++) {
                    if (deleteDom[i] != null) { deleteDom[i].parentNode.removeChild(deleteDom[i]) }
                }
            }
            setTimeout(() => {
                 this.isDeleteingDom = false;
            }, 200);
            let template = document.createElement('div');
            let domHeight = contentDom.offsetHeight;
            console.log('domHeight', domHeight);
            let textDom = document.createElement('div');
            template.className = 'watermark-dom-template';
            textDom.className = 'video-watermark-source-text';
            template.setAttribute('style', 'position: absolute;z-index: 9999;width: 100%;overflow: hidden;height:30px');
            template.style.top = `${this.calculateHeight(domHeight)}px`;
            if (this.isPc) {
                textDom.setAttribute('style', 'text-align:right;position: relative;right: 0;transition: all 8s linear;font-size:14px;color:#CCCCCC');
            }
            else {
                if (this.isFullScreen) {
                     textDom.setAttribute('style', 'text-align:right;position: relative;right: 0;transition: all 8s linear;font-size:12px;color:#CCCCCC');
                }
                else {
                    textDom.setAttribute('style', 'text-align:right;position: relative;right: 0;transition: all 4s linear;font-size:.32rem;color:#CCCCCC');
                }

            }
            textDom.innerHTML = this.watermarkText;
            template.appendChild(textDom);

            contentDom.querySelector('video')
            &&
            contentDom.querySelector('video').parentNode
            &&
            contentDom.querySelector('video').parentNode.appendChild(template);
            setTimeout(() => {
                textDom.style.right = '100%';
            }, 200);
            let rendomTime = this.showWatermarkInterval - Math.floor((Math.random() * 60)) * 1000;
            console.log('rendomTime', rendomTime);
            this.watermarkTimer = setTimeout(() => {
                this.addWatermark();
            }, rendomTime);
            console.log('rendomTime success', rendomTime);
        },
        calculateHeight(size) {
            let stage = 10;
            return size && Math.floor((size / stage) * (Math.random() * 6)) || 10;
        },
        cancleWatermark() {
            clearTimeout(this.watermarkTimer);
        },
        getWatermarkInfo() {
            fetchWatermarkInfo().then(res => {
                let { content } = res.data;
                content = content || {};
                this.watermarkText = content.waterMark || '';
                this.showWatermarkInterval = content.intervalTime * 1000 || 180000;
            });
        },
        setSourceDom() {
            let fullScreenButton = document.querySelector('.vjs-fullscreen-control.vjs-control.vjs-button');
            this.sourceDom = document.querySelector('#player-video-vontainer');
            if (fullScreenButton && !this.isApp && !this.isPc && this.plantSource === 'iOS') {
                fullScreenButton.setAttribute('style', 'display:none');
            }
        },
        listenDeleteDom() {
            let deleteDom = this.sourceDom.querySelectorAll('.video-watermark-source-text');
            if (deleteDom.length === 0) {
                this.cancleWatermark();
                this.addWatermark();
            }
        },
        startListenDeleteDom() {
            this.linstenDeleteDomTimer = setInterval(() => {
                this.listenDeleteDom();
            }, 1000);
        },
        endListenDeleteDom() {
            clearInterval(this.linstenDeleteDomTimer);
        },
        reportRemove(e) {
            if (
                e.target
                &&
                e.target.className
                &&
                (
                    e.target.className === 'watermark-dom-template'
                    ||
                    e.target.className === 'video-watermark-source-text'
                )
                && !this.isDeleteingDom
            ) {
                console.log('this.isDeleteingDom', this.isDeleteingDom);
                let { id = 0 } = this.$router.history.current.query;
                reportDelete(id);
            }
        },
        linstenDeleteDom() {
            document.body.addEventListener('DOMNodeRemoved', this.reportRemove);
        },
        deleteLinstenDeleteDom() {
            document.body.removeEventListener('DOMNodeRemoved', this.reportRemove);
        },
        cleanFirstPlayNotUseWatermarkTimer() {
            clearTimeout(this.firstPlayNotUseWatermarkTimer);
        },
        enterKeyupDestroyed() {
            this.previous = 0;
            document.removeEventListener('keydown', this.directionKey);
            document.removeEventListener('keyup', this.spaceKey);
        },
        enterKeyup() {
            document.addEventListener('keydown', this.directionKey);
            document.addEventListener('keyup', this.spaceKey);
        },
        directionKey(event) {
            if (event.target.nodeName == 'TEXTAREA' || event.target.nodeName == 'INPUT') {
                return;
            }
            if ((event.keyCode === 37 || event.keyCode === 39) && this.playbackRateMenuButton) {
                let now = Number(new Date());
                if (now - this.previous > 500) {
                    let tcPlayerContainer = document.querySelector('.tc-player-container');
                    if (tcPlayerContainer) {
                        tcPlayerContainer.classList.remove('vjs-user-inactive');
                        tcPlayerContainer.classList.add('vjs-user-active');
                    }
                    let getCurrentTime = this.player.getCurrentTime();
                    let setCurrentTime = event.keyCode === 37 ? getCurrentTime - 15 : getCurrentTime + 15;
                    this.player.setCurrentTime(setCurrentTime);
                    this.previous = now;
                }
            } else if (event.keyCode === 32) {
                event.preventDefault();
            }
        },
        spaceKey(event) {
            if (event.keyCode === 32) {
                this.isPause ? this.player.play() : this.player.pause();
            } else if ((event.keyCode === 37 || event.keyCode === 39) && this.playbackRateMenuButton) {
                setTimeout(() => {
                    let tcPlayerContainer = document.querySelector('.tc-player-container');
                    if (tcPlayerContainer) {
                        tcPlayerContainer.classList.remove('vjs-user-active');
                        tcPlayerContainer.classList.add('vjs-user-inactive');
                    }
                }, 2000);
            }
        },
    }
};
</script>

<style lang="less">
    .player-container {
        height: 100%;
    }
    .vjs-poster {
        background-color: #ffffff;
    }
    .tcp-skin {
        .vjs-volume-panel .vjs-volume-level {
            background-color: #00b38a;
        }
        .vjs-play-progress {
            background-color: #00b38a;
        }
        .vjs-big-play-button .vjs-button-icon .draw-fill {
            fill: #00000057;
        }
        .vjs-big-play-button:hover .vjs-button-icon .draw-fill {
            fill: #00b38a;
        }
    }
    .vjs-progress-control.vjs-control {
        outline: none;
    }
    .video-js .vjs-load-progress {
        background-color: #00b38a;
        opacity: 0.5;
    }
    .video-js .vjs-slider {
        background: rgba(256, 256, 256, 0.3);
    }
    .tc-player-container {
        width: 100%;
        height: 100%;
        background: #ffffff;
    }

    .ali-player-container {
        video {
            background: #000;
        }
        .prism-animation {
            display: none;
        }
        .prism-liveshift-progress .prism-progress-played, .prism-progress .prism-progress-played{
            background-color: #00b38a;
        }
        .prism-liveshift-progress .prism-progress-loaded, .prism-progress .prism-progress-loaded{
            background: rgba(115, 133, 159, 0.75);
        }
        .prism-liveshift-progress .prism-progress-marker, .prism-progress .prism-progress-marker{
            background: rgba(256, 256, 256, 0.3);
        }
        .prism-liveshift-progress, .prism-progress{
            bottom: 36PX !important;
        }
        .prism-volume-control .volume-value{
            background: #00b38a;
        }
        .prism-controlbar{
            height: 40PX;
        }
        .prism-play-btn{
            width: 20PX;
            height: 20PX;
        }
        .prism-controlbar .prism-controlbar-bg{
            height: 36PX;
            background: rgba(75, 75, 75, 0.3);
        }
        .prism-fullscreen-btn{
            margin-left: 16PX;
        }
        .prism-big-play-btn{
            background-image:url('../../../assets/pc-detail/play-btn.png')!important;
            height: 48PX;
            width: 68PX;
            left: 50%!important;
            top: 50%;
            margin-left: -34PX;
            margin-top: -24PX;
            font-size: 10PX;
            border: 0;
            opacity: 1;
            z-index: 999;
            &:hover{
                background-image:url('../../../assets/pc-detail/play-btn-green.png')!important;
            }
            .outter{
                display: none;
            }
        }
        .prism-setting-selector ul li.current{
            color: #00b38a;
        }
        .prism-setting-selector ul li.current:before{
            border-left-color: #00b38a;
        }
        .prism-big-play-btn:hover .vjs-button-icon .draw-fill {
            fill: #00b38a;
        }
        .prism-info-display span{
            color: #00b38a;
        }
        .prism-loading .circle{
            border-color: rgba(0, 179, 138, 0.51) rgba(0, 179, 138, 0.5) rgba(0, 179, 138, 0.7) rgba(0, 179, 138, 0.1);
        }
        .prism-time-display{
            height: 36PX;
            line-height: 36PX;
        }
        .prism-volume-control{
            left: 32PX!important;
        }
        .prism-volume{
            transform: scale(0.7);
            margin-top: 8PX !important;
        }
    }
</style>
