<template>
  <div class="questionnaire-content-tab" v-loading="loading">
    <template v-if="!loading && !questionnaireId">
      <TabPlaceholder />
    </template>
    <TemplateResult
      v-else-if="questionnaireId"
      ref="templateResult"
      :key="questionnaireId"
      :is-bind-active="true"
    />
  </div>
</template>

<script>
import { getActivityDetail } from "@/api/isacommunity/activity.js";
import TemplateResult from "@/views/isacommunity/activity/questionnaire/templateresult.vue";
import TabPlaceholder from "../TabPlaceholder.vue";

function pickQuestionnaireId(data) {
  if (!data || typeof data !== "object") {
    return null;
  }
  var candidates = [
    data.questionnaireId,
    data.questionnaire_id,
    data.activityQuestionnaireId,
    data.activity_questionnaire_id,
  ];
  if (
    data.activityQuestionnaire &&
    typeof data.activityQuestionnaire === "object"
  ) {
    candidates.push(data.activityQuestionnaire.id);
  }
  for (var i = 0; i < candidates.length; i++) {
    var v = candidates[i];
    if (v !== undefined && v !== null && v !== "") {
      return String(v);
    }
  }
  return null;
}

export default {
  name: "QuestionnaireContent",
  components: {
    TemplateResult,
    TabPlaceholder,
  },
  props: {
    activityId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      questionnaireId: null,
    };
  },
  watch: {
    activityId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.questionnaireId = null;
      }
    },
  },
  methods: {
    load() {
      if (!this.activityId) {
        this.questionnaireId = null;
        return;
      }
      this.loading = true;
      getActivityDetail(this.activityId)
        .then((res) => {
          if (res.data.success) {
            const id = pickQuestionnaireId(res.data.data);
            this.questionnaireId = id;
            this.$nextTick(() => {
              if (this.questionnaireId && this.$refs.templateResult) {
                this.$refs.templateResult.setData(this.questionnaireId);
              }
            });
          } else {
            this.questionnaireId = null;
          }
        })
        .catch(() => {
          this.questionnaireId = null;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.questionnaire-content-tab {
  min-height: 120px;
}
</style>
