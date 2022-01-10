import { fetchPurchasedRecord } from '../service';
import { getParam } from '@js/util/getParam';
export const courseListMixin = {
    data() {
        return {
            courseType: '',
            bigCourseRecordList: [],
            videoCourseRecordList: [],
            courseRecordList: [],
            allCoursePurchasedRecord: sessionStorage && sessionStorage.getItem('allCoursePurchasedRecord')
        };
    },
    created() {
        if (!window.userInfo.id) return;
        this.getPurchaseRecord();
    },
    methods: {
        getPurchaseRecord() {
            fetchPurchasedRecord().then(res => {
                let { allCoursePurchasedRecord = [] } = res || {};
                this.allCoursePurchasedRecord = allCoursePurchasedRecord;
                sessionStorage && sessionStorage.setItem('allCoursePurchasedRecord', JSON.stringify(allCoursePurchasedRecord));
            });
        },
        goClass(item) {
            location.href = `#/content?courseId=${item.id}`;
        },
        formatCourseName(name) {
        return name && name.replace(/\《([^》《]*)\》/img, '$1');
        },
        isContainDom(arr, e) {
            return arr.some((item) => {
                return e.indexOf(item) > -1;
            });
        },
        goCourse(e, course) {
            if (this.isPc) {
                //跳转到指定课程页的dom节点
                const courseNodeNameList = ['teacher-portrait', 'content-title'];
                //跳转到指定课程页指定章节的dom节点
                const designatedChaptersNodeNameList = ['content-course-lesson'];
                let node  = e.target;
                if (node.className.indexOf('disabled-word') > -1) return false;
                while (node.className !== 'course-li') {
                    if (this.isContainDom(courseNodeNameList, node.className)) {
                        location.href = `#/content?courseId=${course.id}`;
                        break;
                    }
                    if (this.isContainDom(designatedChaptersNodeNameList, node.className)) {
                        location.href = `#/content?courseId=${course.id}&id=${node.value}`;
                        break;
                    }
                    node = node.parentNode;
                }

            } else {
                location.href = `#/content?courseId=${course.id}`;
            }
            this.twoPlatTrack('1n2s', {
                address_id: '1nd5',
                sid: getParam('sid') || '',
                content_id: `${course.id}`,
                course_type: `${course.courseType}`
            });
        }
    }
};
