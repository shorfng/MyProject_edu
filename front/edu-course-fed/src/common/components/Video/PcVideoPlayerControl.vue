<template>
    <div>
        <div
            id="pcControl"
            class="vjs-control-pc"
        >
            <div
                id="pc-control-prev"
                class="pc-control-prev"
            >
                <span
                    class="pc-control-prev-img"
                    @click.stop="handleClick('prev')"
                />
                <span class="prev-title">上一节</span>
            </div>
            <div
                id="pc-control-next"
                class="pc-control-next"
            >
                <span
                    class="pc-control-next-img"
                    @click.stop="handleClick('next')"
                />
                <span class="next-title">下一节</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PcVideoPlayerControl',
    props: {
        nextLessonId: {
            type: Number,
            default: null
        },
    },
    data() {
        return {
            isNeedAppendDOM: true
        };
    },
    watch: {
    },
    mounted() {
        this.initDom();
    },
    methods: {
        // 初始化 DOM 和 style
        initDom() {
            setTimeout(() => {
                let vjsControlBarDOM = document.getElementsByClassName('vjs-control-bar')[0];
                if (!vjsControlBarDOM) return;
                let vjsControlBarPlayerDOM = vjsControlBarDOM.getElementsByClassName('vjs-play-control')[0];
                let vjsVolumePanel = vjsControlBarDOM.getElementsByClassName('vjs-volume-panel')[0];
                let vjsPlaybackRate = vjsControlBarDOM.getElementsByClassName('vjs-playback-rate')[0];
                let prev = document.getElementById('pc-control-prev');
                let next = document.getElementById('pc-control-next');
                vjsControlBarDOM.insertBefore(prev, vjsControlBarPlayerDOM);
                vjsControlBarDOM.insertBefore(next, vjsControlBarPlayerDOM.nextSibling);
                vjsControlBarDOM.insertBefore(vjsVolumePanel, vjsPlaybackRate);
            }, 1000);
        },
        handleClick(type) {
            this.$emit('handlePlay', type);
        }
    }
};
</script>
<style lang="less" scoped>
.vjs-control-bar {
    .pc-control-prev, .pc-control-next {
        width: 48PX;
        height: 36PX;
        .pc-control-prev-img, .pc-control-next-img {
            cursor: pointer;
            display: inline-block;
            width: 20PX;
            height: 20PX;
            margin: 8PX 0 0 14PX;
            background-size: cover;
        }
        .pc-control-prev-img {
            background-image: url('../../../assets/train-course/player-prev.png');
        }
        .pc-control-next-img {
            background-image: url('../../../assets/train-course/player-next.png');
        }
        .prev-title, .next-title {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }
    }
}
</style>
