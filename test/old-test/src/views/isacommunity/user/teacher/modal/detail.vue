<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="85%"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="orderDetail" v-if="showDialog">
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in tabletitle['followTeacherTable']"
                :key="index"
              >
                <span>{{ teacherUserDetailResolveLabel(item.label) }}</span>
                <span class="orderDetail_baseinfo_value">
                  <el-tooltip
                    placement="top"
                    effect="light"
                    :content="teacherUserDetailDisplayValue(item.prop)"
                    :disabled="
                      !teacherUserDetailTooltipEnabled(item.prop)
                    "
                  >
                    <span class="orderDetail_baseinfo_value_text">{{
                      teacherUserDetailDisplayValue(item.prop)
                    }}</span>
                  </el-tooltip>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTeacherDetail } from "@/api/isacommunity/user.js";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import {
  MODULE_OPTIONS,
  ROLE_OPTIONS,
  resolveSchoolDisplayLabels,
  formatOptionLabels,
} from "@/util/isacommunity-teacher-user.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import dayjs from "dayjs";

export default {
  name: "detail",
  mixins: [schoolListBuscommonMixin],
  props: {
    title: String,
  },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      showDialog: false,
      baseInfo: {},
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
    teacherSchoolList() {
      const fromBus =
        Array.isArray(this.schoolSelectList) && this.schoolSelectList.length > 0
          ? this.schoolSelectList
          : [];
      const dict = Array.isArray(this.dictionary["school"])
        ? this.dictionary["school"]
        : [];
      return fromBus.length > 0 ? fromBus : dict;
    },
  },
  methods: {
    teacherUserDetailResolveLabel(label) {
      const key = "isagroup." + label;
      return this.$te(key) ? this.$t(key) : label;
    },
    teacherUserDetailDisplayValue(prop) {
      return this.$checkNull(this.baseInfo[prop]);
    },
    teacherUserDetailTooltipEnabled(prop) {
      var val = this.baseInfo[prop];
      return val != null && val !== "" && val !== "--";
    },
    showModal(item) {
      this.showDialog = true;
      this.getDetail(item.id);
    },
    closeModal() {
      this.baseInfo = {};
      this.showDialog = false;
    },
    getDetail(id) {
      var self = this;
      var fetchDetail = function () {
        getTeacherDetail(id).then(async (res) => {
          if (res.data.success) {
            var data = res.data.data;
            var nickname = data.nickname;
            var department = data.department;
            var email = data.email;
            var phone = data.phone;
            var status = data.status;
            var modules = data.modules;
            var roles = data.roles;
            var lastLoginTime = data.lastLoginTime;
            var createTime = data.createTime;

            self.$nextTick(() => {
              self.baseInfo = {
                id: id,
                nickname: nickname,
                department: department,
                email: email,
                phone: phone,
                schoolLabel: resolveSchoolDisplayLabels(
                  data,
                  self.teacherSchoolList,
                  function (sch) {
                    return self.schoolDropdownLabel(sch);
                  }
                ),
                statusLabel: self.$getListLabel(consts["statusType"], status),
                modulesLabel: formatOptionLabels(
                  modules,
                  MODULE_OPTIONS,
                  self.i18nlocel
                ),
                rolesLabel: formatOptionLabels(roles, ROLE_OPTIONS, self.i18nlocel),
                lastLoginTime: lastLoginTime
                  ? dayjs(lastLoginTime).format("YYYY-MM-DD HH:mm")
                  : "--",
                createTime: createTime
                  ? dayjs(createTime).format("YYYY-MM-DD HH:mm")
                  : "--",
              };
            });
          }
        });
      };
      this.fetchSchoolListBuscommon().then(fetchDetail).catch(fetchDetail);
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
.orderDetail_baseinfo_value {
  flex: 1;
  min-width: 0;
  padding-right: 10px;
  box-sizing: border-box;
}
.orderDetail_baseinfo_value_text {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 22px;
  color: #333;
}
</style>
