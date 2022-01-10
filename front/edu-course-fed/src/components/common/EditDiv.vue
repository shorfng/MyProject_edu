<template>
    <div
        v-cloak
        class="edit-div"
        :class="{'pcStyle':isPcEnv==true}"
        contenteditable="true"
        :placeholder="hodelValue"
        @focus="isLocked = true"
        @blur="isLocked = false"
        @input="changeText"
        v-html="innerText"
    />
</template>
<script>
export default {
    name: 'EditDiv',
    props: {
        value: {
            type: String,
            default: ''
        },
        canEdit: {
            type: Boolean,
            default: true
        },
        hodelValue: {
            type: String,
            default: '分享学习心得、思考感悟或者给自己一个小鼓励吧！'
        },
        isPcEnv: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            innerText: this.value,
            isLocked: false,
            inputType: '',
            text: ''
        };
    },
    watch: {
        'value'(val) {
            if (!val) {
                this.$el.innerHTML = '';
            }
            if (!this.isLocked) {
                this.innerText = val;
            }
        }
    },
    methods: {
        changeText(e) {
            this.inputType = e.inputType;
            this.text = this.$el.innerHTML;
            this.$emit('input', this.text);
        }
    }
};
</script>
<style lang="less">
    [v-cloak]{
        display: none;
    }
    .edit-div {
        width: 100%;
        height: 230px;
        line-height:50px;
        margin-top: 20px;
        word-break: break-all;
        outline: none;
        color: #666666;
        user-select: text;
        text-align: left;
        font-size: 32px;
        caret-color:#00b38a;
        border-bottom: 4px solid #fff;
        overflow: hidden;
        overflow-y: auto;
        &[contenteditable='true']{
            user-modify: read-write-plaintext-only;
            &:empty:before {
                content: attr(placeholder);
                display: block;
                color: #cccccc;
            }
        }
        &-default{
            color: #cccccc;
        }
    }
    .pcStyle{
        box-sizing: border-box;
        position: relative;
        line-height: 30PX;
        margin-top: 6PX;
        height: 100%;
    }
    .lagouEduTheme .edit-div {
        caret-color:#FBC546;
    }
</style>
