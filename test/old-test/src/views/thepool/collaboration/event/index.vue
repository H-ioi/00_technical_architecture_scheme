<template>
  <div class="thepool_page">
    <div class="poolteam_fullCalendar">
      <div class="fullCalendar">
        <div class="df_sb"></div>
        <!-- 自定义头部操作样式 -->
        <div class="fullCalendar_header">
          <div class="df_sb">
            <span></span>
            <div>
              <el-input
                style="width: 200px"
                class="search_input"
                @change="getSchedule"
                @keyup.enter.native="getSchedule"
                v-model="scheduleForm.eventKey"
                :placeholder="$t('common.请输入')"
              >
              </el-input>
              <el-button
                style="margin-left: 20px"
                v-if="permissions['event_add']"
                @click="addEvent"
                type="primary"
                round
                >{{ $t("consult.新增") }}</el-button
              >
            </div>
          </div>
          <div class="fullCalendar_play df_sb" style="margin-top: 20px">
            <div class="selectionTime">
              <div v-if="currentType == 'dayGridMonth'" class="df_sb">
                <div class="step">
                  <i class="el-icon-arrow-up" @click="setYear('up')"></i>
                  <i class="el-icon-arrow-down" @click="setYear('down')"></i>
                </div>
                <div style="margin: 0 2px" class="df_sb">
                  <el-date-picker
                    class="yeardate"
                    v-model="currentDateObj.year"
                    type="year"
                    placeholder="年"
                    :format="'yyyy'"
                    :value-format="'yyyy'"
                    @change="changeYear"
                  >
                  </el-date-picker>
                  <el-select
                    class="monthdate"
                    @change="changeMonth"
                    v-model="currentDateObj.month"
                    placeholder="月"
                  >
                    <el-option
                      v-for="(i, k) in monthList"
                      :key="k"
                      :label="i"
                      :value="i"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="step">
                  <i class="el-icon-arrow-up" @click="setMonth('up')"></i>
                  <i class="el-icon-arrow-down" @click="setMonth('down')"></i>
                </div>
              </div>
              <div v-if="currentType == 'timeGridWeek'" class="df_sb">
                <el-date-picker
                  v-model="currentWeek"
                  type="week"
                  format="yyyy 第 WW 周"
                  placeholder="选择周"
                  :picker-options="{ firstDayOfWeek: 1 }"
                  @change="getCurrentWeek"
                >
                </el-date-picker>
              </div>
              <div v-if="currentType == 'timeGridDay'" class="df_sb">
                <el-date-picker
                  v-model="currentDatePicker"
                  type="date"
                  placeholder="日期"
                  @change="changeDate"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="df_sb">
              <el-button-group>
                <el-button
                  @click="changeDayType(i)"
                  type="default"
                  :class="[
                    { round_btn_frist: k == 0 },
                    { round_btn_last: k == dayType.length - 1 },
                    { is_active: currentType == i.type },
                  ]"
                  :key="k"
                  v-for="(i, k) in dayType"
                  >{{ i.name }}</el-button
                >
              </el-button-group>
              <el-button @click="toTday" type="default" round>{{
                $t("consult.今日")
              }}</el-button>
            </div>
          </div>
        </div>
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
          class="fullCalendar_body"
        >
          <template v-slot:eventContent="arg">
            <div
              :style="'width:100%'"
              :class="[
                'df_center',
                'fullCalendarsItem',
                {
                  isNotYetStartedMonth:
                    arg.event.eventStatus == 1 && currentType != 'dayGridMonth',
                },
                {
                  isNotYetStartedDay:
                    arg.event.eventStatus == 1 && currentType != 'dayGridMonth',
                },
                {
                  isInProgressMonth:
                    arg.event.eventStatus == 2 && currentType != 'dayGridMonth',
                },
                {
                  isInProgressDay:
                    arg.event.eventStatus == 2 && currentType == 'dayGridMonth',
                },
              ]"
            >
              <el-popover
                style="width: 100%"
                v-if="
                  currentType == 'timeGridWeek' &&
                  (arg.event.extendedProps.list
                    ? arg.event.extendedProps.list.length > 3
                    : false)
                "
                popper-class="fullCalendarsPopover"
                :ref="arg.event.id"
                placement="top"
                width="200"
                :visible-arrow="true"
                trigger="hover"
                :close-delay="200"
              >
                <div
                  @click="handlePopoverClick(item)"
                  :class="['df_sb', 'fullCalendarsPopoverItem', item.className]"
                  :key="index"
                  v-for="(item, index) in arg.event.extendedProps.list"
                >
                  <div class="fullCalendarstatus"></div>
                  <div class="fullCalendarstext tips">{{ item.name }}</div>
                </div>
                <div class="df_sb" slot="reference" style="width: 100%">
                  <div class="fullCalendarstatus"></div>
                  <div class="fullCalendarstext tips">
                    {{ arg.event.title }}
                  </div>
                </div>
              </el-popover>
              <div class="df_sb" v-else style="width: 100%">
                <div class="fullCalendarstatus"></div>
                <div class="fullCalendarstext tips">{{ arg.event.title }}</div>
              </div>
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>
    <!-- 新增事件 -->
    <AddEvent ref="AddEvent" @initData="getSchedule" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  INITIAL_EVENTS,
  createEventId,
  monthList,
  dayViewType,
} from "./event-utils";
import { getFormatDate } from "@/util/date.js";
import { getSchedule } from "@/api/consult/event.js";
import AddEvent from "@/page/thepool/event/modal/addevent.vue";
import dayjs from "dayjs";
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    AddEvent,
  },
  props: {
    currentSchool: String,
  },
  data() {
    return {
      // 月份
      monthList: monthList,
      // 视图类型
      dayType: dayViewType,
      // 当前视图类型
      currentType: "timeGridWeek",
      // 日历表
      calendarApi: null,
      currentDateObj: {
        year: "",
        month: "",
      },
      currentWeek: "",
      currentDate: "",
      currentDatePicker: "",
      // 日历配置
      calendarOptions: {
        locale: "zh-cn", // 切换语言，当前为中文
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        headerToolbar: false,
        // headerToolbar: {
        //   left: "dayGridMonth,timeGridWeek,timeGridDay today",
        //   center: "title",
        //   right: "prev,next",
        // },
        buttonText: {
          today: "今日",
          month: "月",
          week: "周",
          day: "日",
          list: "表",
        },
        firstDay: 1,
        handleWindowResize: true, //是否随浏览器窗口大小变化而自动变化。
        allDayText: "全天",
        allDaySlot: false,
        dragScroll: false,
        initialView: "timeGridWeek", // 默认为那个视图
        initialEvents: INITIAL_EVENTS, // 回显数据
        editable: false, //是否可以拖拽
        selectable: true,
        selectHelper: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        moreLinkContent: "查看更多",
        slotDuration: "00:30:00", //一格时间槽代表多长时间，默认1H
        weekMode: "variable", //在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
        weekNumbers: false, //是否在视图左边显示这是第多少周，默认fals
        weekNumberTitle: "周次", //周的国际化,默认为"W"
        slotEventOverlap: true, //相同时间段的多个日程视觉上是否允许重叠，默认true允许
        aspectRatio: 1.33, //设置日历单元格宽度与高度的比例。
        // slotLabelFormat: "HH:mm",//日期视图左边那一列显示的每一格日期时间格式
        eventLimit: 2,
        nowIndicator: false, //周/日视图中显示今天当前时间点（以红线标记），默认false不显示
        // eventOrder: "Array",
        // mintime: "08:00:00",
        // maxtime: "24:00:00",
        // businesshours: [],
        //就是灰色部分不能被点击
        // selectConstraint: [],
        //当事件拖动时,限制拖动到灰色区域
        // eventConstraint: [],
      },
      // currentEvents: [],
      reserveList: [],
      spaceReserveList: {
        startTime: "",
        endTime: "",
        // keywords: "",
      },
      // 日程列表
      scheduleForm: {
        eventKey: "",
        startDate: "",
        endDate: "",
      },
      scheduleList: [],
    };
  },
  created() {},
  computed: {
    ...mapGetters(["userList", "userInfo", "permissions", "i18nlocel"]),
  },
  mounted() {
    document.addEventListener("DOMContentLoaded", function () {
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        dayCellContent: function (arg) {
          // 直接返回日期数字（去掉"日"字）
          return arg.date.getDate();
        },
      });
      calendar.render();
    });
    this.initData();
  },
  watch: {
    // 监听语言变化并刷新日历
    i18nlocel(newLocale) {
      this.refreshCalendar(newLocale);
    },
  },
  methods: {
    // 初始化数据
    initData() {
      this.calendarApi = this.$refs.fullCalendar.getApi();
      // 获取当天日程事件
      this.getCurrentDate();
      // 设置初始语言
      this.setCalendarLocale(this.i18nlocel);
    },

    // 设置日历语言
    setCalendarLocale(locale) {
      // 映射 locale 到 FullCalendar 支持的语言代码
      const langMap = {
        zh: "zh-cn",
        en: "en",
        // 可以根据项目支持的语言添加更多映射
      };

      const calendarLang = langMap[locale] || "zh-cn";
      this.calendarOptions.locale = calendarLang;

      // 重新设置按钮文本
      this.setButtonTexts(calendarLang);
    },

    // 设置按钮文本根据当前语言
    setButtonTexts(locale) {
      if (locale === "en") {
        this.calendarOptions.buttonText = {
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        };
        // 更新视图类型名称
        this.dayType = [
          { type: "dayGridMonth", name: "Month" },
          { type: "timeGridWeek", name: "Week" },
          { type: "timeGridDay", name: "Day" },
        ];
      } else {
        this.calendarOptions.buttonText = {
          today: "今日",
          month: "月",
          week: "周",
          day: "日",
          list: "表",
        };
        // 更新视图类型名称
        this.dayType = [
          { type: "dayGridMonth", name: "月" },
          { type: "timeGridWeek", name: "周" },
          { type: "timeGridDay", name: "日" },
        ];
      }
    },

    // 刷新日历
    refreshCalendar(newLocale) {
      this.setCalendarLocale(newLocale);
      // 重新渲染日历
      if (this.calendarApi) {
        // 保存当前视图和日期
        const currentView = this.currentType;
        const currentDate = this.$refs.fullCalendar.getApi().getDate();

        // 重新初始化日历
        this.$nextTick(() => {
          this.calendarApi = this.$refs.fullCalendar.getApi();
          this.changeDayType({ type: currentView });
          this.goToDate(currentDate);
          this.getCurrentDate();
        });
      }
    },

    // 获取事件日程列表
    getSchedule() {
      getSchedule(this.scheduleForm).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.setFullCalendarData(data);
        }
      });
    },
    // 重设转换时间参数
    getTimeReserveList(start, end) {
      let startTime = dayjs(start).format("YYYY-MM-DD HH:mm:ss");
      let endTime = dayjs(end).format("YYYY-MM-DD HH:mm:ss");
      this.scheduleForm["startDate"] = startTime;
      this.scheduleForm["endDate"] = endTime;
      console.log("startDate, endDate", startTime, endTime);
      this.getSchedule();
      if (this.currentType != "dayGridMonth") {
        this.getCurrentDateObj(startTime);
      }
    },
    getCurrentDateObj(time) {
      console.log("time", time);
      let year = time.substring(0, 4);
      let month = time.substring(5, 7);
      this.currentDateObj = {
        year,
        month,
      };
    },
    changeReserveList() {
      let nowDate = new Date();
      this.reserveList.map(async (item) => {
        let endTime = Date.parse(new Date(item.endTime));
        let className = nowDate.getTime() > endTime ? "isBefore" : "noBefore";
        item["className"] = className;
        item["list"] = await this.getCurrentTimeList(item);
      });
    },
    // 点击当前单元格
    handleDateSelect(selectInfo) {
      // 过期时间不可预约
      // if (this.currentType == "dayGridMonth") {
      //   this.changeDayType(this.dayType[2]);
      //   this.$refs.fullCalendar.getApi().gotoDate(selectInfo.start);
      //   this.currentDatePicker = selectInfo.start;
      //   return;
      // }
      // if (this.isBefore(selectInfo.end)) return;
      let startTime = dayjs(selectInfo.start).format("YYYY-MM-DD HH:mm:ss");
      let endTime = dayjs(selectInfo.end).format("YYYY-MM-DD HH:mm:ss");
      console.log("handleDateSelect", startTime, endTime);
    },
    // 设置日历数据
    setFullCalendarData(data) {
      let calendarApi = this.$refs.fullCalendar.getApi();
      let calendarFunc = calendarApi.view.calendar;
      calendarFunc.unselect();
      let getEvents = calendarFunc.getEvents();
      if (getEvents && getEvents.length > 0) {
        //如果日历看板之前有数据，那么删除之前的数据
        getEvents.map((item) => {
          calendarFunc.getEventById(item.id).remove();
        });
      }
      if (data.length === 0) return;
      //   let nowDate = new Date();
      data.map((item) => {
        let scheduleList = item.scheduleList || [];
        scheduleList.map((schedule) => {
          //   let endTime = Date.parse(new Date(schedule.endTime));
          //   let className = nowDate.getTime() > endTime ? "isBefore" : "noBefore";
          let className = this.getEventType(schedule.eventStatus);
          let eventIds = {
            eventId: schedule.eventId,
            eventTimeId: schedule.eventTimeId,
          };
          calendarFunc.addEvent({
            id: JSON.stringify(eventIds),
            title: schedule.eventSubject,
            start: schedule.startTime,
            end: schedule.endTime,
            className: className,
            extendedProps: {
              list: schedule.list || [],
            },
          });
        });
      });
    },
    getEventType(eventStatus) {
      let className = "";
      switch (eventStatus) {
        case 1:
          className = "isNotYetStarted";
          break;
        case 2:
          className = "isInProgress";
          break;
        case 3:
          className = "isExpired";
          break;
      }
      return className;
    },
    // 点击当前事件获取事件id
    handleEventClick(Info) {
      console.log("handleEventClick", Info);
      let data = JSON.parse(Info.event.id);
      this.$refs.AddEvent.getDetail({
        ...data,
        type: "look",
      });
    },
    handlePopoverClick(item) {
      console.log("handlePopoverClick", item);
    },
    // 删除预约
    deleteItem(id) {
      let calendarApi = this.$refs["fullCalendar"].getApi();
      let calendarFunc = calendarApi.view.calendar;
      let getEvents = calendarFunc.getEvents();
      if (getEvents && getEvents.length > 0) {
        if (id) {
          calendarFunc.getEventById(id).remove(); //删除当前条预约
        }
      }
    },
    // 是否过期
    isBefore(date) {
      if (date) {
        let nowDate = new Date();
        let endTime = date.getTime();
        return nowDate.getTime() > endTime;
      }
    },
    getFullCalendarDetail(item) {
      console.log("item", item);
    },
    handleEvents(events) {
      console.log("events", events);
      // this.currentEvents = events;
    },

    goToDate(date) {
      let day = getFormatDate("y-m-d", date);
      this.$nextTick(() => {
        this.$refs.fullCalendar.getApi().gotoDate(day);
      });
    },
    getCurrentDate() {
      // 获得当前视图起始位置的日期
      // let getStartTime = this.$refs.fullCalendar.getApi().getDate();
      // 获得当前视图  里面有一些参数
      // let getView = this.$refs.fullCalendar.getApi().view;
      // 当前显示的事件(日程)的开始时
      let activeStart = this.$refs.fullCalendar.getApi().view.activeStart;
      // 当前显示的事件(日程)的结束时
      let activeEnd = this.$refs.fullCalendar.getApi().view.activeEnd;
      console.log("00000", activeStart, activeEnd);
      this.currentDatePicker = activeStart;
      this.currentWeek = activeStart;
      this.getTimeReserveList(activeStart, activeEnd);
    },

    // 周选择器
    timestampToTime(timestamp) {
      var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      return Y + M + D;
    },

    // 定位到当前日期
    toTday() {
      this.calendarApi.today();
      this.getCurrentDate();
    },
    //改变日期
    changeDate(e) {
      this.$refs.fullCalendar.getApi().gotoDate(e);
      this.getCurrentDate();
    },
    // 切换月、周、日视图
    changeDayType(i) {
      this.currentType = i.type;
      this.calendarApi.changeView(i.type);
      this.getCurrentDate();
    },
    // 周选择器开始时间和结束时间
    getCurrentWeek(val) {
      this.$refs.fullCalendar.getApi().gotoDate(val);
      this.getCurrentDate();
    },
    changeMonth(e) {
      console.log("changeMonth", e);
      this.currentDateObj["month"] = e;
      this.changeDayGridMonth();
    },
    changeYear(e) {
      this.currentDateObj["year"] = e;
      this.changeDayGridMonth();
    },
    changeDayGridMonth() {
      let date =
        this.currentDateObj.year + "-" + this.currentDateObj.month + "-01";
      this.$refs.fullCalendar.getApi().gotoDate(date);
      this.getCurrentDate();
    },
    setMonth(type) {
      let index = "";
      this.monthList.map((i, k) => {
        if (i == this.currentDateObj.month) {
          index = k;
        }
      });
      if ((index === 0 && type == "down") || (index == 11 && type == "up"))
        return;
      if (type == "up") {
        this.currentDateObj.month = this.monthList[Number(index) + 1];
      } else {
        this.currentDateObj.month = this.monthList[Number(index) - 1];
      }
      this.changeMonth(this.currentDateObj.month);
    },
    setYear(type) {
      let year = this.currentDateObj.year;
      if (type == "up") {
        this.changeYear(String(Number(year) + 1));
      } else {
        this.changeYear(String(Number(year) - 1));
      }
    },

    getCurrentTimeList(item) {
      let startTime = Date.parse(new Date(item.startTime));
      let endTime = Date.parse(new Date(item.endTime));
      let list = [];
      list = this.reserveList.filter((res) => {
        let start = Date.parse(new Date(res.startTime));
        let end = Date.parse(new Date(res.endTime));
        return !(startTime > end || endTime < start);
      });
      return list;
    },
    addEvent() {
      this.$refs.AddEvent.initModal();
    },
  },
};
</script>
<style lang="scss" scoped>
.fullCalendarsItem,
.fullCalendarsPopover {
  // min-width: 200px;
  font-size: 12px;
  padding-left: 10px;
  text-align: left;
  .fullCalendarstatus {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9a9a9a;
    margin-right: 5px;
  }

  .fullCalendarstext {
    flex: 1;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  }
}
.isInProgressMonth {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  background: #f8f1eb;
  .fullCalendarstatus {
    background: #d4ab85;
  }
  .fullCalendarstext {
    color: #666666;
  }
}
.isInProgressDay {
  .fullCalendarstatus {
    background: #d4ab85;
  }
  .fullCalendarstext {
  }
}
.isNotYetStartedMonth {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  background: #f8f1eb;
  .fullCalendarstatus {
    background: #9cd1a0;
  }
  .fullCalendarstext {
    color: #666666;
  }
}
.isNotYetStartedDay {
  .fullCalendarstatus {
    background: #9cd1a0;
  }
  .fullCalendarstext {
  }
}

