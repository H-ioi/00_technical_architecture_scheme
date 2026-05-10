<template>
  <div class="space thepool_page">
    <el-scrollbar class="space_right" ref="space_right">
      <!-- <div class="title">线索动态表单</div> -->
      <div class="df_fa" style="height: 100%">
        <div style="flex: 1; height: 100%; background: #ffffff">
          <FormgeneratorPool
            class="formgenerator_child"
            ref="FormgeneratorPool"
            templateStr="enquiry_clue_school"
            :formData="formData"
            :hasTemplateFrom="false"
            @getTemplateList="getTemplateList"
          />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 动态模板
import { bindTemplateOuterId } from "@/api/space/templatedynamic.js";
import { getTemplateList } from "@/api/consult/template.js";
import FormgeneratorPool from "@/page/space/from/formgenerator_pool.vue";
export default {
  components: {
    FormgeneratorPool,
  },
  data() {
    return {
      currentSchool: "",
      formData: {
        scene: "8",
        type: "8",
        pageNum: 1,
        pageSize: 100,
      },
    };
  },
  created() {
    this.initData();
  },
  activated() {},
  computed: {
    ...mapGetters(["i18nlocel", "permissions", "dictpermissions"]),
  },
  methods: {
    // 初始化数据
    initData() {
      this.getTemplateList();
    },
    getTemplateList() {
      getTemplateList(this.formData).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let list = res.data.data.data || [];
            if (list.length == 0) {
              this.$refs["FormgeneratorPool"].templateType = "add";
              this.$refs["FormgeneratorPool"].clearData();
            } else {
              this.$refs["FormgeneratorPool"].templateType = "edit";
              this.$refs["FormgeneratorPool"].getTemplateDetail(
                list[0].templateId
              );
            }
          });
        }
      });
    },
    addTemplate(id) {
      let data = new FormData();
      data.append("ids", [id]);
      data.append("outerId", this.formData["outerId"]);
      data.append("scene", this.formData["scene"]);
      bindTemplateOuterId(data).then((res) => {
        console.log("getTemplateList", res);
        if (res) {
          this.$message.success("新增成功");
          this.getTemplateList();
        } else {
          this.$message.success("新增失败");
        }
      });
    },
    // 切换校区
    changeSchool(item) {
      this.currentSchool = item.value;
      this.formData["typeId"] = this.currentSchool;
      this.getTemplateList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
