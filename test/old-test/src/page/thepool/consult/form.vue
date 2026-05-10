<template>
  <div class="thepool_page">
    <div class="editFromBox">
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="rules"
        ref="from"
      >
        <el-scrollbar class="formItem">
          <div class="fromTitle">学生信息</div>
          <div class="df_center_wrap">
            <el-form-item label="姓" prop="firstName">
              <el-input
                v-model="from.firstName"
                placeholder="请输入"
                :maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="名" prop="lastName">
              <el-input
                v-model="from.lastName"
                placeholder="请输入"
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select
                filterable
                v-model="from.sex"
                placeholder="请选择"
                @change="changeSchool"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolData"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期" prop="createTime" style="width: 22%">
              <el-date-picker
                style="width: 100%"
                v-model="from.createTime"
                type="date"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="入学年份" prop="createTime" style="width: 22%">
              <el-date-picker
                style="width: 100%"
                v-model="from.createTime"
                type="date"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="入学年级" prop="school">
              <el-select
                filterable
                v-model="from.school"
                placeholder="请选择"
                @change="changeSchool"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolData"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 80%" label="家庭住址" prop="areas">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
                v-model="from.destination"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
        </el-scrollbar>
        <el-form-item class="editFromBtn">
          <el-button type="primary" size="medium" round @click="submitForm('from')">{{
            this.$route.query.type == "edit" ? "保存" : "提交"
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import FileListOrder from "@/components/common/FileListOrder";
import {
  addOrderDemand,
  putOrderDemand,
  getOrderDetail,
  getMyOrderDetail,
} from "@/api/workorder/order/index.js";
import { getPublikTypeList } from "@/api/publik";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder,
  },
  data() {
    var formrulesdata = formrules;
    return {
      from: { serviceType: "", areas: [] },
      rules: {
        contact: [{ required: true, message: "请输入", trigger: "blur" }],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrulesdata["isEmail"], trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入", trigger: "blur" },
          // { validator: formrulesdata["isMobileNumber"], trigger: "blur" },
        ],
        department: [{ required: false, message: "请输入", trigger: "blur" }],
        school: [{ required: true, message: "请选择", trigger: "blur" }],
        serviceType: [{ required: true, message: "请选择", trigger: "blur" }],
        areas: [{ required: true, message: "请选择", trigger: "blur" }],
        location: [{ required: true, message: "请输入", trigger: "blur" }],
        description: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      currentOrderId: "",
      orderTypeList: [],
      schoolData: [],
      isMy: null,
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo"]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("from", this.from);
          let data = {
            ...this.from,
            type: 1,
          };
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["fileIds"] = fileIds;
          }
          if (this.$route.query.type == "edit") {
            this.putOrderDemand(data);
          } else {
            // 是否是重新发起
            if (this.$route.query.type == "reset") {
              data["isReissue"] = true;
            }
            this.addOrderDemand(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addOrderDemand(data) {
      addOrderDemand(data).then((res) => {
        if (res.data.success) {
          this.$message.success("新增成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.push("/order/list/index");
        }
      });
    },
    getOrderDetail(id) {
      if (this.isMy) {
        getMyOrderDetail(id).then((res) => {
          this.setData(res, id);
        });
      } else {
        getOrderDetail(id).then((res) => {
          this.setData(res, id);
        });
      }
    },
    setData(res, id) {
      if (res.data.success) {
        let orderAreasList = [];
        let { files, orderDemand, orderAreas } = res.data.data;
        if (orderAreas.length > 0) {
          orderAreas.map((item) => {
            orderAreasList.push(item.value);
          });
        }
        delete orderDemand["createTime"];
        this.from = {
          ...orderDemand,
          ...res.data.data,
          areas: orderAreasList,
        };
        this.getPublikTypeList(res.data.data.school);
        this.$nextTick(() => {
          this.$refs["filelist"].filelistobj = [];
          this.$refs["filelist"].filelist = [];
          if (files !== null) {
            console.log("8888", this.$refs);

            let ids = [];
            files.map((i) => {
              ids.push(i.fileId);
              let obj = {
                outerId: id,
                scene: "order_attachment",
              };
              let fileObj = {
                // status: "uploading",
                // message: "...",
                id: i.fileId,
                type: i.contentType,
                file: "",
                name: i.originalName,
              };
              this.$refs["filelist"].filelist = ids;
              this.$refs["filelist"].filelistobj.push(fileObj);
              this.$refs["filelist"].getFile(i.fileId, obj);
            });
          }
        });
      }
    },
    putOrderDemand(data) {
      putOrderDemand(data).then((res) => {
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.push(`/order/servicedetail?id=${data.id}`);
        }
      });
    },
    changeSchool(item) {
      console.log("item", item);
      this.getPublikTypeList(item);
      this.from.serviceType = "";
      this.from.areas = [];
    },
    getPublikTypeList(item) {
      this.dictionary["order_school"].map((i) => {
        if (i.value == item) {
          getPublikTypeList({
            pid: i.id,
            types: ["order_service_type", "order_area", "order_carry_time"],
          }).then((res) => {
            console.log("11111res", res);
            let dataDictValues = this.userInfo["dataDictValues"];
            this.orderTypeList = res.data.data;
            Object.keys(this.orderTypeList).forEach((res) => {
              this.orderTypeList[res] = this.orderTypeList[res].filter((i) => {
                return dataDictValues[res].includes(i.value) && i.status && !i.archived;
              });
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
