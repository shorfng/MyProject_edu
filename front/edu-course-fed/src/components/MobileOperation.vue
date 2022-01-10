<template>
    <div
        v-if="operationsLength"
        class="mobile-operation-position"
    >
        <div class="flex-operation-box">
            <a
                v-for="(item, index) in operations"
                :key="index"
                :class="classMap[operationsLength]"
                :href="item.link"
            >
                <img
                    :src="item.imgurl"
                    :alt="item.title"
                >
            </a>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MobileOperation',
  props: {
    // 运营位
    operations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const classMap = {
      '1': 'long-operation',
      '2': 'middle-operation',
      '3': 'short-operation',
    };
    Object.freeze(classMap);
    return {
      classMap: classMap,
    };
  },
  computed: {
    operationsLength() {
      return this.operations.length;
    },
  },
};
</script>

<style lang="less" scoped>
.mobile-operation-position {
  padding: 0 30px;
  box-sizing: border-box;
  width: 100%;
  font-size: 32px;
  // margin-bottom: 40px;

  .flex-operation-box {
    width: 100%;
    display: flex;
    justify-content: space-between;

    & > a {
      width: 100%;
      height: 130px;
      border-radius: 4px;
      background: linear-gradient(
        90deg,
        rgba(247, 241, 228, 1) 0%,
        rgba(245, 228, 218, 1) 100%
      );
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .middle-operation {
      width: 335px;
    }

    .short-operation {
      width: 220px;
    }
  }
}
</style>
