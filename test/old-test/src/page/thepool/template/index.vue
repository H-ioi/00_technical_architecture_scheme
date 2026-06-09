<template>
  <div class="space thepool_page">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="width: 100%; background: #ffffff; padding: 30px"
    >
      <FormgeneratorPool
        ref="FormgeneratorPool"
        :formData="formData"
        :hasTemplateFrom="true"
        @addTemplate="addTemplate"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getTemplateOuterId,
  bindTemplateOuterId,
} from "@/api/space/templatedynamic.js";
import FormgeneratorPool from "@/page/space/from/formgenerator_pool.vue";
export default {
  components: {
    FormgeneratorPool,
  },
  data() {
    return {
      formData: {},
    };
  },
  created() {
    this.initData();
  },
  activated() {},
  computed: {
    ...mapGetters(["permissions", "dictpermissions"]),
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        let query = this.$route.query;
        this.formData = {
          formType: query["formType"] || "", //表单类型
          scene: query["scene"] || "", //场景类型
          templateId: query["templateId"] || null, //模板id
          typeId: query["typeId"] || null, //关联id
        };
        if (query["formType"] == "add") {
          this.$refs["FormgeneratorPool"].templateType = "add";
          this.$refs["FormgeneratorPool"].clearData();
        } else {
          this.$refs["FormgeneratorPool"].templateType = "edit";
          this.$refs["FormgeneratorPool"].getTemplateDetail(
            query["templateId"]
          );
        }
      });
    },
    addTemplate(id) {
      let data = new FormData();
      data.append("ids", [id]);
      data.append("outerId", this.formData["outerId"]);
      data.append("scene", this.formData["scene"]);
      bindTemplateOuterId(data).then((res) => {
        console.log("getTemplateOuterId", res);
        if (res) {
          this.$message.success("新增成功");
        } else {
          this.$message.success("新增失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
