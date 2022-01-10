<template>
    <div>
        <Interacts
            @toast="toast"
            @showModal="showModal"
        />
    </div>
</template>
<script>
import Interacts from '@/components/contents/Interacts';
export default {
    components: {
        Interacts
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    methods: {
        showModal(data) {
            let { interactTitle, jumpText, jumpPicture } = data;
            this.lgBridge('ModalId', 'modal', {
                title: interactTitle,
                content: jumpText,
                img: jumpPicture,
                confirmBtnText: '确定'
            });
        },
        toast(content) {
            this.lgBridge('ModalId1', 'modal', {
                title: '',
                content,
                img: '',
                confirmBtnText: ''
            });
        },
        lgBridge(identifier, type, data) {
            window.lgBridge && window.lgBridge.request('showTipDialog', {
                data: {
                    identifier: identifier,
                    type: type,
                    data
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
</style>

