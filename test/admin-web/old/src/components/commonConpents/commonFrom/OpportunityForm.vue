<template>
  <div>
    <!-- 商机输入框 -->
    <div class="inputBox">
      <el-form-item label="商机名称" prop="name" :style="`width:${inputwidth}`">
        <el-input
          :disabled="!isedit"
          placeholder="请输入"
          v-model="ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="跟进人"
        prop="followUser"
        :style="`width:${inputwidth}`"
      >
        <el-select
          filterable
          :disabled="!isedit"
          multiple
          :style="`width:100%`"
          v-model="ruleForm.followUser"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in userdata"
            :key="index"
            :label="item.deptName + '-' + item.username"
            :value="String(item.userId)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="跟进团队"
        prop="followTeam"
        :style="`width:${inputwidth}`"
      >
        <el-select
          filterable
          :disabled="!isedit"
          multiple
          :style="`width:100%`"
          v-model="ruleForm.followTeam"
          placeholder="请选择"
        >
          <el-option
            :label="item.name"
            :value="String(item.id)"
            :key="index"
            v-for="(item, index) in teamdata"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="预签金额"
        prop="amount"
        :style="`width:${inputwidth}`"
      >
        <el-input
          :disabled="!isedit"
          placeholder="请输入"
          v-model="ruleForm.amount"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="商机级别"
        prop="level"
        :style="`width:${inputwidth}`"
      >
        <el-select
          filterable
          :disabled="!isedit"
          :style="`width:100%`"
          v-model="ruleForm.level"
          placeholder="请选择"
        >
          <el-option
            :key="index"
            v-for="(item, index) in opportunitylevel"
            :label="item.label"
            :value="String(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="showdate"
        :style="`width:${inputwidth}`"
        label="预计到期时间"
        prop="autoBackTime"
      >
        <el-input
          :disabled="true"
          placeholder="请输入"
          v-model="ruleForm.autoBackTime"
        ></el-input>
      </el-form-item>
    </div>
    <commonTextEare
      :ruleForm="ruleForm"
      :Texteare="cotactTexteare[0]"
      :isedit="isedit"
    />
    <commonTextEare
      :isedit="isedit"
      :ruleForm="ruleForm"
      :Texteare="contactTeeare[0]"
    />
  </div>
</template>

<script>
import { fetchList } from "@/api/admin/user";
import { fetchTypeList } from "@/api/base/index";
import { fetchTeamList } from "@/api/team/index.js";
import commonInput from "@/components/commonConpents/commonFrom/AnyInput";
import commonTextEare from "@/components/commonConpents/commonFrom/Texteare";
export default {
  name: "UniUiClueform",
  props: {
    ruleForm: Object,
    isedit: Boolean,
    showdate: Boolean,
    inputwidth: String,
  },
  data() {
    return {
      listQuery: {
        name: undefined,
      },

      props: {
        multiple: true,
        value: "id",
        label: "name",
        children: "children",
      },
      userdata: [],
      teamdata: [],
      opportunitylevel: [],
      cotactTexteare: [
        {
          label: "需求信息",
          prop: "description",
          placeholder: "请输入需求信息",
        },
      ],
      contactTeeare: [
        {
          label: "备注信息",
          prop: "remark",
          placeholder: "请输入",
        },
      ],
    };
  },
  created() {
    this.getuserList();
    this.fetchTeamList();
    this.fetchtypelist();
  },
  mounted() {},

  methods: {
    fetchtypelist() {
      fetchTypeList("opportunity_level").then((res) => {
        this.opportunitylevel = res.data.data;
      });
    },
    fetchTeamList() {
      fetchTeamList({ current: 1, size: 10000 }).then((res) => {
        this.teamdata = res.data.data.records;
      });
    },

    getuserList() {
      fetchList({ current: 1, size: 10000 }).then((res) => {
        this.userdata = res.data.data.records;
      });
    },
  },
  components: {
    commonInput,
    commonTextEare,
  },
};
</script>

<style lang="scss" scoped>
.inputBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/deep/.el-input__inner {
  border: 1px solid #dcdfe6;
}
/deep/.el-select {
  display: block;
}
.fromtext {
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  font-size: 16px;
  font-family: Alibaba PuHuiTi;
  font-weight: 600;
  color: #cdcdcd;
  padding-left: 20px;
}
/deep/.el-form-item {
  padding-right: 25px;
}
.fromtext {
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  font-size: 16px;
  font-family: Alibaba PuHuiTi;
  font-weight: 600;
  color: #cdcdcd;
  padding-left: 20px;
}
/deep/.el-input.is-disabled .el-input__inner {
  background-color: #f8f8f8;
}
</style>