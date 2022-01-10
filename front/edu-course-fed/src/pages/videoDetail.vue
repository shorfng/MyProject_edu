<template>
    <div :class="isPc ? 'detail-container' : ''">
        <Container
            ref="container"
            :is-show-contents="isShowContents"
        />
        <div :class="'right-container bottom-container ' + contentCls">
            <Content
                ref="content"
                @switchMenu="switchMenu"
            />
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import Container from '../components/video-detail/Container';
import Content from '../components/video-detail/Content';

export default {
    name: 'Detail',
    components: {
        Container,
        Content
    },
    data() {
        return {
            contents: [],
            isShowContents: true,
        };
    },
    computed: {
        ...mapGetters(['courseInfo']),
        contentCls() {
            let cls = '';
            cls += !this.isShowContents && ' right-container-hide' || '';
            return cls;
        }
    },
    created(){
        this.getCourseInfo();
        this.getCourseSections({courseId: this.$route.query.courseId});
    },
    mounted() {
        this.saLogin();
    },
    methods: {
        ...mapActions([
            'setBaseInfoCourse',
            'getCourseSections',
        ]),
        getCourseInfo() {
            this.courseInfo.courseName &&  fetchCourseInfo(this.$route.query.courseId).then(res => {
                let courseInfo = res.content || {};
                this.setBaseInfoCourse({ courseInfo, isVideoCourse: true });
                console.log('getCourseInfo', res);
            });
        },
        switchMenu(value) {
            this.isShowContents = value;
        }
    }
};
</script>

<style lang="less">
* {
    &::-webkit-scrollbar {
        width: 0;
    }
}

.detail-container {
    height: 100%;
}

@media screen and (min-width: 750px) {
    .right-container {
        position: absolute;
        top: 0;
        right: 0;
        width: 380PX;
        height: 100%;
        background-color: rgb(50, 55, 62);
        transition: right 0.3s ease 0s;
    }
    .right-container-hide {
        right: -380PX;
    }
}

@media screen and (max-width: 750px) {
    .bottom-container {
        position: absolute;
        top: 422px;
        bottom: 0;
        left: 0;
        right: 0;
    }
}

.calc{
    height: calc(~"100% - 60px");
}

</style>
