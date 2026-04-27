<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="schoolId"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['schoolId']"
                :placeholder="$t('common.请选择')"
                @change="changeSchool"
                :disabled="modalType == 'look'"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in dictionary['school']"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.学期')"
              prop="sectionId"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['sectionId']"
                :placeholder="$t('common.请选择')"
                @change="handleSectionChange"
                :disabled="modalType == 'look'"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in selectSectionList"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.学号')"
              prop="admissionNo"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-autocomplete
                style="width: 100%"
                class="inline-input"
                suffix-icon="el-icon-search"
                v-model="ruleForm['admissionNo']"
                :fetch-suggestions="querySearch"
                :placeholder="$t('common.请输入')"
                :trigger-on-focus="false"
                :disabled="modalType == 'look'"
                @select="handleSelect"
                @keyup.enter.native="handleSelect"
                @input="changeStyle('block', '.el-autocomplete-suggestion')"
                @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.姓名')"
              prop="studentName"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-input
                v-model="ruleForm.studentName"
                :placeholder="$t('common.请输入')"
                maxlength="50"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.年级')"
              prop="studentGrade"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-input
                v-model="ruleForm.studentGrade"
                :placeholder="$t('common.请输入')"
                maxlength="50"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.应缴金额')"
              prop="amountDue"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-input-number
                style="width: 100%"
                v-model="ruleForm.amountDue"
                :precision="2"
                :step="0.1"
                :min="0"
                :disabled="modalType == 'look'"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.接送方式')"
              prop="pickupMethod"
              style="width: 33%"
              :class="{ detailFormItem: modalType == 'look' }"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['pickupMethod']"
                :placeholder="$t('common.请选择')"
                :disabled="modalType == 'look'"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in pickupMethod"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <div class="df_center_wrap form_item" style="width: 100%">
              <div class="form_item_top df_sb">
                <span class="form_item_top_name">{{ $t("isagroup.路线选择") }}</span>
                <el-button
                  v-if="modalType != 'look'"
                  @click="addRoute"
                  class="button_text"
                  size="small"
                  type="text"
                  icon="el-icon-plus"
                  >{{ $t("isagroup.增加路线") }}</el-button
                >
              </div>
              <div style="width: 100%">
                <el-table
                  :header-cell-style="tablestyle.headercellstyle"
                  :data="routeTableData"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="(i, k) in tabletitle['bindRouteTable']"
                    :key="k"
                    :prop="i['prop']"
                    :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
                    show-overflow-tooltip
                    :width="`${i['width']}`"
                    :fixed="i['fixed']"
                  >
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    :label="$t('common.操作')"
                    width="100"
                    v-if="modalType != 'look'"
                  >
                    <template slot-scope="scope">
                      <span class="df_sb">
                        <el-button
                          class="button_text"
                          type="text"
                          size="small"
                          @click="editCurrentRoute(scope.row, scope.$index)"
                          >{{ $t("isagroup.编辑") }}</el-button
                        >
                        <el-button
                          class="button_text"
                          type="text"
                          size="small"
                          @click="delCurrentRoute(scope.row, scope.$index)"
                          >{{ $t("isagroup.删除") }}</el-button
                        >
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!-- <div class="df_center_wrap form_item" style="width: 100%">
              <div class="form_item_top df_sb">
                <span class="form_item_top_name">{{ $t("isagroup.接送信息") }}</span>
              </div>
            </div> -->
            <div
              v-if="ruleForm.pickupMethod == '2'"
              class="df_center_wrap form_item"
              style="width: 100%"
            >
              <div class="form_item_top df_sb">
                <span class="form_item_top_name">{{ $t("isagroup.接送人信息") }}</span>
                <el-button
                  v-if="modalType != 'look'"
                  @click="addPerson"
                  class="button_text"
                  size="small"
                  type="text"
                  icon="el-icon-plus"
                  >{{ $t("isagroup.增加接送人") }}</el-button
                >
              </div>
              <div class="isa_table">
                <div style="width: 100%">
                  <el-table
                    :header-cell-style="tablestyle.headercellstyle"
                    :data="personTableData"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(i, k) in tabletitle['bindPersonTable']"
                      :key="k"
                      :prop="i['prop']"
                      :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
                      show-overflow-tooltip
                      :width="`${i['width']}`"
                      :fixed="i['fixed']"
                    >
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      :label="$t('common.操作')"
                      width="100"
                      v-if="modalType != 'look'"
                    >
                      <template slot-scope="scope">
                        <span class="df_sb">
                          <el-button
                            class="button_text"
                            type="text"
                            size="small"
                            @click="editCurrentPerson(scope.row, scope.$index)"
                            >{{ $t("isagroup.编辑") }}</el-button
                          >
                          <el-button
                            class="button_text"
                            type="text"
                            size="small"
                            @click="delCurrentPerson(scope.row, scope.$index)"
                            >{{ $t("isagroup.删除") }}</el-button
                          >
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <el-form-item
            :label="$t('isagroup.审批状态')"
            prop="approvalStatus"
            style="width: 100%; margin-top: 20px"
            :class="{ detailFormItem: modalType == 'look' }"
          >
            <el-radio-group
              @change="changeApproval"
              style="width: 100%"
              v-model="ruleForm.approvalStatus"
              :disabled="modalType == 'look'"
            >
              <el-radio
                :label="i.value"
                :key="k"
                v-for="(i, k) in consts['approvalStatus']"
                >{{ i.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.approvalStatus == '2'"
            :label="$t('isagroup.拒绝理由')"
            prop="denyReason"
            style="width: 100%"
            :class="{ detailFormItem: modalType == 'look' }"
          >
            <el-input
              v-model="ruleForm.denyReason"
              :placeholder="$t('common.请输入')"
              maxlength="300"
              type="textarea"
              :rows="4"
              show-word-limit
              :disabled="modalType == 'look'"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('isagroup.缴费状态')"
            prop="paymentStatus"
            style="width: 100%"
            :class="{ detailFormItem: modalType == 'look' }"
          >
            <el-radio-group
              @change="changePayment"
              style="width: 100%; display: flex"
              v-model="ruleForm.paymentStatus"
            >
              <el-radio
                style="display: flex; align-items: center"
                :label="i.value"
                :key="k"
                v-for="(i, k) in consts['paymentStatus']"
                :disabled="modalType == 'look'"
              >
                <div style="display: flex; align-items: center">
                  {{ i.label }}
                  <el-input-number
                    v-if="ruleForm.paymentStatus == '1' && i.value == '1'"
                    style="width: 100px; margin-left: 5px"
                    v-model="ruleForm.paymentAmount"
                    :precision="2"
                    :step="0.1"
                    :min="0"
                    :disabled="modalType == 'look'"
                  ></el-input-number>
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.paymentStatus == '1'"
            :label="$t('isagroup.签名')"
            prop="signImageUrl"
            style="width: 33%"
          >
            <UploadSignupFile
              ref="UploadSignupFile"
              :limit="1"
              types="image/*"
              @upload-success="uploadSignup"
            />
          </el-form-item>
          <el-form-item class="modalFromBtn" v-if="modalType != 'look'">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("consult.保存")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 新增路线 -->
      <el-dialog
        style="z-index: 99999"
        :title="$t('isagroup')[typeObj[routeModalType]]"
        :visible.sync="showRouteModal"
        width="450px"
        :before-close="closeRoute"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :modal="false"
      >
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="routeForm"
          :rules="routeRules"
          :modal="false"
          ref="routeForm"
        >
          <div class="moadlFromBox">
            <el-form-item style="width: 100%" :label="$t('isagroup.路线')" prop="lineId">
              <el-select
                style="width: 100%"
                v-model="routeForm['lineId']"
                :placeholder="$t('common.请选择')"
                @change="changeLine"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in selectLineList"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.路线类型')"
              prop="studentLineType"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                v-model="routeForm['studentLineType']"
                :placeholder="$t('common.请选择')"
                @change="changeLineType"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['routeType']"
                  :label="$t('isagroup')[i.label]"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              style="width: 100%"
              :label="$t('isagroup.站点')"
              prop="stationId"
            >
              <el-select
                style="width: 100%"
                v-model="routeForm['stationId']"
                :placeholder="$t('common.请选择')"
                @change="changeStation"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in stationList"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.起止时间')"
              prop="ridingDay"
              style="width: 100%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="routeForm.ridingDay"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                @change="changeRidingDay"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="modalFromBtn">
              <el-button type="default" size="small" @click="closeRoute">{{
                $t("consult.取消")
              }}</el-button>
              <el-button size="small" type="primary" @click="submitRouteForm">
                {{ $t("consult.保存") }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
      <!-- 新增接送人 -->
      <el-dialog
        style="z-index: 99999"
        :title="$t('isagroup')[typeObj[personModalType]]"
        :visible.sync="showPersonModal"
        width="350px"
        :before-close="closePerson"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :modal="false"
      >
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="personForm"
          :rules="personRules"
          :modal="false"
          ref="personForm"
        >
          <div class="moadlFromBox">
            <el-form-item
              style="width: 100%"
              :label="$t('isagroup.关系')"
              prop="stationId"
            >
              <el-input
                v-model="personForm.pickupRelationships"
                :placeholder="$t('common.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="width: 100%"
              :label="$t('isagroup.联系方式')"
              prop="stationId"
            >
              <el-input
                v-model="personForm.pickupPhone"
                :placeholder="$t('common.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="width: 100%"
              :label="$t('isagroup.照片')"
              prop="pickupImageUrl"
            >
              <UploadPersonFile
                ref="UploadPersonFile"
                :limit="1"
                types="image/*"
                @upload-success="uploadPerson"
              />
            </el-form-item>
            <el-form-item class="modalFromBtn">
              <el-button type="default" size="small" @click="closePerson">{{
                $t("consult.取消")
              }}</el-button>
              <el-button size="small" type="primary" @click="submitPersonForm">
                {{ $t("consult.保存") }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getLineList,
  getPickupMethodList,
  getStationList,
} from "@/api/isacommunity/buscommon.js";
import {
  getStudentInfo,
  addOrder,
  editOrder,
  getLineStationPrice,
  getOrderDetail,
} from "@/api/isacommunity/busorder.js";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import UploadPersonFile from "@/components/communitycommon/uploadFile.vue";
import UploadSignupFile from "@/components/communitycommon/uploadFile.vue";
import _ from "lodash";
export default {
  name: "operation",
  components: { Table, UploadPersonFile, UploadSignupFile },
  props: {},

  data() {
    let that = this;
    return {
      consts: consts,
      tabletitle: tabletitle,
      tablestyle: {
        headercellstyle: {
          background: "#F5F8FD",
          color: "#333333 !important",
          "font-size": "14px",
          "font-weight": "400",
          height: "38px",
          "font-family": "AlibabaPuHuiTiM",
        },
        rowstyle: {
          color: " #666666",
          "font-size": "14px",
          "font-weight": "400",
          height: "44px",
          padding: "0px",
        },
      },
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolId: [{ required: true, message: "请选择", trigger: "blur" }],
        sectionId: [{ required: true, message: "请选择", trigger: "blur" }],
        admissionNo: [{ required: false, message: "请选择", trigger: "blur" }],
        pickupMethod: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      //   路线
      selectLineList: [],
      //   学期
      selectSectionList: [],
      //   接送放式
      pickupMethod: [],
      //   站点
      stationList: [],
      //   新增路线
      routeModalType: "add",
      routeIndex: -1,
      routeTableData: [],
      showRouteModal: false, // 新增路线弹窗
      routeForm: {}, // 新增路线表单
      routeRules: {
        lineId: [{ required: true, message: "请选择", trigger: "blur" }],
        stationId: [{ required: true, message: "请选择", trigger: "blur" }],
        studentLineType: [{ required: true, message: "请选择", trigger: "blur" }],
        ridingDay: [{ required: true, message: "请选择", trigger: "blur" }],
      }, // 新增路线表单校验规则
      //   新增接送人
      personModalType: "add",
      personIndex: -1,
      personTableData: [],
      showPersonModal: false, // 新增路线弹窗
      personForm: {}, // 新增路线表单
      personRules: {}, // 新增路线表单校验规则
      studentStr: "", // 学生信息
      pickerOptions: {
        disabledDate: (time) => {
          if (!that.ruleForm.sectionId) return false;
          const selectedSection = that.selectSectionList.find(
            (section) => section.id === that.ruleForm.sectionId
          );
          if (selectedSection) {
            const sectionStart = new Date(selectedSection.serviceStartDate).getTime();
            const sectionEnd = new Date(selectedSection.serviceEndDate).getTime();
            const disabledDate =
              time.getTime() < sectionStart || time.getTime() > sectionEnd;
            return disabledDate;
          }
          return false;
        },
      },
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
    routeTableDataClone() {
      return JSON.parse(JSON.stringify(this.routeTableData));
    },
  },
  watch: {
    // 监听 routeTableDataClone 变化
    routeTableDataClone: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getLineStationPrice();
        }
      },
      deep: true, // 深度监听
    },
  },
  methods: {
    async getSelectList() {
      this.pickupMethod = await getPickupMethodList();
    },
    // 打开
    showForm(type = "add", item = {}) {
      console.log("222showForm", type);

      this.modalType = type;
      this.showModal = true;
      if (this.modalType != "add") {
        this.getDetail(item.id);
      }
    },
    // 新增
    addData(data) {
      addOrder(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editOrder(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 初始化数据
    initData() {
      this.getSelectList();
      // 重置表单和选择范围
      this.ruleForm = {};
      this.$set(this, "pickerOptions", { ...this.pickerOptions });
    },
    // 获取详情
    getDetail(id) {
      getOrderDetail(id).then(async (res) => {
        if (res.data.success) {
          let data = res.data.data;
          let {
            schoolId,
            sectionId,
            admissionNo,
            pickupMethod,
            studentName,
            studentGrade,
            amountDue,
            approvalStatus,
            denyReason,
            paymentStatus,
            paymentAmount,
            signImageUrl,
            orderLines,
            parentInfos,
          } = data;
          this.selectSectionList = await getSectionList({ schoolIds: schoolId });
          this.selectLineList = await getLineList({
            schoolIds: schoolId,
            sectionId: sectionId,
          });
          if (orderLines.length > 0) {
            let lineId = orderLines[0].lineId;
            this.stationList = await getStationList({
              schoolIds: schoolId,
              lineId: lineId,
            });
          }

          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              schoolId,
              sectionId,
              admissionNo,
              pickupMethod: String(pickupMethod),
              studentName,
              studentGrade,
              amountDue,
              approvalStatus: String(approvalStatus),
              denyReason,
              paymentStatus: String(paymentStatus),
              paymentAmount,
              signImageUrl,
            };
            this.personTableData = parentInfos.map((item) => {
              return {
                pickupRelationships: item.pickupRelationships,
                pickupPhone: item.pickupPhone,
                pickupImageUrl: item.pickupImageUrl,
              };
            });
            this.routeTableData = orderLines.map((item) => {
              return {
                lineId: item.lineId,
                stationId: item.stationId,
                studentLineType: String(item.studentLineType),
                ridingStartDay: item.ridingStartDay,
                ridingEndDay: item.ridingEndDay,
                ridingDay: [item.ridingStartDay, item.ridingEndDay],
                lineName: item.lineEnName,
                stationName: item.stationEnName,
                lineTypeName: String(item.studentLineType) == "1" ? "日车" : "周车",
              };
            });
            if (signImageUrl) {
              this.$nextTick(() => {
                this.$refs.UploadSignupFile.imageUrl = signImageUrl;
              });
            }
          });
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log("submitForm", valid, this.ruleForm);
        if (valid) {
          let data = {
            schoolId: this.ruleForm.schoolId,
            sectionId: this.ruleForm.sectionId,
            admissionNo: this.ruleForm.admissionNo,
            pickupMethod: this.ruleForm.pickupMethod,
            studentName: this.ruleForm.studentName,
            studentGrade: this.ruleForm.studentGrade,
            amountDue: this.ruleForm.amountDue,
            approvalStatus: this.ruleForm.approvalStatus,
            denyReason: this.ruleForm.denyReason,
            paymentStatus: this.ruleForm.paymentStatus,
            paymentAmount: this.ruleForm.paymentAmount,
            signImageUrl: this.ruleForm.signImageUrl,
            orderLines: [],
            parentInfos: [],
          };
          if (this.routeTableData.length > 0) {
            data["orderLines"] = this.routeTableData.map((item) => {
              return {
                lineId: item.lineId,
                stationId: item.stationId,
                studentLineType: item.studentLineType,
                ridingStartDay: item.ridingStartDay,
                ridingEndDay: item.ridingEndDay,
              };
            });
          }
          if (this.personTableData.length > 0 && data["pickupMethod"] == "2") {
            data["parentInfos"] = _.cloneDeep(this.personTableData);
          }

          if (this.modalType == "add") {
            this.addData(data);
          } else {
            data["id"] = this.ruleForm.id;
            this.editData(data);
          }
        }
      });
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
    },

    // 选择校区
    async changeSchool(e) {
      this.routeForm["schoolId"] = e;
      delete this.ruleForm["stationId"];
      this.selectSectionList = await getSectionList({ schoolIds: e });
    },
    // 挂载查询到的学生
    async querySearch(queryString, cb) {
      getStudentInfo({
        schoolId: this.ruleForm["schoolId"],
        admissionNo: queryString,
      }).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          //   data["value"] = data["fullName"] + (data["grade"] ? "-" + data["grade"] : "");
          data["value"] = data["admissonNo"];
          let list = [data];
          cb(list);
        } else {
          cb([]);
        }
      });
    },
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, className) {
      let dom = document.querySelectorAll(className);
      dom[0].style.display = status;
    },
    handleSelect(item) {
      this.changeStyle("none", ".el-autocomplete-suggestion");
      this.ruleForm["studentName"] = item["fullName"]; //姓名
      this.ruleForm["studentGrade"] = item["grade"]; //年级
      this.ruleForm["admissionNo"] = item["admissonNo"]; //学号
    },
    // 当学期选择变化时，更新时间选择范围
    async handleSectionChange(e) {
      this.$set(this, "pickerOptions", { ...this.pickerOptions });
      this.selectLineList = await getLineList({
        schoolIds: this.ruleForm["schoolId"],
        sectionId: e,
      });
    },
    // 选择路线
    async changeLine(e) {
      this.routeForm["lineId"] = e;
      delete this.routeForm["stationId"];
      this.selectLineList.map((item) => {
        if (item.id == e) {
          this.routeForm["lineName"] = item.enName;
          this.routeForm["carNumber"] = item.carNumber;
        }
      });
      this.stationList = await getStationList({
        schoolIds: this.ruleForm["schoolId"],
        lineId: e,
      });
    },
    // 选择路线类型
    changeLineType(e) {
      this.routeForm["studentLineType"] = e;
      consts["routeType"].map((item) => {
        if (item.value == e) {
          this.routeForm["lineTypeName"] = item.label;
        }
      });
    },
    // 选择站点
    changeStation(e) {
      this.routeForm["stationId"] = e;
      this.stationList.map((item) => {
        if (item.id == e) {
          this.routeForm["stationName"] = item.enName;
        }
      });
    },
    // 选择时间
    changeRidingDay(e) {
      if (e) {
        this.routeForm["ridingStartDay"] = e[0];
        this.routeForm["ridingEndDay"] = e[1];
      }
    },
    // 路线操作
    submitRouteForm() {
      this.$refs.routeForm.validate((valid) => {
        if (valid) {
          console.log("submitRouteForm", this.routeForm);
          const routeForm = _.cloneDeep(this.routeForm);
          if (this.routeModalType == "add") {
            this.routeTableData.push({ ...routeForm });
          } else {
            this.$set(this.routeTableData, this.routeIndex, { ...routeForm });
          }
          this.showRouteModal = false;
          this.$refs.routeForm.resetFields();
        }
      });
    },
    addRoute() {
      this.routeModalType = "add";
      this.showRouteModal = true;
    },
    closeRoute() {
      this.showRouteModal = false;
      this.routeIndex = -1;
      this.$refs.routeForm.resetFields();
    },
    editCurrentRoute(item, index) {
      this.routeIndex = index;
      this.routeForm = { ...item };
      this.routeModalType = "edit";
      this.showRouteModal = true;
    },
    delCurrentRoute(item, index) {
      this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
        confirmButtonText: this.$t("isagroup.确定"),
      }).then(() => {
        this.routeTableData.splice(index, 1);
      });
    },
    // 接送人操作
    submitPersonForm() {
      this.$refs.personForm.validate((valid) => {
        if (valid) {
          const personForm = _.cloneDeep(this.personForm);
          if (this.personModalType == "add") {
            this.personTableData.push({ ...personForm });
          } else {
            this.$set(this.personTableData, this.personIndex, { ...personForm });
          }
          this.showPersonModal = false;
          this.$refs.personForm.resetFields();
        }
      });
    },
    addPerson() {
      this.personModalType = "add";
      this.showPersonModal = true;
    },

    closePerson() {
      this.personModalType = "add";
      this.personIndex = -1;
      this.showPersonModal = false;
      this.$refs.personForm.resetFields();
    },
    editCurrentPerson(item, index) {
      this.personForm = { ...item };
      this.personIndex = index;
      this.personModalType = "edit";
      this.showPersonModal = true;
      if (this.personForm["pickupImageUrl"]) {
        this.$nextTick(() => {
          this.$refs.UploadPersonFile.imageUrl = this.personForm["pickupImageUrl"];
        });
      }
    },
    delCurrentPerson(item, index) {
      this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
        confirmButtonText: this.$t("isagroup.确定"),
      }).then(() => {
        this.personTableData.splice(index, 1);
      });
    },
    // 根据路线ID和站点ID查询价格
    async getLineStationPrice() {
      console.log(" this.routeTableData", this.routeTableData);
      let data = this.routeTableData.map((item) => {
        return {
          lineId: item.lineId,
          stationId: item.stationId,
          studentLineType: item.studentLineType,
        };
      });
      let amountDue = await getLineStationPrice(data);
      this.ruleForm = {
        ...this.ruleForm,
        amountDue,
      };
    },
    lineNameEn(id) {
      const item = this.selectStationList.find((item) => item.id == id);
      return item ? item.enName : "";
    },
    stationNameEn(id) {
      const item = this.stationList.find((item) => item.id == id);
      return item ? item.enName : "";
    },
    routeTypeNameEn(id) {
      const item = consts["routeType"].find((item) => item.value == id);
      return item ? item.enName : "";
    },
    // 上传接送人图片
    uploadPerson(data) {
      this.personForm["pickupImageUrl"] = data;
    },
    // 上传签名图片
    uploadSignup(data) {
      this.ruleForm["signImageUrl"] = data;
    },
    changeApproval(e) {
      delete this.routeForm["denyReason"];
    },
    changePayment(e) {
      delete this.routeForm["paymentAmount"];
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
