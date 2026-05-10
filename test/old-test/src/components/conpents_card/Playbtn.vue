<template>
  <div
    :class="[
      tabtype !== undefined
        ? tabtype.length !== 0
          ? 'df_sb'
          : 'df_fe'
        : 'df_fe',
      'playbtnbox',
    ]"
  >
    <div
      v-if="tabtype !== undefined ? tabtype.length !== 0 : false"
      class="tabtypebox"
    >
      <div
        @click="changetype(index, item)"
        :class="['tabtype', { current: currenttype == index }]"
        v-for="(item, index) in tabtype"
        :key="index"
      >
        <!-- {{ `${item.name}(${item.num == undefined ? 0 : item.num}) ` }} -->
        {{ `${item.name} ` }}
      </div>
    </div>
    <div>
      <div :class="['df_fe']">
        <el-button
          v-for="(item, index) in playbtn"
          :key="index"
          @click="playBtn(item.name)"
          class="btn_small"
          type="primary"
          style="margin-left: 20px"
        >
          {{ item.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UniUiPlaybtn",
  props: {
    playbtn: Array,
    tabtype: Array,
  },
  data() {
    return {
      currenttype: 0,
    };
  },

  mounted() {},

  methods: {
    changetype(index, item) {
      this.currenttype = index;
      this.$emit("filterlist", { ...item.type, current: 1 });
    },
    playBtn(name) {
      this.$emit("playBtn", name);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabtypebox {
  display: flex;
  .tabtype {
    width: 150px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background: #f5f7fe;
    border-radius: 5px;
    font-size: 14px;
    font-family: Source Han Sans CN-Normal, Source Han Sans CN;
    font-weight: 400;
    margin-right: 20px;
    color: #999999;
    cursor: pointer;
  }
  .current {
    color: #175E67;
  }
}
</style>