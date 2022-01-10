import { mapGetters } from 'vuex';
import { parseString } from '@js/emoji/emoji';
export const messageMixins = {
    data() {
        return {
            pageNum: 1,
            hasData: true,
            fetching: true,
            showDeleteModal: false,
            clickFlag: false
        };
    },
    filters: {
        // 点赞数处理
        likeNum(count) {
            let num = parseInt(count);
            return num > 9999 ? '9999+' : num || '';
        }
    },
    computed: {
        ...mapGetters([
            'currentCourseLessons',
            'hasPurchaseClass'
        ]),
        // 解析包含表情的字符串
        parseString(val) {
            return function(val) {
                return parseString(val);
            };
        },
        // 隐藏留言入口
        hideStatus() {
            let { type } = this.currentCourseLessons;
            return !this.hasPurchaseClass && type !== 'free' && this.showEmpty;
        },
    },
    mounted() {
    },
    methods: {
        hideToast() {
            this.isShowToast = false;
        }
    }
};
// 输入框相关验证
export const validateMixins = {
    methods: {
        // 判断输入内容是否全部为空
        isNull(str) {
            if (str == '') return true;
            var regu = '^[ ]+$';
            var re = new RegExp(regu);
            return re.test(str);
        },
        // 去除提交内容前后空格和换行
        trim(str) {
            if (str == '') return '';
            // 去除前后换行
            str = str.replace(/[\r\n]/g, '');
            // 去除前后空格
            str = str.replace(/(^\s*)|(\s*$)/g, '');
            return str;
        }
    }
};