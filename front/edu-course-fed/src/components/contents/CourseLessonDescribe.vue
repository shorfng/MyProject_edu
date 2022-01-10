<template>
    <div class="course-lesson-describe">
        <div class="describe-title">
            <span class="describe-content">
                {{ courseName }}
            </span>
            <span
                v-if="purchasePeopleCount"
                class="describe-purchase"
            >
                {{ purchasePeopleCount }}人购买
            </span>
        </div>
        <div class="describe-info">
            视频课程/{{ totalCourseTime }}课时/约{{ totalDuration }}分钟
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
        courseName: {
            type: String,
            default: ''
        },
        purchasePeopleCount: {
            type: Number,
            default: 0
        },
        totalCourseTime: {
            type: Number,
            default: 0
        },
        totalDuration: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {};
    },
    mounted() {
    },
    methods: {
    }
};
</script>

<style lang="less" scoped>
.course-lesson-describe {
    font-size: 40px;
    color: #333333;
    line-height: 40px;
    padding: 31px 40px;
    .describe-title {
        position: relative;
    }
    .describe-content {
        max-width: 500px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .describe-purchase {
        font-size: 26px;
        color: #666666;
        position: absolute;
        right: 0;
    }
    .describe-info {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 26px;
        color: #666666;
        line-height: 26px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
}
</style>