/deep/.isBefore {
  border: none;
  background: rgba(188, 194, 204, 0.4) !important;
}
/deep/.noBefore {
  border: none;
  background: rgba(212, 171, 133, 0.4) !important;
}
// 过期的
/deep/.isExpired {
  border: none;
  border-radius: 10px !important;
  background: rgba(188, 194, 204, 0.4) !important;
}
// 进行中的
/deep/.isInProgress {
  border: none;
  border-radius: 10px !important;
  background: rgba(212, 171, 133, 0.4) !important;
  .fullCalendarstatus {
    background: #d4ab85;
  }
}
// 未开始
/deep/.isNotYetStarted {
  border: none;
  border-radius: 10px !important;
  background: rgba(156, 209, 160, 0.4) !important;
  .fullCalendarstatus {
    background: #9cd1a0;
  }
}
/deep/.fc .fc-timegrid-slot {
  background-color: #fff !important;
  height: 40px;
}
.fullCalendarsPopover {
  .fullCalendarsPopoverItem {
    padding: 0 5px;
    margin-bottom: 2px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .isBefore {
    border: none;
    border-radius: 0px;
    background: rgba(188, 194, 204, 0.4) !important;
    .fullCalendarstatus {
    }
    .fullCalendarstext {
    }
  }
  .noBefore {
    border: none;
    border-radius: 0px;
    background: rgba(212, 171, 133, 0.2) !important;
    .fullCalendarstatus {
      background: rgba(212, 171, 133, 0.4) !important;
    }
    .fullCalendarstext {
      // color: #ffffff;
    }
  }
}
</style>
