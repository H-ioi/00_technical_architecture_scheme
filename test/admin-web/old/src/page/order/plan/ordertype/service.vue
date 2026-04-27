<template>
  <div>
    <el-form
      :label-position="'top'"
      :inline="true"
      :model="from"
      :rules="rules"
      ref="from"
    >
      <el-scrollbar class="formItem" style="padding: 20px 0;">
        <div class="fromTitle">服务工单基本信息</div>
        <div class="df_center_wrap">
          <el-form-item label="所需服务类" prop="serviceType">
            <el-select
              filterable
              v-model="from.serviceType"
              placeholder="请选择"
            >
              <el-option
                :key="k"
                v-for="(i, k) in orderTypeList['order_service_type']"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="你在哪个区域需要服务" prop="areas">
            <el-select
              filterable
              :multiple="true"
              v-model="from.areas"
              placeholder="请选择"
            >
              <el-option
                :key="k"
                v-for="(i, k) in orderTypeList['order_area']"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="width: 60%"
            label="需要服务的具体位置"
            prop="location"
          >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.location"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item
            style="width: 60%"
            label="请描述服务要求的内容"
            prop="description"
          >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.description"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 60%" label="附件">
            <FileListOrder
              ref="filelist"
              :scene="'order_periodic_plan_attachment'"
              :isDisabled="false"
            />
          </el-form-item>
          <el-form-item style="width: 60%" label="备注">
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.remark"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
      </el-scrollbar>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import FileListOrder from "@/components/common/FileListOrder";
import { getPublikTypeList } from "@/api/publik";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder
  },
  props: {
    schoolId: {
      default: "",
      type: String,
      require: true
    }
  },
  data() {
    return {
      from: { serviceType: "", areas: [] },
      rules: {
        serviceType: [{ required: true, message: "请选择", trigger: "blur" }],
        areas: [{ required: true, message: "请选择", trigger: "blur" }],
        location: [{ required: true, message: "请输入", trigger: "blur" }],
        description: [{ required: true, message: "请输入", trigger: "blur" }],
        remark: [{ required: false, message: "请输入", trigger: "blur" }]
      },
      orderTypeList: []
    };
  },
  created() {
    this.getPublikTypeList(this.schoolId);
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo", "dictpermissions"])
  },
  methods: {
    setData(data, outerId, files) {
      console.log("setData", data, files);
      this.from = {
        ...this.from,
        ...data
      };
      this.$refs["filelist"].filelistobj = [];
      this.$refs["filelist"].filelist = [];
      if (files !== null) {
        let ids = [];
        files.map(i => {
          ids.push(i.fileId);
          let obj = {
            outerId: outerId,
            scene: "order_periodic_plan_attachment"
          };
          let fileObj = {
            id: i.fileId,
            type: i.contentType,
            file: "",
            name: i.originalName
          };
          this.$refs["filelist"].filelist = ids;
          this.$refs["filelist"].filelistobj.push(fileObj);
          this.$refs["filelist"].getFile(i.fileId, obj);
        });
      }
    },
    submitForm() {
      this.$refs["from"].validate(valid => {
        if (valid) {
          console.log("from", this.from);
          let data = {
            ...this.from
          };
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["fileIds"] = fileIds;
          }
          this.$emit("setFormData", {
            type: true,
            data
          });
        } else {
          console.log("error submit!!");
          this.$emit("setFormData", {
            type: false,
            data: {}
          });
          return false;
        }
      });
    },
    getPublikTypeList(item) {
      console.log("getPublikTypeList", item);
      this.dictpermissions["order_school"].map(dict => {
        if (dict.value == item) {
          getPublikTypeList({
            pid: dict.id,
            types: ["order_service_type", "order_area"]
          }).then(res => {
            console.log("11111res", res);
            let dataDictValues = this.userInfo["dataDictValues"];
            this.orderTypeList = res.data.data;
            Object.keys(this.orderTypeList).forEach(res => {
              this.orderTypeList[res] = this.orderTypeList[res].filter(i => {
                return (
                  dataDictValues[res].includes(i.value) &&
                  i.status &&
                  !i.archived
                );
              });
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
