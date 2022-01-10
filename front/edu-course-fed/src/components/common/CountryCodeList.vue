<template>
    <div
        v-show="showList"
        class="code-list-wrap"
    >
        <div
            v-for="(item,index) in codeData"
            :key="index"
        >
            <div class="tips">
                {{ item.name }}
            </div>
            <div
                v-for="secItem in item.countryList"
                :key="secItem.code"
                class="click-item"
                @click="clickItem(secItem.code)"
            >
                {{ secItem.name }}
            </div>
        </div>
    </div>
</template>

<script>
import { fetchPhoneCode, fetchCountryCode } from '../../service';

export default {
    name: 'CountryCodeList',
    components: {
    },
    props: {
      showList: {
        type: Boolean,
        default: false
      },
    },
    data() {
        return {
          codeData: [{ 'name': '常用', 'countryList': [{ 'name': '中国', 'code': '0086', 'length': 11 }, { 'name': '中国香港', 'code': '00852', 'length': 8 }, { 'name': '中国台湾', 'code': '00886', 'length': 10 }, { 'name': '中国澳门', 'code': '00853', 'length': 8 }, { 'name': '美国', 'code': '001', 'length': 7 }] }, { 'name': 'A', 'countryList': [{ 'name': '澳大利亚', 'code': '0061', 'length': 10 }, { 'name': '中国澳门', 'code': '00853', 'length': 8 }, { 'name': '爱尔兰', 'code': '00353', 'length': 9 }] }, { 'name': 'B', 'countryList': [{ 'name': '巴西', 'code': '0055', 'length': 8 }] }, { 'name': 'D', 'countryList': [{ 'name': '德国', 'code': '0049', 'length': 10 }] }, { 'name': 'E', 'countryList': [{ 'name': '俄罗斯', 'code': '007', 'length': 11 }] }, { 'name': 'F', 'countryList': [{ 'name': '法国', 'code': '0033', 'length': 10 }] }, { 'name': 'H', 'countryList': [{ 'name': '韩国', 'code': '0082', 'length': 11 }] }, { 'name': 'J', 'countryList': [{ 'name': '加拿大', 'code': '001', 'length': 7 }] }, { 'name': 'M', 'countryList': [{ 'name': '马来西亚', 'code': '0060', 'length': 9 }, { 'name': '美国', 'code': '001', 'length': 7 }] }, { 'name': 'R', 'countryList': [{ 'name': '日本', 'code': '0081', 'length': 11 }] }, { 'name': 'T', 'countryList': [{ 'name': '中国台湾', 'code': '00886', 'length': 10 }, { 'name': '泰国', 'code': '0066', 'length': 9 }] }, { 'name': 'X', 'countryList': [{ 'name': '中国香港', 'code': '00852', 'length': 8 }, { 'name': '新加坡', 'code': '0065', 'length': 8 }, { 'name': '新西兰', 'code': '0064', 'length': 9 }] }, { 'name': 'Y', 'countryList': [{ 'name': '印度', 'code': '0091', 'length': 10 }, { 'name': '英国', 'code': '0044', 'length': 11 }] }, { 'name': 'Z', 'countryList': [{ 'name': '中国', 'code': '0086', 'length': 11 }] }]
        };
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      fetchCountryCode()
      .then(res => {
        if (res.state === 1) {
          let returnData = res.content && res.content.rows || null;
          returnData && (this.codeData = returnData);
        }
      })
      .catch(res => {

      });
    },
    methods: {
      clickItem(item) {
        this.$emit('selectItem', item);
      }
    }
};
</script>

<style scoped lang="less">
.code-list-wrap {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 8000;
    bottom: 0;
    right: 0;
    overflow-y: scroll;
    background-color: #fff;


    .tips {
        padding-left: 32px;
        line-height: 38px;
        color: #666;
        background-color: #F9F9FA;
        font-size: 28px;
    }

    .click-item {
        margin: 0;
        padding-left: 28px;
        line-height: 90px;
        color: #333;
        font-size: 32px;
        box-shadow: inset 0 -1px 0 0 rgba(232,233,235,.5);
    }
}
</style>
