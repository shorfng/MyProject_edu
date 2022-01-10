<template>
    <div
        class="content-p"
        v-html="courseDescription"
    />
</template>

<script>


export default {
    props: {
        courseDescription: {
            type: String,
            default: () => {
                return '';
            }
        }
    }
};

</script>

<style lang="less" scoped>
.class-info-contaniner {
    padding: 0 40px 10px 40px;
    margin-top: 70px;
    &:last-child {
        padding-bottom: 70px;
    }
    .info-title {
        font-size: 40px;
        color: #333333;
        margin-bottom: 23px;
    }
    .info-content.img-content {
        font-size: 0px;
    }
}
.content-p {
    font-size: 28px;
    color: #666666;
    letter-spacing: 0;
    text-align: justify;
    line-height: 42px;
    &.sub-title {
        margin-bottom: 18px;
    }
    &.nth {
        padding-top: 19px;
        padding-bottom: 19px;
        padding-left: 30px;
        &:nth-child(2n-1) {
            background: #f0f2f7;
        }
        &:nth-child(2n) {
            background: #fafbff;
        }
    }
    &.tips {
        margin-bottom: 14px;
        &::before {
            content: "";
            width: 1em;
            height: 1em;
            display: inline-block;
            margin-right: 8px;
            background-size: 15px 15px;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url("../../assets/public-class/circle-dot@3x.png");
            position: relative;
            top: 1px;
        }
    }
    &.has-interval {
        margin-bottom: 10px;
    }
}
.img {
    max-width: 100%;
    height: auto;
}
</style>
