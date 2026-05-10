<template>
  <div>
    <div class="editFromBox">
      <el-form
        ref="form"
        :label-position="'top'"
        :inline="true"
        :model="formData"
        :rules="formRules"
      >
        <el-scrollbar class="formItem">
          <div class="fromTitle">受访信息</div>
          <div class="df_center_wrap">
            <el-form-item label="受访园区" prop="targetSchool">
              <el-select
                style="width: 100%"
                v-model="formData.targetSchool"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dictpermissions['order_school']"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="受访人" prop="visiter">
              <el-select
                style="width: 100%"
                v-model="formData.visiter"
                placeholder="请选择"
                filterable
                @change="changeVisiter"
              >
                <el-option
                  v-for="(item, index) in userList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="受访人员姓名" prop="targetUserName">
              <el-input
                v-model="formData.targetUserName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item label="受访部门" prop="targetDepartment">
              <el-input
                v-model="formData.targetDepartment"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="受访人员联系方式" prop="targetUserContact">
              <el-input
                v-model="formData.targetUserContact"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
          <div class="fromTitle">访客信息</div>
          <div class="df_center_wrap">
            <el-form-item label="访问类型" prop="visitType">
              <el-select
                style="width: 100%"
                v-model="formData.visitType"
                placeholder="请选择"
                @change="changeVisitType"
              >
                <el-option
                  v-for="item in order['visitTypeList']"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="访客姓名" prop="visitHumanName">
              <el-input
                v-model="formData.visitHumanName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="访客身份证" prop="visitHumanIdNo">
              <el-input
                v-model="formData.visitHumanIdNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item label="访客手机号" prop="visitHumanPhone">
              <el-input
                v-model="formData.visitHumanPhone"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="访客人数" prop="visitHumanSum">
              <el-input
                v-model="formData.visitHumanSum"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="time-picker"
              label="访问日期"
              prop="visitDateBegin"
            >
              <el-date-picker
                style="width: 100%"
                v-model="formData.visitDateBegin"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              class="time-picker"
              :label="`访问时间(${timeRange.minTime}-${timeRange.maxTime})`"
              prop="visitTime"
            >
              <el-time-picker
                style="width: 100%"
                is-range
                v-model="formData.visitTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm"
                format="HH:mm"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item label="访客车牌号" prop="visitVehicleIdNo">
              <el-input
                v-model="formData.visitVehicleIdNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="width: 100%"
              label="来访事由"
              prop="visitDetail"
            >
              <el-input
                v-model="formData.visitDetail"
                placeholder="请输入"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" label="头像">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </div>

          <el-form
            v-if="formData.visitType == '1'"
            :label-position="'top'"
            :inline="true"
            :model="projectInfo"
            :rules="projectRules"
            ref="projectForm"
          >
            <div class="fromTitle">工程信息</div>
            <div class="df_center_wrap">
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="projectInfo.projectName"
                  placeholder="请输入"
                  maxlength="100"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="contactInfo">
                <el-input
                  v-model="projectInfo.contactInfo"
                  placeholder="请输入"
                  maxlength="20"
                ></el-input>
              </el-form-item>
              <el-form-item label="施工单位" prop="constructionContractor">
                <el-input
                  v-model="projectInfo.constructionContractor"
                  placeholder="请输入"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="现场负责人" prop="constructionSupervisor">
                <el-input
                  v-model="projectInfo.constructionSupervisor"
                  placeholder="请输入"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="time-picker"
                label="工程日期"
                prop="constructionDate"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="projectInfo.constructionDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                class="time-picker"
                :label="`工程时间(${timeRange.minTime}-${timeRange.maxTime})`"
                prop="constructionTime"
              >
                <el-time-picker
                  style="width: 100%"
                  is-range
                  v-model="projectInfo.constructionTime"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  value-format="HH:mm"
                  format="HH:mm"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item
                style="width: 100%"
                label="工作区域"
                prop="constructionArea"
              >
                <el-input
                  style="width: 100%"
                  v-model="projectInfo.constructionArea"
                  placeholder="请输入"
                  type="textarea"
                  rows="4"
                  show-word-limit
                  maxlength="200"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-scrollbar>
        <el-form-item class="editFromBtn" style="margin-bottom: 0">
          <el-button type="primary" size="medium" @click="submitForm">{{
            formType == "edit"
              ? "保存"
              : formType == "resubmit"
              ? "重新提交"
              : "提交"
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  addVisit,
  editVisit,
  getVisitDetail,
  getParamInfo,
  uploadFile,
} from "@/api/workorder/user/visit.js";
import { order } from "@/const/order/index.js";
import FileListOrder from "@/components/common/FileListOrder";
import { time } from "echarts";
export default {
  components: {
    FileListOrder,
  },
  data() {
    let _this = this;
    return {
      order: order,
      formType: "add",
      currentId: "",
      formData: {},
      formRules: {
        inviterId: [{ required: false, message: "请选择", trigger: "change" }],
        targetSchool: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        targetUserContact: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        targetUserName: [
          { required: true, message: "请输入受访人员姓名", trigger: "blur" },
        ],
        targetDepartment: [
          { required: true, message: "请输入受访部门", trigger: "blur" },
        ],
        visitHumanIdNo: [
          { required: true, message: "请输入访客身份证", trigger: "blur" },
        ],
        visitHumanName: [
          { required: true, message: "请输入访客姓名", trigger: "blur" },
        ],
        visitHumanPhone: [
          { required: true, message: "请输入访客手机号", trigger: "blur" },
        ],
        visitType: [
          { required: true, message: "请输入访问类型", trigger: "change" },
        ],
        visitDateBegin: [
          { required: true, message: "请选择访问日期", trigger: "change" },
        ],
        visitDetail: [
          { required: true, message: "请输入来访事由", trigger: "blur" },
        ],
        visitTime: [
          { required: true, message: "请选择访问时间", trigger: "change" },
          // 比对时间范围是否在可选范围内
          {
            validator: (rule, value, callback) => {
              if (
                value[0] < _this.timeRange.minTime ||
                value[1] > _this.timeRange.maxTime
              ) {
                callback(new Error("访问时间范围必须在可选范围内"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        visitHumanSum: [
          { required: true, message: "请输入", trigger: "blur" },
          // 比对是否为数字
          {
            validator: (rule, value, callback) => {
              if (isNaN(value)) {
                callback(new Error("请输入数字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      // 工程信息
      projectInfo: {},
      projectRules: {
        projectName: [{ required: true, message: "请输入", trigger: "blur" }],
        contactInfo: [{ required: true, message: "请输入", trigger: "blur" }],
        constructionArea: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        constructionContractor: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        constructionSupervisor: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        constructionDate: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        constructionTime: [
          { required: true, message: "请选择", trigger: "blur" },
          // 比对时间范围是否在可选范围内
          {
            validator: (rule, value, callback) => {
              if (
                value[0] < _this.timeRange.minTime ||
                value[1] > _this.timeRange.maxTime
              ) {
                callback(new Error("工作时间范围必须在可选范围内"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
      paramInfo: {},
      schoolList: [],
      schoolMap: {},
      userList: [],
      userMap: {},
      timeRange: {
        minTime: "00:00",
        maxTime: "23:59",
      },
      imageUrl: "",
    };
  },
  computed: {
    ...mapGetters(["dictpermissions"]),
  },
  watch: {},

  async created() {
    let query = this.$route.query;
    this.formType = query.type || "add";
    if (this.formType == "add") {
      this.formData = {
        visitType: Number(query.visitType),
      };
    }
    let data = await getParamInfo();
    this.initParamData(data);
  },
  methods: {
    async initParamData(data) {
      let { visitUserList, schoolMap, visitTimeBegin, visitTimeEnd } = data;
      this.timeRange = {
        minTime: visitTimeBegin,
        maxTime: visitTimeEnd,
      };
      Object.keys(schoolMap).forEach((key) => {
        this.schoolMap[schoolMap[key]] = key;
        this.schoolList.push({
          label: key,
          value: schoolMap[key],
        });
      });
      this.userList = visitUserList;
      if (this.formType === "edit" || this.formType === "resubmit") {
        this.currentId = this.$route.query.id;
        this.getDetail();
      }
    },
    // 新增
    addItem(data) {
      addVisit(data).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("新增成功");
          this.handleClose(data["visitType"]);
          this.$emit("getList");
        }
      });
    },
    // 编辑
    editItem(data) {
      editVisit(data).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.handleClose(data["visitType"]);
          this.$emit("getList");
        }
      });
    },
    getDetail() {
      getVisitDetail(this.currentId).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let data = res.data.data;
          this.formData = {
            ...data,
            visitTime: [data.visitTimeBegin, data.visitTimeEnd],
          };
          // 重新提交时，删除创建时间、访问时间、照片ID
          if (this.formType == "resubmit") {
            delete this.formData.id;
            delete this.formData.createTime;
            delete this.formData.visitDateBegin;
            delete this.formData.visitDateEnd;
            delete this.formData.visitHumanPhotoId;
            delete this.formData.uuid;
          }

          if (this.formData.visitHumanPhotoId) {
            this.imageUrl = `${process.env.VUE_APP_BASE_URL}/workorder/mobile/client/visitor/visit/info/photo/download/${this.currentId}`;
          }
          delete this.formData.projectInfo;
          if (data.targetUserName) {
            this.userList.forEach((item) => {
              if (data.targetUserName == item.name) {
                this.formData.visiter = item.id;
              }
            });
          }
          if (data.visitType == "1" && data.projectInfo) {
            this.projectInfo = {
              ...data.projectInfo,
              constructionDate: [
                data.projectInfo.constructionDateBegin,
                data.projectInfo.constructionDateEnd,
              ],
              constructionTime: [
                data.projectInfo.constructionTimeBegin,
                data.projectInfo.constructionTimeEnd,
              ],
            };
          } else {
            this.projectInfo = {};
          }
        }
      });
    },
    // 提交表单
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let formData = {
            ...this.formData,
            visitStatus: this.formData.visitStatus || 1,
            visitDateEnd: this.formData.visitDateBegin,
            visitTimeBegin: this.formData.visitTime[0],
            visitTimeEnd: this.formData.visitTime[1],
          };
          delete formData.visitDate;
          delete formData.visitTime;
          if (this.formData.visitType == "1") {
            this.$refs["projectForm"].validate((pass) => {
              if (pass) {
                formData["projectInfo"] = {
                  projectName: this.projectInfo.projectName,
                  contactInfo: this.projectInfo.contactInfo,
                  constructionArea: this.projectInfo.constructionArea,
                  constructionContractor:
                    this.projectInfo.constructionContractor,
                  constructionSupervisor:
                    this.projectInfo.constructionSupervisor,
                  constructionDateBegin: this.projectInfo.constructionDate[0],
                  constructionDateEnd: this.projectInfo.constructionDate[1],
                  constructionTimeBegin: this.projectInfo.constructionTime[0],
                  constructionTimeEnd: this.projectInfo.constructionTime[1],
                };
                console.log("this.formData", formData);
                this.sendData(formData);
              }
            });
          } else {
            console.log("this.formData", formData);
            this.sendData(formData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendData(formData) {
      switch (this.formType) {
        case "add":
          this.addItem(formData);
          break;
        case "edit":
          this.editItem(formData);
          break;
        case "resubmit":
          this.addItem(formData);
          break;
      }
    },
    // 访问类型改变时，清空工程信息
    changeVisitType() {
      if (this.formData.visitType == "1") {
        this.projectInfo = {};
      }
    },
    changeVisiter(e) {
      let userItem = this.userList.find((item) => item.id == e);
      this.formData.targetUserName = userItem.name;
      this.formData.targetDepartment = userItem.department;
      this.formData.targetUserContact = userItem.phone;
    },
    handleClose(type) {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      if (type == "1") {
        this.$router.push({
          path: "/oms/visit/project",
        });
      } else {
        this.$router.push({
          path: "/oms/visit/index",
        });
      }
    },
    async beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像只能是 JPG/PNG 格式!");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      let fileId = await uploadFile(formData);
      console.log("beforeAvatarUpload", fileId);
      this.formData = {
        ...this.formData,
        visitHumanPhotoId: fileId,
      };
      this.imageUrl = URL.createObjectURL(file);
      // this.imageUrl = `${process.env.VUE_APP_BASE_URL}/visit/info/photo/download/${fileId}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
