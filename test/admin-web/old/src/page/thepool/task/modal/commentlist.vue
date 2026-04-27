<template>
  <div class="thepool_page" style="width: 100%">
    <el-steps
      v-if="commentList.length > 0"
      style="margin-top: 0"
      class="poolSteps"
      direction="vertical"
      :active="commentList.length"
    >
      <el-step v-for="(i, k) in commentList" :key="k" :title="i.commentTime">
        <template slot="description">
          <div class="df_sb">
            <div class="loglabel">
              {{ i.userName }}
            </div>
          </div>
          <ShowText
            v-if="i.comment !== null"
            :label="
              (i.commentType == '1'
                ? $t('consult.总结')
                : i.commentType == '2'
                ? $t('consult.完成')
                : $t('consult.评论')) +
              '：' +
              i.comment
            "
          />
          <ShowText
            v-if="i.remark != null"
            :label="$t('consult.备注') + '：' + i.remark"
          />
        </template>
      </el-step>
    </el-steps>
    <el-empty v-if="commentList.length == 0" description="No Data~"></el-empty>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ShowText from "@/components/common/ShowText.vue";
export default {
  name: "addlog",
  props: {
    commentList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ShowText,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    setCommentType(commentType) {
      let str = "";
      switch (commentType) {
        case "0":
          str = $t("consult.评论");
          break;
        case "1":
          str = $t("consult.总结");
          break;
        case "2":
          str = $t("consult.完成");
          break;
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.poolSteps {
  width: 100%;
  margin-top: 30px;
}

.loglabel {
  font-size: 14px;
  color: #0d0d0d;
  line-height: 24px;
}
</style>
