<template>
  <div>
    <!-- 来源信息输入框 -->
    <commonInput
      :ruleForm="ruleForm"
      :InputData="sourceNews"
      :inputwidth="inputwidth"
    />
    <commonTextEare :ruleForm="ruleForm" :Texteare="sourceTexteare[0]" />
  </div>
</template>

<script>
import commonInput from "@/components/commonConpents/commonFrom/AnyInput";
import commonTextEare from "@/components/commonConpents/commonFrom/Texteare";
export default {
  name: "UniUiClueform",

  data() {
    return {
      inputwidth: "33.33%",
      sourceNews: [
        {
          label: "来源部门", //中文名称
          prop: "deptId", //属性唯一
          placeholder: "请输入", //描述文字
          selectArr: ["优亚", "手动阀"], //选择框内容
          isSelectItem: true,
        },
        {
          label: "来源方式",
          prop: "way",
          placeholder: "请输入",
          selectArr: ["优亚", "aaa"],
          isSelectItem: true,
        },
        // {
        //   label: "来源渠道",
        //   prop: "channel",
        //   placeholder: "请输入",
        //   selectArr: ["优亚", "aaa"],
        // },
        {
          label: "业务需求名称",
          prop: "name",
          placeholder: "请输入",
          selectArr: ["优亚", "牛逼"],
          isSelectItem: false,
        },
        {
          label: "客户需求名称",
          prop: "ori_per",
          placeholder: "请输入",
          selectArr: [],
          isSelectItem: false,
        },
      ],
      sourceTexteare: [
        {
          label: "客户需求详情", //中文名称
          prop: "description", //属性唯一
          placeholder:
            "项目方专注于生物降解塑料改性产品的生产、应用开发，一期年产5000吨生物降解塑料改性产品（粒料及制品），年销售额1.2亿元。", //描述文字
        },
      ],
      ruleForm: {
        deptId: "123",
        way: "123",
        name: "123",
        ori_per: "123",
        description: "123",
      },
      rules: {
        deptId: [{ required: false, message: "请选择", trigger: "blur" }],
        way: [{ required: false, message: "请选择", trigger: "blur" }],
        name: [{ required: false, message: "请选择", trigger: "blur" }],
        ori_per: [{ required: false, message: "请选择", trigger: "blur" }],
        description: [{ required: false, message: "请选择", trigger: "blur" }],
      },
    };
  },
  created() {
    this.$emit('setRules"', this.rules, this.ruleForm);
  },
  mounted() {},

  methods: {},
  components: {
    commonInput,
    commonTextEare,
  },
};
</script>

<style lang="scss" scoped>
</style>