<template>
    <div>
        <div
            v-if="!isEmploymentCourse && teacherDTO"
            class="class-teacher-contaniner container-no-padding"
        >
            <div class="teacher-title">
                课程讲师
            </div>
            <div
                class="teacher-info"
            >
                <div class="teacher-header">
                    <img
                        class="teacher-pic"
                        :src="teacherDTO.teacherHeadPicUrl"
                    >
                    <span class="teacher-name">
                        {{ teacherDTO.teacherName || '' }}
                    </span>
                </div>
                <div class="teacher-content">
                    <div
                        v-if="teacherDTO.position"
                        class="teacher-position"
                    >
                        {{ teacherDTO.position }}
                    </div>
                    <div
                        class="content-p has-interval"
                        v-html="teacherDTO.description || ''"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        teachers: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    computed: {
        ...mapGetters([
            'isEmploymentCourse'
        ])
    }
};
</script>
<style lang="less">
    .class-teacher-contaniner {
        margin-top: 70px;
        .teacher-title {
            font-size: 40px;
            color: #333333;
            margin-bottom: 31px;
        }
        .teacher-info {
            background: #ffffff;
            border: 1px solid #e8e9eb;
            box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.04);
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .teacher-header {
            height: 90px;
            line-height: 90px;
            padding-left: 156px;
            margin-bottom: 30px;
            margin-top: 40px;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
        }
        .teacher-pic {
            width: 90px;
            height: 90px;
            position: absolute;
            left: 31px;
            top: 0px;
            border-radius: 50%;
        }
        .teacher-name {
            font-size: 34px;
            color: #333333;
        }
        .teacher-position {
            background: #F8F9FA;
            color: #666666;
            padding: 16px 24px 12px;
            font-size: 24px;
            border-radius: 2px;
            margin-bottom: 28px;
        }
        .teacher-content {
            padding: 0 30px;
            margin-bottom: 37px;
            img {
                max-width: 100%;
            }
        }
    }
    .content-p {
        font-size: 28px;
        color: #666666;
        letter-spacing: 0;
        text-align: justify;
        line-height: 42px;
        &.has-interval {
            margin-bottom: 10px;
        }
    }
</style>
