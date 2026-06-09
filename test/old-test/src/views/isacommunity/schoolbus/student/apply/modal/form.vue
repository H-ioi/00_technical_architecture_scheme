<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ pageTitle }}</div>
      <div class="community_top_btn">
        <el-button size="medium" @click="goBack">{{ $t('btn.返回') }}</el-button>
        <el-button v-if="modalType !== 'look'" type="primary" size="medium" :loading="isSubmitting" @click="submitForm('ruleForm')">
          {{ $t('btn.保存') }}
        </el-button>
      </div>
    </div>
    <div class="community_centent_v2 schoolbus-form-page" v-loading="pageLoading">
      <div class="schoolbus-form-page__inner moadlFromBox">
        <el-form class="schoolbus-apply-form" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleForm">
          <!-- 基本信息 -->
          <section class="schoolbus-apply-form__section">
            <div class="schoolbus-apply-form__grid schoolbus-apply-form__grid--3">
              <el-form-item :label="$t('schoolbus.校区')" prop="schoolId">
                <el-select
                  style="width: 100%"
                  v-model="ruleForm['schoolId']"
                  :placeholder="$t('common.请选择')"
                  @change="changeSchool"
                  :disabled="formDisabled()">
                  <el-option v-for="(i, k) in schoolSelectList" :key="k" :label="schoolDropdownLabel(i)" :value="i.id" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('schoolbus.学期')" prop="sectionId">
                <el-select
                  filterable
                  style="width: 100%"
                  v-model="ruleForm['sectionId']"
                  :placeholder="$t('common.请选择')"
                  @change="handleSectionChange"
                  :disabled="formDisabled()">
                  <el-option v-for="(i, k) in selectSectionList" :key="k" :label="i18nlocel == 'en' ? i.enName : i.cnName" :value="i.id" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('schoolbus.学号')" prop="admissionNo">
                <el-autocomplete
                  style="width: 100%"
                  class="inline-input"
                  suffix-icon="el-icon-search"
                  v-model="ruleForm['admissionNo']"
                  :fetch-suggestions="querySearch"
                  :placeholder="$t('common.请输入')"
                  :trigger-on-focus="false"
                  :disabled="formDisabled()"
                  @select="handleSelect"
                  @keyup.enter.native="handleSelect"
                  @input="changeStyle('block', '.el-autocomplete-suggestion')"
                  @keyup="changeStyle('block', '.el-autocomplete-suggestion')" />
              </el-form-item>
            </div>
            <div class="schoolbus-apply-form__grid schoolbus-apply-form__grid--3">
              <el-form-item :label="$t('schoolbus.姓名')" prop="studentName" :class="{ detailFormItem: modalType == 'look' }">
                <el-input v-model="ruleForm.studentName" :placeholder="$t('common.请输入')" maxlength="50" disabled />
              </el-form-item>
              <el-form-item :label="$t('schoolbus.年级')" prop="studentGrade" :class="{ detailFormItem: modalType == 'look' }">
                <el-input v-model="ruleForm.studentGrade" :placeholder="$t('common.请输入')" maxlength="50" disabled />
              </el-form-item>
              <el-form-item :label="$t('schoolbus.应缴金额')" prop="amountDue">
                <el-input-number style="width: 100%" v-model="ruleForm.amountDue" :precision="2" :step="0.1" :min="0" :disabled="formDisabled()" />
              </el-form-item>
            </div>
            <div class="schoolbus-apply-form__grid schoolbus-apply-form__grid--1">
              <el-form-item :label="$t('schoolbus.接送方式')" prop="pickupMethod">
                <el-select style="width: 100%" v-model="ruleForm['pickupMethod']" :placeholder="$t('common.请选择')" :disabled="formDisabled()">
                  <el-option v-for="(i, k) in pickupMethodOptions" :key="k" :label="i18nlocel == 'en' ? i.enLabel : i.label" :value="i.value" />
                </el-select>
              </el-form-item>
            </div>
          </section>

          <!-- 路线选择 -->
          <section class="schoolbus-apply-form__section">
            <div class="schoolbus-apply-form__section-head">
              <span>{{ $t('schoolbus.路线选择') }}</span>
              <el-button v-if="!formDisabled() && routeTableData.length < 2" class="button_text" size="small" type="text" icon="el-icon-plus" @click="addRoute">
                {{ $t('schoolbus.增加路线') }}
              </el-button>
            </div>
            <el-table :header-cell-style="tablestyle.headercellstyle" :data="routeTableData" style="width: 100%">
              <el-table-column
                v-for="(i, k) in bindRouteTableColumns"
                :key="k"
                :prop="i['prop']"
                :label="i['label']"
                show-overflow-tooltip
                :width="`${i['width']}`"
                :min-width="i['minWidth']"
                :fixed="i['fixed']" />
              <el-table-column fixed="right" :label="$t('common.操作')" width="120">
                <template slot-scope="scope">
                  <el-button class="button_text" type="text" size="small" @click="editCurrentRoute(scope.row, scope.$index)">
                    {{ $t('schoolbus.编辑') }}
                  </el-button>
                  <el-button v-if="!formDisabled()" class="button_text" type="text" size="small" @click="delCurrentRoute(scope.row, scope.$index)">
                    {{ $t('schoolbus.删除') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </section>

          <!-- 接送人（接送方式为接送人时展示） -->
          <section v-if="ruleForm.pickupMethod == '2'" class="schoolbus-apply-form__section">
            <div class="schoolbus-apply-form__section-head">
              <span>{{ $t('schoolbus.接送人信息') }}</span>
              <el-button class="button_text" size="small" type="text" icon="el-icon-plus" @click="addPerson">
                {{ $t('schoolbus.增加接送人') }}
              </el-button>
            </div>
            <el-table :header-cell-style="tablestyle.headercellstyle" :data="personTableData" style="width: 100%">
              <el-table-column
                v-for="(i, k) in bindPersonTableColumns"
                :key="k"
                :prop="i['prop']"
                :label="i['label']"
                show-overflow-tooltip
                :width="`${i['width']}`"
                :min-width="i['minWidth']"
                :fixed="i['fixed']" />
              <el-table-column fixed="right" :label="$t('common.操作')" width="120">
                <template slot-scope="scope">
                  <el-button class="button_text" type="text" size="small" @click="editCurrentPerson(scope.row, scope.$index)">
                    {{ $t('schoolbus.编辑') }}
                  </el-button>
                  <el-button class="button_text" type="text" size="small" @click="delCurrentPerson(scope.row, scope.$index)">
                    {{ $t('schoolbus.删除') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </section>

          <!-- 审批状态 + 签名 -->
          <section class="schoolbus-apply-form__section schoolbus-apply-form__section--last">
            <div class="schoolbus-apply-form__footer-row">
              <div class="schoolbus-apply-form__footer-col">
                <el-form-item :label="$t('schoolbus.审批状态')" prop="approvalStatus">
                  <el-radio-group
                    v-if="formType == 'apply'"
                    v-model="ruleForm.approvalStatus"
                    :disabled="formDisabled() || ruleForm.approvalStatus == '2'"
                    @change="changeApproval">
                    <el-radio v-for="(i, k) in approvalStatusOptions" :key="k" :label="i.value">
                      {{ $t('schoolbus')[i.label] }}
                    </el-radio>
                  </el-radio-group>
                  <el-radio-group v-else v-model="ruleForm.approvalStatus" @change="changeApproval">
                    <el-radio :label="'1'">{{ $t('schoolbus.同意') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.approvalStatus == '2'" :label="$t('schoolbus.拒绝理由')" prop="denyReason">
                  <el-input
                    v-model="ruleForm.denyReason"
                    :placeholder="$t('common.请输入')"
                    maxlength="300"
                    type="textarea"
                    :rows="4"
                    show-word-limit
                    :disabled="formDisabled()" />
                </el-form-item>
                <el-form-item v-if="ruleForm.approvalStatus == '1'" :label="$t('schoolbus.缴费状态')" prop="paymentStatus">
                  <el-radio-group v-if="formType == 'apply'" v-model="ruleForm.paymentStatus" @change="changePayment">
                    <el-radio v-for="(i, k) in paymentStatusOptions" :key="k" :label="i.value" style="display: flex; align-items: center; margin-right: 16px">
                      <span style="display: inline-flex; align-items: center">
                        {{ $t('schoolbus')[i.label] }}
                        <el-input-number
                          v-if="ruleForm.paymentStatus == '2' && i.value == '2' && permissions['isshow_bus_intentionorder_pay_info']"
                          style="width: 100px; margin-left: 8px"
                          v-model="ruleForm.paymentAmount"
                          :precision="2"
                          :step="0.1"
                          :min="0"
                          :disabled="!permissions['isedit_bus_intentionorder_pay_info']" />
                      </span>
                    </el-radio>
                  </el-radio-group>
                  <el-radio-group v-else v-model="ruleForm.paymentStatus" @change="changePayment">
                    <el-radio :label="'2'">
                      <span style="display: inline-flex; align-items: center">
                        {{ $t('schoolbus.缴费') }}
                        <el-input-number
                          v-if="permissions['isshow_bus_intentionorder_pay_info']"
                          style="width: 100px; margin-left: 8px"
                          v-model="ruleForm.paymentAmount"
                          :precision="2"
                          :step="0.1"
                          :min="0"
                          :disabled="!permissions['isedit_bus_intentionorder_pay_info']" />
                      </span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="schoolbus-apply-form__footer-col">
                <el-form-item :label="$t('schoolbus.签名')" prop="signImageUrl">
                  <div class="schoolbus-apply-form__signature-box">
                    <UploadSignupFile
                      ref="UploadSignupFile"
                      layout="fill"
                      :box-height="168"
                      hide-border
                      :placeholder="$t('schoolbus.点击上传或在此区域手写签名')"
                      :limit="1"
                      types="image/*"
                      :disabled="formDisabled()"
                      @upload-success="uploadSignup" />
                  </div>
                </el-form-item>
              </div>
            </div>
            <div
              v-if="permissions['isshow_bus_intentionorder_pay_info'] && ruleForm.paymentStatus == '2'"
              class="schoolbus-apply-form__extra schoolbus-apply-form__grid schoolbus-apply-form__grid--3">
              <el-form-item :label="$t('schoolbus.缴费方式')" prop="paymentMethod">
                <el-select
                  style="width: 100%"
                  v-model="ruleForm['paymentMethod']"
                  :placeholder="$t('common.请选择')"
                  :disabled="!permissions['isedit_bus_intentionorder_pay_info']">
                  <el-option v-for="(i, k) in paymentMethodOptions" :key="k" :label="i18nlocel == 'en' ? i.enLabel : i.label" :value="i.value" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('schoolbus.缴费日期')" prop="paymentDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="ruleForm.paymentDate"
                  type="date"
                  :placeholder="$t('common.请选择')"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  format="yyyy-MM-dd hh:mm:ss"
                  :disabled="!permissions['isedit_bus_intentionorder_pay_info']" />
              </el-form-item>
              <el-form-item :label="$t('schoolbus.缴费账号')" prop="paymentAccount">
                <el-input
                  v-model="ruleForm.paymentAccount"
                  :placeholder="$t('common.请输入')"
                  maxlength="50"
                  :disabled="!permissions['isedit_bus_intentionorder_pay_info']" />
              </el-form-item>
              <el-form-item :label="$t('schoolbus.缴费单号')" prop="paymentOrderNo">
                <el-input
                  v-model="ruleForm.paymentOrderNo"
                  :placeholder="$t('common.请输入')"
                  maxlength="50"
                  :disabled="!permissions['isedit_bus_intentionorder_pay_info']" />
              </el-form-item>
              <el-form-item :label="$t('schoolbus.收款账号')" prop="receivingAccount">
                <el-input
                  v-model="ruleForm.receivingAccount"
                  :placeholder="$t('common.请输入')"
                  maxlength="50"
                  :disabled="!permissions['isedit_bus_intentionorder_pay_info']" />
              </el-form-item>
            </div>
          </section>
        </el-form>
      </div>
    </div>
    <!-- 新增路线（子表单仍为弹窗） -->
    <el-dialog
      style="z-index: 99999"
      :title="$t('schoolbus')[typeObj[routeModalType]]"
      :visible.sync="showRouteModal"
      width="450px"
      :before-close="closeRoute"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-form :label-position="'top'" :inline="true" :model="routeForm" :rules="routeRules" ref="routeForm">
        <div class="moadlFromBox">
          <el-form-item style="width: 100%" :label="$t('schoolbus.路线')" prop="lineId">
            <el-select
              filterable
              style="width: 100%"
              v-model="routeForm['lineId']"
              :placeholder="$t('common.请选择')"
              @change="changeLine"
              :disabled="formDisabled()">
              <el-option :key="k" v-for="(i, k) in selectLineList" :label="i18nlocel == 'en' ? i.enName : i.cnName" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schoolbus.乘车类型')" prop="studentLineType" style="width: 100%">
            <el-select
              style="width: 100%"
              v-model="routeForm['studentLineType']"
              :placeholder="$t('common.请选择')"
              @change="changeLineType"
              :disabled="formDisabled()">
              <el-option :key="k" v-for="(i, k) in studentLineTypeOptions" :label="$t('schoolbus')[i.label]" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schoolbus.车牌号')" prop="carinfoId" style="width: 100%">
            <el-select style="width: 100%" v-model="routeForm['carinfoId']" :placeholder="$t('common.请选择')" @change="changeCar">
              <el-option :key="k" v-for="(i, k) in carList" :label="i.carNumber" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schoolbus.日期')" prop="weekDaysId" style="width: 100%">
            <el-select
              style="width: 100%"
              v-model="routeForm['weekDaysId']"
              :placeholder="$t('common.请选择')"
              @change="changeWeekDays"
              :disabled="formDisabled()">
              <el-option :key="k" v-for="(i, k) in weekDaysList" :label="i.weekDays" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schoolbus.乘车星期')" prop="ridingWeekDay" style="width: 100%">
            <el-select style="width: 100%" multiple v-model="routeForm['ridingWeekDay']" :placeholder="$t('common.请选择')" :disabled="formDisabled()">
              <el-option :key="k" v-for="(i, k) in ridingWeekDays" :label="i" :value="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('schoolbus.站点')" prop="stationPriceId">
            <el-select
              filterable
              style="width: 100%"
              v-model="routeForm['stationPriceId']"
              :placeholder="$t('common.请选择')"
              @change="changeStation"
              :disabled="formDisabled()">
              <el-option :key="k" v-for="(i, k) in stationList" :label="i18nlocel == 'en' ? i.enName : i.cnName" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schoolbus.起止时间')" prop="ridingDay" style="width: 100%">
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
              @change="changeRidingDay"></el-date-picker>
          </el-form-item>
          <el-form-item class="modalFromBtn">
            <el-button type="default" size="small" @click="closeRoute">{{ $t('consult.取消') }}</el-button>
            <el-button size="small" type="primary" @click="submitRouteForm">
              {{ $t('consult.保存') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <!-- 新增接送人 -->
    <el-dialog
      style="z-index: 99999"
      :title="$t('schoolbus')[typeObj[personModalType]]"
      :visible.sync="showPersonModal"
      width="350px"
      :before-close="closePerson"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
      <el-form :label-position="'top'" :inline="true" :model="personForm" :rules="personRules" ref="personForm">
        <div class="moadlFromBox">
          <el-form-item style="width: 100%" :label="$t('schoolbus.关系')" prop="pickupRelationships">
            <el-input v-model="personForm.pickupRelationships" :placeholder="$t('common.请输入')" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('schoolbus.联系方式')" prop="pickupPhone">
            <el-input v-model="personForm.pickupPhone" :placeholder="$t('common.请输入')" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('schoolbus.照片')" prop="pickupImageUrl">
            <UploadPersonFile ref="UploadPersonFile" :limit="1" types="image/*" @upload-success="uploadPerson" />
          </el-form-item>
          <el-form-item class="modalFromBtn">
            <el-button type="default" size="small" @click="closePerson">{{ $t('consult.取消') }}</el-button>
            <el-button size="small" type="primary" @click="submitPersonForm">
              {{ $t('consult.保存') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCarinfoList, getLineList, getOrderStationList, getSectionList } from '@/api/isacommunity/buscommon.js'
import { addOrder, editOrder, getLineStationPrice, getOrderDetail, getStudentInfoList } from '@/api/isacommunity/busorder.js'
import Table from '@/components/communitycommon/Table.vue'
import { default as UploadPersonFile, default as UploadSignupFile } from '@/components/communitycommon/uploadFile.vue'
import { SCHOOLBUS_PATHS } from '@/const/isacommunity/schoolbusRoutes.js'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import {
  BUS_APPROVAL_STATUS,
  BUS_PAYMENT_METHOD,
  BUS_PAYMENT_STATUS,
  BUS_PICKUP_METHOD,
  BUS_ROUTE_TYPE,
  BUS_STUDENT_LINE_TYPE,
  BUS_TABLE_STYLE,
  bindPersonTableColumns,
  bindRouteTableColumns
} from '../../../schoolbusConsts.js'
export default {
  name: 'operation',
  mixins: [schoolListBuscommonMixin],
  components: { Table, UploadPersonFile, UploadSignupFile },
  props: {
    formType: { type: String, default: 'apply' }
  },

  data() {
    let that = this
    return {
      pickupMethodOptions: BUS_PICKUP_METHOD,
      approvalStatusOptions: BUS_APPROVAL_STATUS,
      paymentStatusOptions: BUS_PAYMENT_STATUS,
      paymentMethodOptions: BUS_PAYMENT_METHOD,
      studentLineTypeOptions: BUS_STUDENT_LINE_TYPE,
      routeTypeOptions: BUS_ROUTE_TYPE,
      tablestyle: BUS_TABLE_STYLE,
      typeObj: { add: '新增', edit: '编辑', look: '查看' },
      modalType: 'add',
      pageLoading: false,
      isSubmitting: false,
      ruleForm: {},
      rules: {
        schoolId: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        sectionId: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        admissionNo: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        pickupMethod: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        paymentMethod: [{ required: false, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        paymentDate: [{ required: false, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        paymentAmount: [{ required: false, message: that.$t('schoolbus.请输入'), trigger: 'blur' }]
      },
      //   路线
      selectLineList: [],
      //   学期
      selectSectionList: [],
      //   日期
      weekDaysList: [],
      //   路线关联车辆
      carList: [],
      //   乘车日期
      ridingWeekDays: [],
      //   站点
      stationList: [],
      //   新增路线
      routeModalType: 'add',
      routeIndex: -1,
      routeTableData: [],
      showRouteModal: false, // 新增路线弹窗
      routeForm: {}, // 新增路线表单
      // 新增路线表单校验规则
      routeRules: {
        lineId: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        stationPriceId: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        studentLineType: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        ridingDay: [{ required: true, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        ridingWeekDay: [{ required: false, message: that.$t('schoolbus.请选择'), trigger: 'blur' }],
        carinfoId: [{ required: false, message: that.$t('schoolbus.请选择'), trigger: 'blur' }]
      },

      //   新增接送人
      personModalType: 'add',
      personIndex: -1,
      personTableData: [],
      showPersonModal: false, // 新增路线弹窗
      personForm: {}, // 新增路线表单
      personRules: {
        pickupRelationships: [{ required: true, message: that.$t('schoolbus.请输入'), trigger: 'blur' }],
        pickupPhone: [{ required: true, message: that.$t('schoolbus.请输入'), trigger: 'blur' }],
        pickupImageUrl: [{ required: true, message: that.$t('schoolbus.请上传'), trigger: 'blur' }]
      }, // 新增路线表单校验规则
      studentStr: '', // 学生信息
      pickerOptions: {
        disabledDate: (time) => {
          if (!that.ruleForm.sectionId) return false
          const selectedSection = that.selectSectionList.find((section) => section.id === that.ruleForm.sectionId)
          if (selectedSection) {
            const sectionStart = new Date(selectedSection.serviceStartDate).getTime()
            const sectionEnd = new Date(selectedSection.serviceEndDate).getTime()
            const disabledDate = time.getTime() < sectionStart || time.getTime() > sectionEnd
            return disabledDate
          }
          return false
        }
      },
      canComputedPrice: false
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.initFromRoute()
  },
  computed: {
    ...mapGetters(['pooldictpermissions', 'permissions', 'i18nlocel']),
    pageTitle() {
      const key = this.typeObj[this.modalType] || '新增'
      return this.$t('schoolbus')[key]
    },
    routeTableDataClone() {
      return JSON.parse(JSON.stringify(this.routeTableData))
    },
    bindRouteTableColumns() {
      return bindRouteTableColumns(this)
    },
    bindPersonTableColumns() {
      return bindPersonTableColumns(this)
    }
  },
  watch: {
    // 监听 routeTableDataClone 变化
    routeTableDataClone: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getLineStationPrice()
        }
      },
      deep: true // 深度监听
    }
  },
  methods: {
    goBack() {
      const listPath = this.formType === 'order' ? SCHOOLBUS_PATHS.studentOrderList : SCHOOLBUS_PATHS.studentApplyList
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: listPath })
      }
    },
    /** 二级页：从路由 query 初始化 */
    async initFromRoute() {
      await this.fetchSchoolListBuscommon()
      const mode = this.$route.query.mode || 'add'
      const id = this.$route.query.id
      if (mode !== 'add' && mode !== 'edit') {
        this.goBack()
        return
      }
      this.pageLoading = true
      try {
        this.modalType = mode
        if (mode !== 'add') {
          if (!id) {
            this.goBack()
            return
          }
          await this.getDetail(id)
        } else {
          this.canComputedPrice = true
          const defaultSchoolId = this.schoolSelectList.length === 1 ? this.schoolSelectList[0].id : ''
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              schoolId: defaultSchoolId || this.ruleForm.schoolId,
              approvalStatus: this.formType == 'apply' ? '0' : '1',
              paymentStatus: this.formType == 'apply' ? '1' : '2'
            }
            if (defaultSchoolId) {
              this.changeSchool(defaultSchoolId)
            }
            if (this.formType != 'apply') {
              this.changePayment('1')
            }
          })
        }
      } finally {
        this.pageLoading = false
      }
    },
    // 新增
    addData(data) {
      this.isSubmitting = true
      addOrder(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('schoolbus.成功'))
            this.goBack()
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    // 编辑
    editData(data) {
      this.isSubmitting = true
      editOrder(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('schoolbus.成功'))
            this.goBack()
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    // 初始化数据
    initData() {
      // 重置表单和选择范围
      this.ruleForm = {}
      this.$set(this, 'pickerOptions', { ...this.pickerOptions })
    },
    // 获取详情
    getDetail(id) {
      return getOrderDetail(id).then(async (res) => {
        if (res.data.success) {
          let data = res.data.data
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
            signImageUrl,
            orderLines,
            parentInfos,
            // 缴费信息
            paymentAmount,
            paymentMethod,
            paymentDate,
            paymentAccount,
            paymentOrderNo,
            receivingAccount
          } = data
          this.selectSectionList = await getSectionList({ schoolIds: schoolId })
          this.selectLineList = await getLineList({
            schoolIds: schoolId,
            sectionId: sectionId,
            isAll: 0
          })
          orderLines = orderLines ? orderLines : []
          if (orderLines.length > 0) {
            let lineId = orderLines[0].lineId
            this.weekDaysList = await getOrderStationList({
              schoolIds: schoolId,
              lineId: lineId
            })
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
              signImageUrl,
              paymentAmount,
              paymentMethod,
              paymentDate,
              paymentAccount,
              paymentOrderNo,
              receivingAccount
            }
            parentInfos = parentInfos ? parentInfos : []
            this.personTableData = parentInfos.map((item) => {
              return {
                pickupRelationships: item.pickupRelationships,
                pickupPhone: item.pickupPhone,
                pickupImageUrl: item.pickupImageUrl
              }
            })
            this.routeTableData = orderLines.map((item) => {
              return {
                lineId: item.lineId,
                stationPriceId: item.stationPriceId,
                stationId: item.stationId,
                weekDaysId: item.weekdaysId,
                studentLineType: String(item.studentLineType),
                ridingStartDay: item.ridingStartDay ? item.ridingStartDay : '',
                ridingEndDay: item.ridingEndDay ? item.ridingEndDay : '',
                ridingWeekDay: item.ridingWeekDay,
                ridingDay: !item.ridingStartDay || !item.ridingEndDay ? [] : [item.ridingStartDay, item.ridingEndDay],
                lineName: this.i18nlocel == 'en' ? item.lineEnName : item.lineCnName,
                stationName: this.i18nlocel == 'en' ? item.stationEnName : item.stationCnName,
                lineTypeName: this.$getListLabel(BUS_STUDENT_LINE_TYPE, item.studentLineType),
                carinfoId: item.carinfoId,
                carNumber: item.carinfoId ? this.$getListLabel(item.busLineDTO.carList, item.carinfoId, 'carNumber', 'id') : ''
              }
            })
            if (signImageUrl) {
              this.$nextTick(() => {
                this.$refs.UploadSignupFile.imageUrl = signImageUrl
              })
            }
            setTimeout(() => {
              this.canComputedPrice = true
            }, 500)
          })
        }
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log('submitForm', valid, this.ruleForm)
        let pass = valid
        if (pass && this.routeTableData.length == 0) {
          pass = false
          this.$message.error(this.$t('schoolbus.请选择路线'))
        }
        if (pass && this.personTableData.length == 0 && this.ruleForm.pickupMethod == '2') {
          pass = false
          this.$message.error(this.$t('schoolbus.请选择接送人'))
        }
        // const idPairs = new Set();
        // for (const line of this.routeTableData) {
        //   const pair = `${line.lineId}-${line.stationId}`;
        //   if (idPairs.has(pair)) {
        //     this.$message.error(this.$t("schoolbus.存在重复的路线和站点组合"));
        //     return;
        //   }
        //   idPairs.add(pair);
        // }
        if (pass) {
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
            // 缴费信息
            paymentMethod: this.ruleForm.paymentMethod,
            paymentDate: this.ruleForm.paymentDate,
            paymentAccount: this.ruleForm.paymentAccount,
            paymentOrderNo: this.ruleForm.paymentOrderNo,
            receivingAccount: this.ruleForm.receivingAccount
          }
          //   未缴费清除已缴金额
          if (this.ruleForm.paymentStatus != '2') {
            delete data['paymentAmount']
          }
          if (this.routeTableData.length > 0) {
            data['orderLines'] = this.routeTableData.map((item) => {
              return {
                lineId: item.lineId,
                stationId: item.stationId,
                stationPriceId: item.stationPriceId,
                studentLineType: item.studentLineType,
                ridingStartDay: item.ridingStartDay,
                ridingEndDay: item.ridingEndDay,
                weekDaysId: item.weekDaysId,
                carinfoId: item.carinfoId,
                ridingWeekDay: String(item.ridingWeekDay)
              }
            })
          }
          if (this.personTableData.length > 0 && data['pickupMethod'] == '2') {
            data['parentInfos'] = _.cloneDeep(this.personTableData)
          }

          if (this.modalType == 'add') {
            this.addData(data)
          } else {
            data['id'] = this.ruleForm.id
            this.editData(data)
          }
        }
      })
    },
    // 关闭/重置
    closeModal() {
      this.routeTableData = []
      this.personTableData = []
      this.canComputedPrice = false
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
    },

    // 选择校区
    async changeSchool(e) {
      this.routeForm['schoolId'] = e
      delete this.ruleForm['stationPriceId']
      delete this.ruleForm['sectionId']
      this.routeTableData = []
      this.selectSectionList = await getSectionList({ schoolIds: e })
    },
    // 挂载查询到的学生
    async querySearch(queryString, cb) {
      getStudentInfoList({
        schoolId: this.ruleForm['schoolId'],
        admissionNo: queryString
      }).then((res) => {
        if (res.data.success) {
          let data = res.data.data
          let list = data.map((item) => {
            return {
              ...item,
              value: item['admissonNo']
            }
          })
          cb(list)
        } else {
          cb([])
        }
      })
    },
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, className) {
      let dom = document.querySelectorAll(className)
      dom[0].style.display = status
    },
    handleSelect(item) {
      this.changeStyle('none', '.el-autocomplete-suggestion')
      //   this.ruleForm["studentName"] = item["fullName"]; //姓名
      //   this.ruleForm["studentGrade"] = item["grade"]; //年级
      //   this.ruleForm["admissionNo"] = item["admissonNo"]; //学号
      this.ruleForm = {
        ...this.ruleForm,
        studentName: item['fullName'], //姓名
        studentGrade: item['grade'], //年级
        admissionNo: item['admissonNo'] //学号
      }
    },
    // 当学期选择变化时，更新时间选择范围
    async handleSectionChange(e) {
      this.routeTableData = []
      this.$set(this, 'pickerOptions', { ...this.pickerOptions })
      this.selectLineList = await getLineList({
        schoolIds: this.ruleForm['schoolId'],
        sectionId: e,
        isAll: 0
      })
    },
    // 选择路线
    async changeLine(e) {
      this.carList = []
      this.routeForm['lineId'] = e
      delete this.routeForm['stationPriceId']
      delete this.routeForm['carinfoId']
      delete this.routeForm['carNumber']
      delete this.routeForm['weekDaysId']
      delete this.routeForm['ridingWeekDay']

      this.selectLineList.map((item) => {
        if (item.id == e) {
          this.routeForm['lineName'] = item.enName
          //   this.carList = item["carList"];
          //   if (this.carList.length == 1) {
          //     this.routeForm["carNumber"] = this.carList[0].carNumber;
          //     this.routeForm["carinfoId"] = this.carList[0].id;
          //   }
        }
      })
      this.carList = await getCarinfoList({ isAll: 0, lineId: e })
      if (this.carList.length == 1) {
        this.routeForm['carNumber'] = this.carList[0].carNumber
        this.routeForm['carinfoId'] = this.carList[0].id
      }
      this.weekDaysList = await getOrderStationList({
        schoolIds: this.ruleForm['schoolId'],
        lineId: e
      })
    },
    //选择车辆
    changeCar(e) {
      this.routeForm['carinfoId'] = e
      this.carList.map((item) => {
        if (item.id == e) {
          this.routeForm['carNumber'] = item.carNumber
        }
      })
    },
    // 选择路线类型
    changeLineType(e) {
      this.routeForm['studentLineType'] = e
      BUS_ROUTE_TYPE.map((item) => {
        if (item.value == e) {
          this.routeForm['lineTypeName'] = item.label
        }
      })
    },
    // 选择日期
    changeWeekDays(e) {
      this.routeForm['weekDaysId'] = e
      delete this.routeForm['stationPriceId']
      delete this.routeForm['ridingWeekDay']
      this.weekDaysList.map((item) => {
        if (item.id == e) {
          this.stationList = item['stationPrices'].map((item) => {
            return {
              id: item['id'],
              stationId: item['stationId'],
              enName: item['busStationDTO']['enName'],
              cnName: item['busStationDTO']['cnName']
            }
          })
          this.ridingWeekDays = item['weekDays'].split(',')
          if (this.ridingWeekDays.length > 0) {
            this.routeForm = {
              ...this.routeForm,
              ridingWeekDay: this.ridingWeekDays
            }
          }
          console.log(' this.stationList ', this.stationList)
        }
      })
    },
    // 选择站点
    changeStation(e) {
      console.log(' changeStation', e)
      this.routeForm['stationPriceId'] = e
      this.stationList.map((item) => {
        if (item.id == e) {
          this.routeForm['stationId'] = item.stationId
          this.routeForm['stationName'] = item.enName
        }
      })
    },
    // 选择时间
    changeRidingDay(e) {
      if (e) {
        this.routeForm['ridingStartDay'] = e[0]
        this.routeForm['ridingEndDay'] = e[1]
      }
    },
    // 路线操作
    submitRouteForm() {
      this.$refs.routeForm.validate((valid) => {
        if (valid) {
          console.log('submitRouteForm', this.routeForm)
          let routeForm = _.cloneDeep(this.routeForm)
          routeForm = {
            ...routeForm,
            ridingWeekDay: String(routeForm['ridingWeekDay']),
            lineTypeName: this.$getListLabel(BUS_STUDENT_LINE_TYPE, routeForm['studentLineType'])
          }
          if (this.routeModalType == 'add') {
            this.routeTableData.push({ ...routeForm })
          } else {
            this.$set(this.routeTableData, this.routeIndex, { ...routeForm })
          }
          this.showRouteModal = false
          this.$refs.routeForm.resetFields()
        }
      })
    },
    addRoute() {
      this.routeForm = {}
      this.routeModalType = 'add'
      this.showRouteModal = true
      this.setDefaultDate()
    },
    setDefaultDate() {
      if (this.ruleForm.sectionId) {
        const selectedSection = this.selectSectionList.find((section) => section.id === this.ruleForm.sectionId)
        if (selectedSection) {
          this.routeForm = {
            ...this.routeForm,
            ridingStartDay: selectedSection.serviceStartDate,
            ridingEndDay: selectedSection.serviceEndDate,
            ridingDay: [selectedSection.serviceStartDate, selectedSection.serviceEndDate]
          }
        }
      }
    },
    closeRoute() {
      this.routeForm = {}
      this.showRouteModal = false
      this.routeIndex = -1
      this.$refs.routeForm.resetFields()
    },
    async editCurrentRoute(item, index) {
      this.routeIndex = index
      this.routeForm = {
        ...item,
        ridingWeekDay: item.ridingWeekDay ? item.ridingWeekDay.split(',') : ''
      }
      this.routeModalType = 'edit'
      console.log('editCurrentRoute', item)

      if (item['weekDaysId']) {
        this.weekDaysList = await getOrderStationList({
          schoolIds: this.ruleForm['schoolId'],
          lineId: item['lineId']
        })
        if (item['stationPriceId']) {
          this.weekDaysList.map((week) => {
            if (week.id == item['weekDaysId']) {
              this.stationList = week['stationPrices'].map((station) => {
                return {
                  id: station['id'],
                  stationId: station['stationId'],
                  enName: station['busStationDTO']['enName'],
                  cnName: station['busStationDTO']['cnName']
                }
              })
              this.ridingWeekDays = week['weekDays'].split(',')
            }
          })
        }
      }
      //   this.selectLineList.map((line) => {
      //     if (line.id == item["lineId"]) {
      //       this.carList = line["carList"];
      //     }
      //   });
      this.carList = await getCarinfoList({ isAll: 0, lineId: item['lineId'] })
      console.log('editCurrentRoute', this.selectLineList)
      this.showRouteModal = true
    },
    delCurrentRoute(item, index) {
      this.$alert(this.$t('schoolbus.确定要删除吗？'), this.$t('schoolbus.删除'), {
        confirmButtonText: this.$t('schoolbus.确定')
      }).then(() => {
        this.routeTableData.splice(index, 1)
      })
    },
    // 接送人操作
    submitPersonForm() {
      this.$refs.personForm.validate((valid) => {
        if (valid) {
          const personForm = _.cloneDeep(this.personForm)
          if (this.personModalType == 'add') {
            this.personTableData.push({ ...personForm })
          } else {
            this.$set(this.personTableData, this.personIndex, { ...personForm })
          }
          this.showPersonModal = false
          this.$refs.personForm.resetFields()
        }
      })
    },
    addPerson() {
      this.personModalType = 'add'
      this.showPersonModal = true
      this.$nextTick(() => {
        this.$refs.UploadPersonFile.imageUrl = ''
      })
    },

    closePerson() {
      this.personModalType = 'add'
      this.personIndex = -1
      this.showPersonModal = false
      this.$nextTick(() => {
        this.$refs.UploadPersonFile.imageUrl = ''
      })
      this.$refs.personForm.resetFields()
    },
    editCurrentPerson(item, index) {
      this.personForm = { ...item }
      this.personIndex = index
      this.personModalType = 'edit'
      this.showPersonModal = true
      this.$nextTick(() => {
        if (this.personForm['pickupImageUrl']) {
          this.$refs.UploadPersonFile.imageUrl = this.personForm['pickupImageUrl'] ? this.personForm['pickupImageUrl'] : ''
        } else {
          this.$refs.UploadPersonFile.imageUrl = ''
        }
      })
    },
    delCurrentPerson(item, index) {
      this.$alert(this.$t('schoolbus.确定要删除吗？'), this.$t('schoolbus.删除'), {
        confirmButtonText: this.$t('schoolbus.确定')
      }).then(() => {
        this.personTableData.splice(index, 1)
      })
    },
    // 根据路线ID和站点ID查询价格
    async getLineStationPrice() {
      console.log(' this.routeTableData', this.routeTableData)
      if (this.routeTableData.length == 0 || !this.canComputedPrice) return
      let data = this.routeTableData.map((item) => {
        return {
          lineId: Number(item.lineId),
          stationId: Number(item.stationId),
          stationPriceId: Number(item.stationPriceId),
          studentLineType: Number(item.studentLineType),
          weekDaysId: Number(item.weekDaysId)
        }
      })
      let amountDue = await getLineStationPrice(data)
      this.ruleForm = {
        ...this.ruleForm,
        amountDue
        // paymentAmount: amountDue,
      }
      //   缴费状态下同步修改缴费金额
      if (this.ruleForm.paymentStatus == '2') {
        this.ruleForm = {
          ...this.ruleForm,
          paymentAmount: amountDue
        }
      }
    },
    lineNameEn(id) {
      const item = this.selectStationList.find((item) => item.id == id)
      return item ? item.enName : ''
    },
    stationNameEn(id) {
      const item = this.stationList.find((item) => item.id == id)
      return item ? item.enName : ''
    },
    routeTypeNameEn(id) {
      const item = BUS_ROUTE_TYPE.find((item) => item.value == id)
      return item ? item.enName : ''
    },
    // 上传接送人图片
    uploadPerson(data) {
      this.personForm['pickupImageUrl'] = data
    },
    // 上传签名图片
    uploadSignup(data) {
      this.ruleForm['signImageUrl'] = data
    },
    changeApproval(e) {
      delete this.routeForm['denyReason']
    },
    changePayment(e) {
      //   delete this.routeForm["paymentAmount"];
      if (e == '2') {
        this.routeForm['paymentAmount'] = this.routeForm['amountDue']
      } else {
        delete this.routeForm['paymentAmount']
      }
      this.$set(this.rules['paymentMethod'], 0, {
        ...this.rules['paymentMethod'][0],
        required: e == '1'
      })
      this.$set(this.rules['paymentDate'], 0, {
        ...this.rules['paymentDate'][0],
        required: e == '1'
      })
      this.$set(this.rules['paymentAmount'], 0, {
        ...this.rules['paymentAmount'][0],
        required: e == '1'
      })
    },
    formDisabled() {
      if (this.modalType == 'add') return false
      let disabled = false
      switch (this.formType) {
        case 'apply':
          disabled = this.ruleForm.paymentStatus == '2'
        case 'order':
          disabled = this.ruleForm.paymentStatus == '2'
      }
      return disabled
    }
  }
}
</script>
