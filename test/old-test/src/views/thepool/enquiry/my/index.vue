<template>
  <div class="thepool_page">
    <div class="pool-search">
      <div class="pool-search-top">
        <StatusItem
          :statusList="statusList"
          :currentstatus="currentstatus"
          @changeStasus="changeStasus"
        />
        <SearchType />
      </div>
      <div class="requestParam" v-if="requestList.length > 0">
        <div class="requestParamlist">
          <div
            @click="selectCurrentRequestParam(item)"
            :class="[
              'requestParamlist_item',
              {
                active_item: item.id == searchRequestParamId,
              },
            ]"
            v-for="(item, index) in requestList"
            :key="index"
          >
            <i
              style="margin-left: 2px"
              class="el-icon-circle-close"
              @click="delRequestParam(item.id)"
            ></i>
            <span>
              {{ item.description }}
            </span>
          </div>
        </div>
      </div>
      <div class="form-page" v-if="searchType == 'checkbox'">
        <div>
          <div class="form-item" v-if="currentstatus == '-1'">
            <label class="form-label">{{ $t("consult.跟进状态") }}：</label>
            <OverflowWrap>
              <el-checkbox-group v-model="searchFrom.followStatus">
                <el-checkbox
                  v-for="item in filterStatusList"
                  :key="item.type"
                  :name="item.type"
                  :label="item.type"
                >
                  {{ $t("consult")[item.name] }}
                </el-checkbox>
              </el-checkbox-group>
            </OverflowWrap>
          </div>
          <div class="form-item" v-if="pooldictpermissions.length > 1">
            <label class="form-label">{{ $t("consult.归属校区") }}：</label>
            <OverflowWrap>
              <el-checkbox-group v-model="searchFrom.schools">
                <el-checkbox
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :name="item.value"
                  :label="item.value"
                >
                  {{ i18nlocel == "en" ? item.enLabel : item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </OverflowWrap>
          </div>
          <div class="form-item" v-if="pooldictpermissions.length > 1">
            <label class="form-label">{{ $t("consult.校区") }}：</label>
            <OverflowWrap>
              <el-checkbox-group
                @change="changeSchool"
                v-model="searchFrom.applySchools"
              >
                <el-checkbox
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :name="item.value"
                  :label="item.value"
                >
                  {{ i18nlocel == "en" ? item.enLabel : item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </OverflowWrap>
          </div>
          <div v-if="showMore">
            <div class="form-item" v-if="enrollLevelList.length > 1">
              <label class="form-label">{{ $t("consult.申请年级") }}：</label>
              <OverflowWrap>
                <el-checkbox-group v-model="searchFrom.enrollLevels">
                  <el-checkbox
                    v-for="item in enrollLevelList"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ i18nlocel == "en" ? item.enLabel : item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </OverflowWrap>
            </div>
            <div class="form-item" v-if="directionsList.length > 1">
              <label class="form-label">{{ $t("consult.方向") }}：</label>
              <OverflowWrap>
                <el-checkbox-group v-model="searchFrom.directions">
                  <el-checkbox
                    v-for="item in directionsList"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ i18nlocel == "en" ? item.enLabel : item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </OverflowWrap>
            </div>
            <div class="form-item" v-if="followTagsList.length > 1">
              <label class="form-label">{{ $t("consult.跟进标签") }}：</label>
              <OverflowWrap>
                <el-checkbox-group v-model="searchFrom.followTags">
                  <el-checkbox
                    v-for="item in followTagsList"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ i18nlocel == "en" ? item.enLabel : item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </OverflowWrap>
            </div>
            <div class="form-item" v-if="channelList.length > 0">
              <label class="form-label">{{ $t("consult.渠道一级") }}：</label>
              <OverflowWrap>
                <el-checkbox-group v-model="searchFrom.channels">
                  <el-checkbox
                    v-for="item in channelList"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ i18nlocel == "en" ? item.enLabel : item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </OverflowWrap>
            </div>
            <div class="form-item" v-if="channelChildOnes.length > 0">
              <label class="form-label">{{ $t("consult.渠道二级") }}：</label>
              <OverflowWrap>
                <el-checkbox-group v-model="searchFrom.channelChildOnes">
                  <el-checkbox
                    v-for="item in channelChildOnes"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ i18nlocel == "en" ? item.enLabel : item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </OverflowWrap>
            </div>

            <div class="form-item-center">
              <label class="form-label">{{ $t("consult.新增时间") }}：</label>
              <el-date-picker
                style="width: 240px"
                v-model="searchFrom.createdTime"
                type="daterange"
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd'"
                :format="'yyyy-MM-dd'"
                clearable
                @clear="search"
              >
              </el-date-picker>
            </div>
            <div class="form-item-center">
              <label class="form-label">{{ $t("consult.更新时间") }}：</label>
              <el-date-picker
                style="width: 240px"
                v-model="searchFrom.updateTime"
                type="daterange"
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd'"
                :format="'yyyy-MM-dd'"
                clearable
                @clear="search"
              >
              </el-date-picker>
            </div>
            <div class="form-item">
              <label class="form-label">{{ $t("consult.排序方式") }}：</label>
              <OverflowWrap>
                <el-radio-group v-model="searchFrom.orderBy">
                  <el-radio
                    v-for="item in sortModeList"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ $t("consult")[item["label"]] }}
                  </el-radio>
                </el-radio-group>
              </OverflowWrap>
            </div>
            <div class="form-item">
              <label class="form-label">{{ $t("consult.排序") }}：</label>
              <OverflowWrap>
                <el-radio-group v-model="searchFrom.order">
                  <el-radio
                    v-for="item in upOrdown"
                    :key="item.value"
                    :name="item.value"
                    :label="item.value"
                  >
                    {{ $t("consult")[item["label"]] }}
                  </el-radio>
                </el-radio-group>
              </OverflowWrap>
            </div>
          </div>
        </div>
        <div class="form-page_btns">
          <el-button
            :icon="`el-icon-arrow-${showMore ? 'up' : 'down'}`"
            type="text"
            @click="showMore = !showMore"
            >{{ $t("consult.更多筛选") }}</el-button
          >
          <el-button type="primary" size="small" round @click.stop="search">{{
            $t("consult.查询")
          }}</el-button>
          <img
            @click.stop="saveRequestParam"
            src="/thepool/icon/icon_save.png"
            alt="保存查询条件"
          />
          <img
            @click.stop="clear"
            src="/thepool/icon/icon_refresh.png"
            alt="清空"
          />
        </div>
      </div>
      <div
        v-if="searchType == 'input'"
        class="searchFromBox search"
        style="padding: 15px 0 0 0"
      >
        <el-form
          ref="searchFrom"
          class="df_align_center searchFrom"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
          :rules="searchRules"
        >
          <div class="df_w">
            <el-form-item
              v-if="currentstatus == '-1'"
              :label="$t('consult.跟进状态')"
              style="width: 214px"
            >
              <el-select
                multiple
                v-model="searchFrom.followStatus"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in filterStatusList"
                  :key="item.type"
                  :label="$t('consult')[item.name]"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('consult.归属校区')" style="width: 214px">
              <el-select
                multiple
                v-model="searchFrom.schools"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.校区')" style="width: 214px">
              <el-select
                multiple
                v-model="searchFrom.applySchools"
                :placeholder="$t('consult.请选择')"
                @change="changeSchool"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.申请年级')"
              style="width: 214px"
            >
              <el-select
                multiple
                v-model="searchFrom.enrollLevels"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              style="width: 214px"
            >
              <el-select
                multiple
                v-model="searchFrom.directions"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in directionsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="followTagsList.length > 0"
              :label="$t('consult.跟进标签')"
              style="width: 214px"
            >
              <el-select
                multiple
                v-model="searchFrom.followTags"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in followTagsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="channelsList.length > 0"
              :label="$t('consult.渠道')"
              style="width: 214px"
            >
              <SelectChannle
                ref="SelectChannle"
                :options="channelsList"
                @setChannel="setChannel"
              />
            </el-form-item>
            <el-form-item :label="$t('consult.新增时间')" style="width: 214px">
              <el-date-picker
                style="width: 100%"
                v-model="searchFrom.createdTime"
                type="daterange"
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd'"
                :format="'yyyy-MM-dd'"
                clearable
                @clear="search"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('consult.更新时间')" style="width: 214px">
              <el-date-picker
                style="width: 100%"
                v-model="searchFrom.updateTime"
                type="daterange"
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd'"
                :format="'yyyy-MM-dd'"
                clearable
                @clear="search"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('consult.排序方式')" style="width: 214px">
              <el-select
                v-model="searchFrom.orderBy"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in sortModeList"
                  :key="item.value"
                  :label="$t('consult')[item['label']]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.排序')" style="width: 214px">
              <el-select
                v-model="searchFrom.order"
                :placeholder="$t('consult.请选择')"
                clearable
                @clear="search"
              >
                <el-option
                  v-for="item in upOrdown"
                  :key="item.value"
                  :label="$t('consult')[item['label']]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 170px; margin-right: 0">
              <div class="df_sb">
                <el-button
                  type="primary"
                  size="small"
                  round
                  @click.stop="search"
                  >{{ $t("consult.查询") }}</el-button
                >
                <img
                  style="width: 32px; height: 32px"
                  @click.stop="saveRequestParam"
                  src="/thepool/icon/icon_save.png"
                  alt="保存查询条件"
                />
                <img
                  style="width: 32px; height: 32px"
                  @click.stop="clear"
                  src="/thepool/icon/icon_refresh.png"
                  alt="清空"
                />
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="pool-tableBox">
      <div class="df_sb palyTableBox" style="padding-top: 0">
        <div class="df_sb">
          <div class="df_sb">
            <el-button
              v-if="permissions['enquiry_mine_add']"
              type="primary"
              size="small"
              round
              @click="showAdd = true"
              >{{ $t("consult.新增咨询") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_mine_add']"
              type="primary"
              size="small"
              round
              @click="showAddClue = true"
              >{{ $t("consult.新增线索") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_mine_follower_add']"
              type="primary"
              size="small"
              round
              @click="addAssigneds('showAddAssigned')"
              >{{ $t("consult.添加跟进人") }}</el-button
            >
            <el-button
              v-if="tableData.length > 0 && permissions['enquiry_mine_export']"
              type="defult"
              size="small"
              round
              @click="exportMyList"
              >{{ $t("consult.导出线索") }}</el-button
            >
            <el-button
              v-if="tableData.length > 0 && permissions['enquiry_mine_export']"
              type="defult"
              size="small"
              round
              @click="exportHybridMyList"
              >{{ $t("consult.导出咨询") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_mine_import']"
              type="defult"
              size="small"
              round
              @click="showUpdate = true"
              >{{ $t("consult.导入线索") }}</el-button
            >
            <el-button
              v-if="permissions['enquiry_all_import']"
              type="defult"
              size="small"
              round
              @click="showUpdateHybrid = true"
              >{{ $t("consult.导入咨询") }}</el-button
            >

            <el-button
              type="defult"
              v-if="permissions['enquiry_mine_school_batch_edit']"
              size="small"
              round
              @click="addAssigneds('showBatchEditing')"
              >{{ $t("consult.批量编辑") }}</el-button
            >
            <el-button
              type="defult"
              v-if="
                ((currentstatus == '1' || currentstatus == '0') &&
                  permissions['enquiry_mine_status_batch_close']) ||
                (currentstatus == '2' &&
                  permissions['enquiry_status_batch_apply_close'])
              "
              size="small"
              round
              @click="batchPlayTab('close')"
              >{{ $t("consult.批量关闭") }}</el-button
            >
            <el-button
              type="defult"
              v-if="
                permissions['enquiry_mine_status_batch_active'] &&
                currentstatus == '4'
              "
              size="small"
              round
              @click="batchPlayTab('activate')"
              >{{ $t("consult.批量激活") }}</el-button
            >
            <el-button
              v-if="tableData.length > 0 && permissions['clue_mine_send_email']"
              type="defult"
              size="small"
              round
              @click="sendEmail"
              >{{ $t("consult.邮件发送") }}</el-button
            >
          </div>
        </div>
        <div class="df_sb">
          <SelectTabletMenu
            type="enquiryTableMy"
            @resetTableTitle="resetTableTitle"
          />
        </div>
      </div>
      <div class="tableBox">
        <Table
          ref="Table"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :showSelection="true"
          @playTab="playTab"
          @rowClick="rowClick"
          @changeSelectedCount="changeSelectedCount"
        />
        <div class="df_sb" v-if="paginationTotal > 10">
          <div class="df_sb">
            <el-checkbox
              style="padding: 0 10px"
              class="checkbox"
              @change="changeSelectAll"
              v-model="isSelectAll"
              >{{ $t("consult.全选") }}</el-checkbox
            >
            <span v-if="selectedCount != 0" style="color: #999999"
              >{{ $t("consult.已选择") }}
              <span style="color: #ba8e62">{{ selectedCount }}</span>
              {{ $t("consult.条") }},</span
            >
            <span style="color: #999999">{{
              $t("consult.最多选择1000条")
            }}</span>
            <!-- <el-button type="primary" size="small" round @click="selectAll">{{
              $t("consult.全选")
            }}</el-button>
            <el-button type="defult" size="small" round @click="cancelSelectAll">{{
              $t("consult.取消全选")
            }}</el-button> -->
          </div>
          <div class="palyTableBox df_align_center" style="padding: 0">
            <PaginationInfo
              :paginationTotal="paginationTotal"
              style="margin-right: 20px"
              :paginationSize="pagination['pageSize']"
            />
            <Pagination
              :showPageSizes="true"
              :total="paginationTotal"
              :pagination="pagination"
              @handleCurrentChange="handleCurrentChange"
              @handleSizeChange="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 新增线索 -->
    <addClue
      v-if="showAddClue"
      :showAdd="showAddClue"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 新增学生线索 -->
    <addStudent
      v-if="showAdd"
      :showAdd="showAdd"
      :isMine="true"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 改变状态 -->
    <changeStatus
      v-if="showchangeStatus"
      :showchangeStatus="showchangeStatus"
      :clueIds="clueIds"
      :isMultiple="isMultiple"
      :currentClueType="currentClueType"
      :currentClueId="currentClueId"
      :studentList="enterStudentList"
      @changeModal="changeModal"
      @initData="initData"
    />
    <addAssigned
      ref="addAssigned"
      v-if="showAddAssigned"
      :type="'add'"
      :showAddAssigned="showAddAssigned"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <updateClue
      ref="updateClue"
      v-if="showUpdate"
      :showUpdate="showUpdate"
      :canDownload="permissions['enquiry_mine_template_download']"
      @closeModal="changeModal"
      @initData="initData"
      @showErrorData="showErrorData"
      @showErrList="showErrList"
    />
    <updateHybrid
      ref="updateHybrid"
      v-if="showUpdateHybrid"
      :showUpdate="showUpdateHybrid"
      :canDownload="permissions['enquiry_mine_template_download']"
      @closeModal="changeModal"
      @initData="initData"
      @showErrorData="showErrorData"
      @showErrList="showErrList"
    />
    <AdmissionNotice
      v-if="showAdmissionNotice"
      :show="showAdmissionNotice"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <BatchEditing
      ref="BatchEditing"
      v-if="showBatchEditing"
      :showEditClue="showBatchEditing"
      :clueIds="clueIds"
      @changeModal="changeModal"
      @initData="initData"
    />
    <!-- 批量导出校验错误信息 -->
    <errorInfo ref="errorInfo" />
    <SelectSchool
      ref="SelectSchool"
      @exportMyList="exportMyList"
      @exportHybridMyList="exportHybridMyList"
    />
    <ErrorTable ref="ErrorTable" />
    <!-- 发送邮件 -->
    <sendemail ref="sendemail" :type="1" @cancelSelectAll="cancelSelectAll" />
    <!-- 保存筛选信息 -->
    <SaveRequestParam
      ref="SaveRequestParam"
      @saveRequestParam="addRequestParam"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import StatusItem from "@/components/thepoolcommon/StatusItem.vue";
import {
  getMyClueList,
  exportMyList,
  importList,
  downloadTemplate,
  exportHybridMyList,
  getMyClueIds,
} from "@/api/consult/index.js";
import {
  getRequestParamList,
  addRequestParam,
  delRequestParam,
  getDptUserList,
} from "@/api/consult/common.js";
import { download } from "@/util/download.js";
import { consult } from "@/const/consult/index.js";
import addClue from "@/page/thepool/consult/modal/addclue.vue";
import addStudent from "@/page/thepool/consult/modal/addstudent.vue";
import changeStatus from "@/page/thepool/consult/modal/changestatus.vue";
import addAssigned from "@/page/thepool/consult/modal/addAssigned.vue";
import updateClue from "@/page/thepool/consult/modal/updateclue.vue";
import updateHybrid from "@/page/thepool/consult/modal/updatehybrid.vue";
import AdmissionNotice from "@/page/thepool/consult/modal/admissionNotice.vue";
import BatchEditing from "@/page/thepool/consult/modal/batcheditclue.vue";
import CreatorTree from "@/components/commonConpents/UserTree";
import FollowerTree from "@/components/commonConpents/DeptUserTree";
import SelectChannle from "@/components/common/pooldictselect/selectchannlemultiple.vue";
import SelectTabletMenu from "@/components/common/pooldictselect/selecttabletmenu.vue";
import errorInfo from "@/page/thepool/modal/errorinfo.vue";
import SelectSchool from "@/page/thepool/consult/modal/selectschool.vue";
import ErrorTable from "@/page/thepool/modal/errorinfo.vue";
import sendemail from "@/page/thepool/email/modal/sendemail.vue";
import SaveRequestParam from "@/page/thepool/modal/saveRequestParam.vue";
import OverflowWrap from "@/components/thepoolcommon/OverflowWrap.vue";
import SearchType from "@/components/thepoolcommon/searchtype.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    StatusItem,
    addClue,
    addStudent,
    changeStatus,
    addAssigned,
    updateClue,
    updateHybrid,
    AdmissionNotice,
    BatchEditing,
    CreatorTree,
    FollowerTree,
    SelectChannle,
    SelectTabletMenu,
    errorInfo,
    SelectSchool,
    ErrorTable,
    sendemail,
    SaveRequestParam,
    OverflowWrap,
    SearchType,
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/loginisa") {
      let query = { ...from["query"] };
      delete query["path"];
      if (from["query"]["path"] && from["query"]["path"] != "/redirect") {
        setTimeout(() => {
          next((vm) => {
            vm.$nextTick(() => {
              vm.$router.push({
                path: from["query"]["path"],
                query: query,
              });
            });
          });
        }, 300);
      } else {
        next();
      }
    } else {
      next();
    }
  },
  data() {
    return {
      isMultiple: false,
      showBatchEditing: false,
      showAdmissionNotice: false,
      showAddClue: false,
      showAdd: false,
      showchangeStatus: false,
      currentClueType: "",
      currentClueId: "",
      pagination: {
        pageSize: 50,
        pageNum: 1,
        followStatus: [],
      },
      paginationTotal: 0,
      currentUserId: "",
      searchFrom: {
        keyword: "",
        schools: [],
        applySchools: [],
        enrollLevels: [],
        directions: [],
        createdTime: [],
        updateTime: [],
        channels: [],
        channelChildOnes: [],
        followTags: [],
        orderBy: "orderByCreateTime",
        followStatus: [],
      },
      searchRules: {},
      searchData: { orderBy: "orderByCreateTime" },
      // statusList: [],
      statusList: consult["statusMineList"],
      filterStatusList: consult["filterStatusList"],
      tableTitle: consult["selectTableTitle"],
      sortModeList: consult["sortMode"],
      upOrdown: consult["upOrdown"],
      currentstatus: "-1",
      tableData: [],
      tableBtn: [],
      spaceType: [],
      showAddAssigned: false,
      clueIds: [],
      showUpdate: false,
      showUpdateHybrid: false,
      enrollLevelList: [],
      directionsList: [],
      channelsList: [],
      followTagsList: [],
      enterStudentList: [],
      isSelectAll: false,
      selectedCount: 0,
      searchRequestParamId: null,
      requestList: [],
      showMore: false,
      // 渠道一级列表
      channelList: [],
      // 渠道二级列表
      channelChildOnes: [],
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions",
      "searchType",
    ]),
  },

  created() {
    this.resetTableTitle();
    // this.getstatusList();
    this.tableBtn = this.gettableBtn(this.statusList[0].btn);
    this.schoolList = this.pooldictpermissions;
    this.initRequestParam();
  },

  watch: {
    i18nlocel() {
      this.resetData();
    },
    "$store.state.thepool.keyword": {
      handler(val) {
        console.log("Vuex keyword changed:", val);
        this.searchFrom["keyword"] = val;
      },
      immediate: true,
    },
  },
  mounted() {
    this.wathKeyDowm();
    this.$store.subscribeAction((action) => {
      console.log("搜索列表", action);
      if (this.$route.path != "/thepool/enquiry/my/index") {
        return;
      }
      if (action.type === "searchList") {
        this.searchFrom["keyword"] = action.payload;
        this.search();
      }
    });
  },
  beforeDestroy() {
    this.removeKeyDowm();
  },
  activated() {
    this.wathKeyDowm();
    this.getMyClueList();
  },
  methods: {
    // 监听回车事件
    wathKeyDowm() {
      // 添加全局回车事件监听
      document.addEventListener("keydown", this.handleKeyDown);
      // 监听路由变化
      this.routeChange = this.$router.afterEach(() => {
        // 路由跳转后移除事件监听器
        document.removeEventListener("keydown", this.handleKeyDown);
      });
    },
    removeKeyDowm() {
      // 移除全局回车事件监听
      document.removeEventListener("keydown", this.handleKeyDown);
      // 移除路由监听器
      if (this.routeChange) {
        this.routeChange();
      }
    },
    // 处理键盘事件
    handleKeyDown(event) {
      // 监听回车键
      if (event.key === "Enter") {
        // 调用搜索方法
        this.search();
      }
    },
    resetRouteEnter() {},
    showErrorData(data) {
      console.log("showErrorData", data);
      this.$refs["errorInfo"].setData(data);
    },
    resetTableTitle() {
      let thePool_LocalCache = this.$store.getters.thePool_LocalCache;
      if (thePool_LocalCache["enquiryTableMy"]) {
        this.tableTitle = thePool_LocalCache["enquiryTableMy"].filter(
          (item) => {
            return item["show"];
          }
        );
      } else {
        this.tableTitle = consult["selectTableTitle"].filter((item) => {
          return item["show"];
        });
      }
    },
    getstatusList() {
      this.statusList = [];
      consult["statusMineList"].map((item) => {
        let obj = {
          ...item,
          name: this.$t("consult")[item["name"]],
        };
        this.statusList.push(obj);
      });
    },
    getMyClueList() {
      getMyClueList({
        ...this.pagination,
        ...this.searchData,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data || [];
          this.paginationTotal = Number(total);
          this.resetData();
        }
      });
    },
    resetData() {
      this.tableData.map((item) => {
        item["students"] = item["students"] || [];
        if (item.applySchool) {
          item["applySchoolLabel"] = this.$getListLabel(
            this.pooldictionary,
            item.applySchool
          );
          item["followTags"] = this.getDataLabel(
            item.applySchool,
            "enquiry_follow_tags",
            item.followTags
          );
          item["channellLabel"] = this.getDataLabel(
            item.applySchool,
            "enquiry_channel",
            item.channel
          );
          let channelChildOneLabel = this.getDataLabel(
            item.applySchool,
            "enquiry_channel_child_one",
            item.channelChildOne
          );
          item["channellLabel"] =
            item["channellLabel"] +
            (channelChildOneLabel == "" ? "" : "/" + channelChildOneLabel);
        } else {
          item["followTags"] = this.$getListLabel(
            this.dictionary["enquiry_follow_tags"],
            item.followTags
          );
          item["channellLabel"] = this.$getListLabel(
            this.dictionary["enquiry_channel"],
            item.channel
          );
          if (item.channelChildOne) {
            item["channellLabel"] =
              item["channellLabel"] +
              "/" +
              this.$getListLabel(
                this.dictionary["enquiry_channel_child_one"],
                item.channelChildOne
              );
          }
        }
        item["atSchoolLabel"] = this.setAtSchool(item);
        item["directionLabel"] = this.setDirection(item);
        item["enrollLevelLabel"] = this.setEnrollLevel(item);
        item["enrollLevelInLabel"] = this.setEnrollLevelIn(item);
      });
    },
    addAssigneds(type) {
      console.log("addAssigneds", type);
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.clueIds = selectionId;
        if (type == "showAddAssigned") {
          this.showAddAssigned = true;
        }
        if (type == "showAdmissionNotice") {
          this.showAdmissionNotice = true;
        }
        if (type == "showBatchEditing") {
          let applySchool = [];
          this.tableData.map((item) => {
            if (
              this.clueIds.includes(item.id) &&
              !applySchool.includes(item.applySchool)
            ) {
              applySchool.push(item.applySchool);
            }
          });
          console.log("newApplySchool", applySchool);
          if (applySchool.length == 1) {
            this.showBatchEditing = true;
          } else {
            this.$message.error(this.$t("consult.批量编辑不支持跨校区操作"));
          }
        }
      }
    },
    // 导入用户
    importList(data) {
      importList(data).then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          let { errList, failCount, successCount } = res.data.data;
          if (failCount > 0) {
            this.$refs.ErrorTable.show(res.data.data);
          }
          if (successCount > 0) {
            this.$message.success(this.$t("consult.成功"));
            this.getMyClueList();
          }
          if (failCount == 0 && successCount == 0) {
            this.$message.success(this.$t("consult.请至少添加一条数据"));
          }
        }
      });
    },
    showErrList(data) {
      let { errList, failCount, successCount } = data;
      if (failCount > 0) {
        this.$refs.ErrorTable.show(data);
      }
      if (successCount > 0) {
        this.$message.success(this.$t("consult.成功"));
        // this.getMyClueList();
      }
      if (failCount == 0 && successCount == 0) {
        this.$message.success(this.$t("consult.请至少添加一条数据"));
      }
    },
    exportBySchool(type) {
      this.$refs["SelectSchool"].innerVisible = true;
      this.$refs["SelectSchool"].type = type;
    },
    // 导出
    exportMyList() {
      let searchData = this.getSearchData();
      let data = {
        ...this.pagination,
        ...searchData,
      };
      delete data["pageSize"];
      delete data["pageNum"];
      exportMyList(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 导出
    exportHybridMyList() {
      let searchData = this.getSearchData();
      let data = {
        ...this.pagination,
        ...searchData,
      };
      delete data["pageSize"];
      delete data["pageNum"];
      exportHybridMyList(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 导出
    downloadTemplate() {
      downloadTemplate().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 下载模板
    downloadUserExcel() {
      downloadUserExcel().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      this.currentClueId = item.id;
      this.isMultiple = false;
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "close":
          this.currentClueType = "close";
          this.showchangeStatus = true;
          break;
        case "enter":
          this.currentClueType = "enter";
          this.enterStudentList = item["students"].filter((item) => {
            return item["status"] == 1 || item["status"] == 3;
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可入学学生");
          } else {
            this.showchangeStatus = true;
          }
          break;
        case "activate":
          this.currentClueType = "activate";
          this.showchangeStatus = true;
          break;
        case "apply":
          this.currentClueType = "apply";
          this.enterStudentList = item["students"].filter((item) => {
            return item["status"] == 0;
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可申请学生");
          } else {
            this.showchangeStatus = true;
          }
          break;
        case "leaving":
          this.currentClueType = "leaving";
          this.enterStudentList = item["students"].filter((item) => {
            return item["status"] == 2;
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可离校学生");
          } else {
            this.showchangeStatus = true;
          }
          break;
      }
    },
    rowClick(row) {
      //   this.$router.push("/thepool/enquiry/detail?clueId=" + row.id + "&type=2");
      const routeUrl = this.$router.resolve({
        path: "/thepool/enquiry/detail",
        query: {
          clueId: row.id,
          type: "2",
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 上传
    beforeUpload(file) {
      console.log("file", file);
      let obj = new FormData();
      obj.append("file", file);
      this.importList(obj);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getMyClueList();
    },
    handleSizeChange(size) {
      this.pagination["pageNum"] = 1;
      this.pagination["pageSize"] = size;
      this.getMyClueList();
    },
    // 搜索
    async search() {
      this.searchData = {};
      this.searchData = this.getSearchData();
      this.pagination["pageNum"] = 1;
      this.getMyClueList();
    },
    getSearchData() {
      let searchData = {};
      searchData["keyword"] = this.searchFrom["keyword"];
      searchData["orderBy"] = this.searchFrom["orderBy"];
      searchData["order"] = this.searchFrom["order"];
      searchData["enrollLevels"] = this.searchFrom["enrollLevels"];
      searchData["directions"] = this.searchFrom["directions"];
      searchData["schools"] = this.searchFrom["schools"];
      searchData["applySchools"] = this.searchFrom["applySchools"];
      searchData["followTags"] = this.searchFrom["followTags"];
      searchData["channels"] = this.searchFrom["channels"];
      searchData["channelChildOnes"] = this.searchFrom["channelChildOnes"];
      if (
        this.currentstatus == "-1" &&
        this.searchFrom["followStatus"].length > 0
      ) {
        searchData["followStatus"] = this.searchFrom["followStatus"];
      }
      if (
        this.searchFrom["createdTime"] &&
        this.searchFrom["createdTime"].length > 0
      ) {
        searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      if (
        this.searchFrom["updateTime"] &&
        this.searchFrom["updateTime"].length > 0
      ) {
        searchData["updateTimeBegin"] = this.searchFrom["updateTime"][0];
        searchData["updateTimeEnd"] = this.searchFrom["updateTime"][1];
      }
      return searchData;
    },
    // 清除搜索
    clear() {
      this.$store.dispatch("clearKeyword");
      if (this.pooldictpermissions.length == 1) {
        this.searchFrom = {
          ...this.searchFrom,
          keyword: "",
          directions: [],
          enrollLevels: [],
          createdTime: [],
          updateTime: [],
          channels: [],
          channelChildOnes: [],
          creatorIds: [],
          followerIds: [],
          followTags: [],
          orderBy: "orderByCreateTime",
          order: "",
          followStatus: [],
        };
      } else {
        this.searchFrom = {
          keyword: "",
          directions: [],
          enrollLevels: [],
          createdTime: [],
          updateTime: [],
          schools: [],
          applySchools: [],
          channels: [],
          channelChildOnes: [],
          creatorIds: [],
          followerIds: [],
          followTags: [],
          orderBy: "orderByCreateTime",
          order: "",
          followStatus: [],
        };
        this.enrollLevelList = [];
        this.directionsList = [];
        this.followTagsList = [];
        this.channelList = [];
        this.channelChildOnes = [];
      }
      this.searchData = { orderBy: "orderByCreateTime" };
      this.pagination["pageNum"] = 1;
      if (this.currentstatus == "-1") {
        this.pagination["followStatus"] = [];
        this.searchFrom = {
          ...this.searchFrom,
          followStatus: [],
        };
      }
      if (this.channelsList.length > 0) {
        this.channelsList = [];
        if (this.$refs["SelectChannle"]) {
          this.$refs["SelectChannle"].clear();
        }
      } else {
        this.channelsList = [];
      }

      this.search();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    // 状态切换
    changeStasus(item, index) {
      this.isSelectAll = false;
      this.$refs["Table"].clearSelection();
      this.currentstatus = item.type;
      this.tableBtn = this.gettableBtn(item.btn);
      this.pagination["pageNum"] = 1;
      if (item.type == "-1") {
        delete this.pagination["followStatus"];
        this.searchFrom = {
          ...this.searchFrom,
          followStatus: [],
        };
      } else {
        delete this.searchFrom["followStatus"];
        if (item.type == "1") {
          this.pagination["followStatus"] = ["0", "1"];
        } else {
          this.pagination["followStatus"] = [item.type];
        }
      }
      this.search();
    },
    initData() {
      this.changeModal(false);
      this.search();
    },
    changeModal(type) {
      this.showAdd = type;
      this.showchangeStatus = type;
      this.showAddAssigned = type;
      this.showUpdate = type;
      this.showAdmissionNotice = type;
      this.showBatchEditing = type;
      this.showUpdateHybrid = type;
      this.showAddClue = type;
      this.currentClueId = "";
      this.clueIds = [];
      this.enterStudentList = [];
      this.$refs["Table"].clearSelection();
    },
    getDataLabel(pid, type, cid) {
      let str = "";
      this.pooldictionary.map((item) => {
        if (item.value == pid) {
          if (item["child"][type]) {
            let data = item["child"][type];
            data.map((c) => {
              if (c.value == cid) {
                str = this.i18nlocel == "en" ? c.enLabel : c.label;
              }
            });
          }
        }
      });
      return str;
    },
    batchPlayTab(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.clueIds = selectionId;
        this.isMultiple = true;
        switch (type) {
          case "close":
            this.currentClueType = "close";
            this.showchangeStatus = true;
            break;
          case "enter":
            this.currentClueType = "enter";
            this.showchangeStatus = true;
            break;
          case "activate":
            this.currentClueType = "activate";
            this.showchangeStatus = true;
            break;
        }
      }
    },
    /**
     * 安全的字符串分割方法
     * @param {string} str - 要分割的字符串
     * @param {string} separator - 分隔符
     * @returns {Array} - 分割后的数组，空值返回空数组
     */
    safeSplit(str, separator = ",") {
      if (!str || typeof str !== "string") {
        return [];
      }
      return str.split(separator);
    },

    /**
     * 合并标签：当同一 value 出现多次时，合并 label 和 enLabel
     * @param {Object} existingItem - 已存在的项
     * @param {Object} newItem - 新项
     */
    mergeLabels(existingItem, newItem) {
      const labels = new Set([
        ...this.safeSplit(existingItem.label),
        ...this.safeSplit(newItem.label),
      ]);
      const enLabels = new Set([
        ...this.safeSplit(existingItem.enLabel),
        ...this.safeSplit(newItem.enLabel),
      ]);
      existingItem.label = [...labels].join(",");
      existingItem.enLabel = [...enLabels].join(",");
    },

    /**
     * 根据选中的校区更新关联的下拉列表（入学等级、方向、渠道、跟进标签）
     * @param {Array} schoolIds - 选中的校区 ID 数组
     */
    changeSchool(schoolIds) {
      // 清空所有列表
      this.enrollLevelList = [];
      this.directionsList = [];
      this.channelsList = [];
      this.followTagsList = [];
      this.searchFrom.enrollLevels = [];
      this.searchFrom.directions = [];
      this.searchFrom.channels = [];
      this.searchFrom.channelChildOnes = [];
      this.searchFrom.followTags = [];
      this.channelList = [];
      this.channelChildOnes = [];

      if (!schoolIds || schoolIds.length === 0) {
        return;
      }

      // 使用 Map 保持插入顺序，同时用于去重
      const enrollLevelMap = new Map();
      const directionMap = new Map();
      const followTagMap = new Map();
      const channelMap = new Map();
      const channelChildOneMap = new Map();

      // 遍历校区权限配置
      for (const item of this.pooldictpermissions) {
        if (!schoolIds.includes(item.value)) {
          continue;
        }

        const child = item.child;

        // 处理入学等级
        if (child.enquiry_enroll_level) {
          for (const level of child.enquiry_enroll_level) {
            const existing = enrollLevelMap.get(level.value);
            if (existing) {
              this.mergeLabels(existing, level);
            } else {
              enrollLevelMap.set(level.value, { ...level });
            }
          }
        }

        // 处理方向
        if (child.enquiry_direction) {
          for (const direction of child.enquiry_direction) {
            const existing = directionMap.get(direction.value);
            if (existing) {
              this.mergeLabels(existing, direction);
            } else {
              directionMap.set(direction.value, { ...direction });
            }
          }
        }

        // 处理渠道
        if (child.enquiry_channel) {
          this.channelsList.push({
            ...item,
            child: child.enquiry_channel,
          });
        }

        // 处理跟进标签
        if (child.enquiry_follow_tags) {
          for (const tag of child.enquiry_follow_tags) {
            const existing = followTagMap.get(tag.value);
            if (existing) {
              this.mergeLabels(existing, tag);
            } else {
              followTagMap.set(tag.value, { ...tag });
            }
          }
        }
        // 处理渠道一级
        if (child.enquiry_channel) {
          for (const channel of child.enquiry_channel) {
            const existing = channelMap.get(channel.value);
            if (existing) {
              this.mergeLabels(existing, channel);
            } else {
              channelMap.set(channel.value, { ...channel });
            }
          }
        }
        // 处理渠道二级
        if (child.enquiry_channel_child_one) {
          for (const channelChild of child.enquiry_channel_child_one) {
            const existing = channelChildOneMap.get(channelChild.value);
            if (existing) {
              this.mergeLabels(existing, channelChild);
            } else {
              channelChildOneMap.set(channelChild.value, { ...channelChild });
            }
          }
        }
      }

      // 将 Map 转换为数组，保持插入顺序
      this.enrollLevelList = Array.from(enrollLevelMap.values());
      this.directionsList = Array.from(directionMap.values());
      this.followTagsList = Array.from(followTagMap.values());
      this.channelList = Array.from(channelMap.values());
      this.channelChildOnes = Array.from(channelChildOneMap.values());
    },
    setCreator(data) {
      console.log("setCreator", data);
      this.searchFrom["creatorIds"] = data;
    },
    setFollower(data) {
      console.log("setFollower", data);
      this.searchFrom["followerIds"] = data;
    },
    setChannel(data) {
      this.searchFrom["channels"] = [];
      this.searchFrom["channelChildOnes"] = [];
      let channels = [];
      let channelChildOnes = [];
      data.map((item) => {
        switch (item.length) {
          // case 0:
          //   break;
          // case 1:
          //   break;
          case 2:
            channels.push(item[1]);
            break;
          case 3:
            // this.searchFrom["channels"].push(data[1]);
            channelChildOnes.push(item[2]);
            break;
        }
      });
      this.searchFrom["channels"] = [...new Set(channels)];
      this.searchFrom["channelChildOnes"] = [...new Set(channelChildOnes)];
      console.log("this.searchFrom", this.searchFrom);
    },
    setStudent(data) {
      let studentName = [];
      if (data["students"] && data["students"].length > 0) {
        studentName = data["students"].map((item) => {
          return item["lastName"] + item["firstName"];
        });
      } else {
        studentName = [data["studentName"]];
      }
      return String(studentName);
    },
    setAtSchool(data) {
      let atSchool = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          if (
            item["atSchool"] != "" &&
            item["atSchool"] != undefined &&
            item["atSchool"] != null
          ) {
            atSchool.push(item["atSchool"]);
          }
        });
      }
      return String(atSchool);
    },
    setEnrollLevel(data) {
      let enrollLevel = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevel
            );
          } else {
            str = this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevel
            );
          }
          if (str != "") {
            enrollLevel.push(str);
          }
        });
      }
      return String(enrollLevel);
    },
    setEnrollLevelIn(data) {
      let enrollLevel = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevelIn
            );
          } else {
            str = this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevelIn
            );
          }
          if (str != "") {
            enrollLevel.push(str);
          }
        });
      }
      return String(enrollLevel);
    },
    setDirection(data) {
      let direction = [];
      if (data["students"] && data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_direction",
              item.direction
            );
          } else {
            str = this.$getListLabel(
              this.dictionary["enquiry_channel"],
              item.direction
            );
          }

          if (str != "") {
            direction.push(str);
          }
        });
      }
      return String(direction);
    },
    // 发送邮件
    sendEmail() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.$refs["sendemail"].initData(selectionId);
      }
    },
    changeSelectAll(e) {
      if (e) {
        this.selectAll();
      } else {
        this.cancelSelectAll();
      }
    },
    changeSelectedCount(length) {
      this.selectedCount = length;
      if (this.paginationTotal > 1000) {
        this.isSelectAll = this.selectedCount == 1000;
      } else {
        this.isSelectAll = this.selectedCount
          ? this.selectedCount == this.paginationTotal
          : false;
      }
    },
    async selectAll() {
      let data = {
        ...this.searchData,
        pageSize: 1000,
      };
      if (this.currentstatus != "-1") {
        if (this.currentstatus == "1") {
          data["followStatus"] = ["0", "1"];
        } else {
          data["followStatus"] = [this.currentstatus];
        }
      }
      let clueIds = await getMyClueIds(data);
      console.log("clueIds", clueIds);
      this.$refs["Table"].selectedIds = clueIds;
      this.$refs["Table"].selectionId = clueIds;
      this.$refs["Table"].syncSelectedRows();
    },
    cancelSelectAll() {
      this.$refs["Table"].clearSelection();
    },
    // 获取查询条件
    setRequestParam() {
      if (this.pooldictpermissions.length > 0) {
        this.pooldictpermissions.map((item) => {
          this.searchFrom["schools"].push(item["value"]);
        });
        this.searchData["schools"] = this.searchFrom["schools"];
      }

      if (this.pooldictpermissions.length == 1) {
        let applySchoolsId = this.pooldictpermissions[0].value;
        this.searchFrom["applySchools"] = [applySchoolsId];
        this.searchData["applySchools"] = this.searchFrom["applySchools"];
        this.changeSchool(applySchoolsId);
      }
    },
    saveRequestParam() {
      this.requestParam = this.getSearchData();
      if (this.channelsList.length > 0 && this.$refs["SelectChannle"]) {
        this.requestParam["selectChannle"] =
          this.$refs["SelectChannle"].cascaderValue;
      } else {
        delete this.requestParam["selectChannle"];
      }
      this.$refs["SaveRequestParam"].show();
    },
    // 保存查询条件
    async addRequestParam(name) {
      let data = await addRequestParam({
        description: name,
        type: "2",
        requestParam: JSON.stringify(this.requestParam),
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "2" });
    },
    async initRequestParam() {
      this.requestList = await getRequestParamList({ type: "2" });
      if (this.requestList.length > 0) {
        this.selectCurrentRequestParam(this.requestList[0]);
      } else {
        this.setRequestParam();
      }
    },
    async delRequestParam(id) {
      await delRequestParam({
        ids: [id],
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "2" });
    },
    selectCurrentRequestParam(item) {
      let { id, requestParam } = item;
      this.searchRequestParamId = id;
      let data = JSON.parse(requestParam);
      this.changeSchool(data.applySchools || []);
      this.setSearchData(data);
      this.search();
    },
    setSearchData(data) {
      this.searchData = {
        ...data,
      };
      this.$nextTick(() => {
        this.searchFrom = {
          keyword: data.keyword || "",
          schools: data.schools || [],
          orderBy: data.orderBy || "",
          enrollLevels: data.enrollLevels || [],
          directions: data.directions || [],
          applySchools: data.applySchools || [],
          followTags: data.followTags || [],
          channels: data.channels || [],
          channelChildOnes: data.channelChildOnes || [],
          followStatus: data.followStatus || [],
          createdTime:
            data.createTimeBegin && data.createTimeEnd
              ? [data.createTimeBegin, data.createTimeEnd]
              : [],
          updateTime:
            data.updateTimeBegin && data.updateTimeEnd
              ? [data.updateTimeBegin, data.updateTimeEnd]
              : [],
        };
        if (data.selectChannle && this.$refs["SelectChannle"]) {
          this.$refs["SelectChannle"].cascaderValue = data.selectChannle;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
