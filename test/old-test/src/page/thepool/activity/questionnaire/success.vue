<template>
  <div class="questionnaire">
    <div class="questionnaire-nav">提交成功</div>
    <div class="questionnaire-content">
      <div class="successcard">
        <div class="successimg"></div>
        <div class="successtext">提交成功</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  beforeRouteEnter(to, form, next) {
    document.title = "The Pool";
    next();
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    document.title = "The Pool";
  },
  activated() {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.questionnaire {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  .questionnaire-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: #ffffff;
    font-size: 16px;
  }
  .questionnaire-content {
    width: 100%;
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    background: #f7f7f7;
    display: flex;
    align-items: center;
    flex-direction: column;
    .successcard {
      width: 96%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 40px 30px;
      background-color: #fff;
      border-radius: 10px;
      box-sizing: border-box;
      .successimg {
        width: 80px;
        height: 80px;
        background: url("../../../../../public/img/isagroup/icon_success.png") no-repeat;
        background-size: cover;
        margin-bottom: 20px;
      }
      .successtext {
        font-size: 16px;
        color: #2a3f54;
        text-align: center;
      }
    }
  }
}
</style>
