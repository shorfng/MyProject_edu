<template>
    <el-dialog
        :width="width"
        center
        :top="top"
        :visible="visible"
        :class="className"
        :modal="true"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        @close="closeModal"
    >
        <slot
            name="content"
        />
    </el-dialog>
</template>

<script>
export default {
    name: 'PcDialog',
    props: {
        width: {
            type: String,
            default: '500px'
        },
        top: {
            type: String,
            default: '25vh'
        },
        visible: {
            type: Boolean,
            default: false
        },
        className: {
            type: Object,
            default() {
                return {
                };
            }
        }
    },
    data() {
        return {
        };
    },
    watch: {
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped lang="less">

</style>
