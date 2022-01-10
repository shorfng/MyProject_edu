<template>
    <div class="progress-bar">
        <vue-slider
            :disabled="iscanHideFast"
            :rail-style="railStyle"
            :process-style="processStyle"
            :dot-style="dotStyle"
            :tooltip-style="tooltipStyle"
            :contained="contained"
            :tooltip-formatter="formatProcessToolTip"
            :lazy="lazy"
            :value="currentProgressStatus.playerSecondCurrentTime"
            :max="currentProgressStatus.playerDuration"
            @change="changeSlider"
            @dragging="dragging"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import { formatTime } from '../../common/js/util/formatTime';

export default {
    name: 'ProgressBar',
    components: {
        VueSlider,
    },
    props: {
        railStyle: {
            type: Object,
            default: () => {
                return {
                    height: '2px',
                    background: '#D5DADF',
                    borderRadius: '1.5px',
                };
            }
        },
        processStyle: {
            type: Object,
            default: () => {
                return {
                    background: '#00b38a',
                };
            }
        },
        dotStyle: {
            type: Object,
            default: () => {
                return {
                    width: '16px',
                    height: '16px',
                    background: '#00b38a',
                    boxShadow: 'none',
                    marginTop: '-1px',
                    zIndex: '1',
                };
            }
        },
        tooltipStyle: {
            type: Object,
            default: () => {
                return {
                    padding: '2px 12px 2px 12px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    background: '#00b38a',
                    minWidth: '20px',
                    borderColor: '#00b38a'
                };
            }
        },
        contained: {
            type: Boolean,
            default: false
        },
        lazy: {
            type: Boolean,
            default: true
        },
        currentLessonLastPlayHistory: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters([
            'playerAllTime',
            'playerDuration',
            'playerCurrentTime',
            'playerStatus',
            'playerSecondCurrentTime',
            'isPlayerReady',
            'currentCourseLessons',
            'isPlayerFirstLoaded',
            'currentEnv',
            'iscanHideFast'
        ]),
        currentProgressStatus: function() {
            let returnData = {};
            if (this.currentEnv === 'PC') {
                let { id: currentId, audioMediaDTO = {} } = this.currentCourseLessons;
                let { id: playerId } = this.playerStatus;
                returnData.duration = audioMediaDTO.duration || '';
                returnData.playerDuration = audioMediaDTO.durationNum;
                if (currentId === playerId && this.isPlayerFirstLoaded) {
                    returnData.playerSecondCurrentTime = this.playerSecondCurrentTime;
                } else {
                    returnData.playerSecondCurrentTime = this.currentLessonLastPlayHistory;
                }
            }
            else {
                returnData = {
                    playerSecondCurrentTime: this.playerSecondCurrentTime,
                    playerDuration: this.playerStatus.audioMediaDTO.durationNum,
                    maxTimeString: this.playerStatus.audioMediaDTO.duration
                };
            }
            return returnData;
        },
    },
    watch: {},
    methods: {
        ...mapActions([
            'setFormatPlayerCurrentTime',
            'setLessonPlayer',
            'setSlideDragTime',
            'setLessonPlayer',
        ]),
        formatProcessToolTip(index = 0) {
            let audioMediaDTO = this.currentCourseLessons.audioMediaDTO || { duration: 0 };
            return `${formatTime(index)}/${audioMediaDTO.duration}`;
        },
        changeSlider(res) {
            this.$emit('changeSlider');
            this.setSlideDragTime({ slideSetTime: res });
            this.setFormatPlayerCurrentTime(res);
            this.setLessonPlayer({ id: this.currentCourseLessons.id, isPlaying: true, isSliderChange: true });
        },
        dragging() {
            this.$emit('dragging');
        }
    }
};
</script>

<style lang="less">
.vue-slider-dot{
    z-index: 1;
}
</style>
