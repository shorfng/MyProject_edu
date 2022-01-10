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
import { fetchCountryCode } from '@service/login';
import { CODO_DATA } from './codeData';

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
            codeData: CODO_DATA
        };
    },
    mounted() {
      fetchCountryCode().then(res => {
        if (res.state === 1) {
          let returnData = res.content && res.content.rows || null;
          returnData && (this.codeData = returnData);
        }
      }).catch(res => {

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
