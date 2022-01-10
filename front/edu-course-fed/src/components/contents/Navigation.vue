<template>
    <div class="nav-wrap">
        <p class="nav-p-pc">
            <a href="#/">课程列表</a>
            <span class="sharp-content">></span>
            <span class="nav-sec">{{ replacePunctuate }}</span>
        </p>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: {
        courseName: {
            type: String,
            default: ''
        }
    },
    computed: {
        replacePunctuate() {
            return this.courseName.replace(/\《([^》《]*)\》/img, '$1');
        }
    }
};
</script>

<style scoped lang="less">
    .nav-wrap{
        padding-top: 40PX;
        height: 50PX;
        background: #ffffff;
    }
    .nav-p-pc{
        font-size: 16PX;
        margin: 17PX auto;
        vertical-align: top;
        width: 750PX;
        a{
            &:active{
                color: #666;
            }
            &:visited{
                color: #666;
            }
            &:link{
                color: #666;
            }
            &:hover{
                color: #00b38a;
            }
        }
        .sharp-content{
            color: #666666;
            margin-left: 5PX;
        }
        .nav-sec{
            margin-left: 5PX;
            color: #999;
        }
    }
</style>
