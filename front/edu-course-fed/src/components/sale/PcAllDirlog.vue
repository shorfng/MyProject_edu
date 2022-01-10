<template>
    <div
        class="pc-all-dirlog-wrap"
    >
        <PcDialog
            :width="type === 'confirm'?'333PX':'500px'"
            :visible="visible"
            :class-name="{'sale-pc-all-dirlog':true,'is-confirm':type === 'confirm'}"
            @close="closeDirlog"
        >
            <template v-slot:content>
                <div
                    v-if="type === 'buyRepeat'"
                    class="content"
                >
                    <div class="bg-1" />
                    <div class="text">
                        您已买过该课程～
                    </div>
                    <div
                        class="button"
                        @click="learn"
                    >
                        立即学习
                    </div>
                </div>
                <div
                    v-if="type === 'soldOut'"
                    class="content"
                >
                    <div class="bg-2" />
                    <div class="text">
                        很抱歉，该内容已下架～
                    </div>
                    <div
                        class="button"
                        @click="moreClass"
                    >
                        查看更多好课
                    </div>
                </div>

                <div
                    v-if="type === 'confirm'"
                    class="confirm-wrap"
                >
                    <div class="confirm-text">
                        课程信息有修改，请刷新页面查看最新信息
                    </div>
                    <div class="confirm-button-wrap">
                        <span
                            class="confirm-button"
                            @click="reload"
                        >
                            确定
                        </span>
                    </div>
                </div>
            </template>
        </PcDialog>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import PcDialog from '@components/PcDialog/Dialog';
    export default {
        name: 'PcAllDirlog',
        components: {
            PcDialog
        },
        props: {
          visible: {
            type: Boolean,
            default: false
          },
          type: {
            type: String,
            default: 'buyRepeat'
          }
        },
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters([
            ]),
        },
        watch: {
        },
        mounted() {
        },
        methods: {
          closeDirlog() {
            this.$emit('close');
          },
          learn() {
              let { id } = this.courseInfo;
              window.location.href = `#/content?courseId=${id}`;
          },
          moreClass() {
            window.location.replace('https://kaiwu.lagou.com/');
          },
          reload() {
             document.location.reload();
          }
        }
    };
</script>
<style lang="less" scoped>
  .el-dialog__wrapper.sale-pc-all-dirlog{
    /deep/ .el-icon-close{
      color: #cccccc;
      font-size: 22PX;
    }
    /deep/ .el-dialog__headerbtn{
      top: 14PX;
      right: 14PX;
    }
    /deep/ .el-dialog__body{
      padding: 0;
    }
    &.is-confirm{
      /deep/ .el-dialog__header{
        display: none;
      }
    }
  }
  .text{
    text-align: center;
    font-size:20PX;
    color:rgba(51,51,51,1);
    margin-bottom: 33PX;
    margin-top: -5PX;
  }
  .button{
    width:140PX;
    height:40PX;
    background:rgba(0,179,138,1);
    border-radius:3PX;
    line-height: 40PX;
    text-align: center;
    font-size:16PX;
    color:rgba(255,255,255,1);
    margin: 0 auto;
    cursor: pointer;
  }
  .content{
    padding: 15PX 0 50PX 0;
  }
  .bg-1{
    margin: 0 auto 5PX;
    width: 125PX;
    height: 110PX;
    background: url('~@assets/course/sale/bg-1.png') no-repeat;
    background-size: 100% 100%;
  }
  .bg-2{
    margin: 0 auto 5PX;
    width: 125PX;
    height: 110PX;
    background: url('~@assets/course/sale/bg-2.png') no-repeat;
    background-size: 100% 100%;
  }
  .confirm-text{
    padding: 25PX 20PX;
    font-size: 14PX;
    color: #555;
    line-height: 30PX;
  }
  .confirm-button-wrap{
        background-color: #f9f8f8;
        text-align: center;
        width: 100%;
        height: 60PX;
  }
  .confirm-button{
        display: inline-block;
        background-color: #00b38a;
        color: #fff;
        border-radius: 20PX;
        padding: 0 25PX;
        cursor: pointer;
        height: 32PX;
        margin-top: 14PX;
        line-height: 32PX;
  }

</style>

