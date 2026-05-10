<template>
  <div>
    <!-- 财务信息输入框 -->
    <commonInput
      :ruleForm="ruleForm"
      :InputData="financial"
      :inputwidth="inputwidth"
    />
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
      financial: [
        {
          label: "税号", //中文名称
          prop: "presonname", //属性唯一
          placeholder: "请输入税号", //描述文字
          isSelectItem: false, //是否是选择框
        },
        {
          label: "发票抬头",
          prop: "persontype",
          placeholder: "请输入发票抬头",
          isSelectItem: false,
        },
        {
          label: "开户银行",
          prop: "personlevel",
          placeholder: "请输入开户银行",
          isSelectItem: false,
        },
        {
          label: "银行账号",
          prop: "personeare",
          placeholder: "请输入银行账号",
          isSelectItem: false,
        },
        {
          label: "电话号码",
          prop: "personeare",
          placeholder: "请输入电话号码",
          isSelectItem: false,
        },
        {
          label: "单位地址",
          prop: "personeare",
          placeholder: "请输入单位地址",
          isSelectItem: false,
        },
      ],
      sourceTexteare: [
        {
          label: "客户需求详情", //中文名称
          prop: "persondetal", //属性唯一
          placeholder:
            "项目方专注于生物降解塑料改性产品的生产、应用开发，一期年产5000吨生物降解塑料改性产品（粒料及制品），年销售额1.2亿元。", //描述文字
        },
      ],
      ruleForm: {
        presonname: "123",
        personlevel: "123",
        personeare: "123",
        ori_department: "123",
        ori_ma: "123",
        ori_name: "123",
        ori_per: "123",
        persontype: "1523",
      },
      rules: {
        ori_department: [
          { required: false, message: "请选择", trigger: "blur" },
        ],
        ori_ma: [{ required: false, message: "请选择", trigger: "blur" }],
        ori_name: [{ required: false, message: "请选择", trigger: "blur" }],
        ori_per: [{ required: false, message: "请选择", trigger: "blur" }],
        persontype: [{ required: false, message: "请选择", trigger: "blur" }],
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