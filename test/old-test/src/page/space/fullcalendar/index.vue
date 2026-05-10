<template>
  <div class="fullCalendar">
    <!-- 自定义头部操作样式 -->
    <div class="df_sb fullCalendar_header">
      <div class="fullCalendar_play">
        <el-button-group>
          <el-button
            @click="changeDayType(i)"
            type="default"
            :class="currentType == i.type ? 'is_active' : ''"
            :key="k"
            v-for="(i, k) in dayType"
            >{{ i.name }}</el-button
          >
        </el-button-group>
        <el-button-group>
          <el-button @click="toTday" type="default">今日</el-button>
        </el-button-group>
        <div class="selectionTime">
          <div v-if="currentType == 'dayGridMonth'" class="df_sb">
            <div class="step">
              <i class="el-icon-arrow-up" @click="setYear('up')"></i>
              <i class="el-icon-arrow-down" @click="setYear('down')"></i>
            </div>
            <div style="margin: 0 2px" class="df_sb">
              <el-date-picker
                v-model="currentDateObj.year"
                type="year"
                placeholder="年"
                :format="'yyyy'"
                :value-format="'yyyy'"
                @change="changeYear"
              >
              </el-date-picker>
              <el-select
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
        <div class="fullCalendarSearch">
          <el-input
            v-model="spaceReserveList.keywords"
            placeholder="请输入关键字"
          >
            <el-button
              type="primary"
              slot="append"
              icon="el-icon-search"
              @click="searchKeywords"
            ></el-button
          ></el-input>
        </div>
      </div>
      <div class="status">
        <span style="margin-right: 20px">
          <span class="garden"> </span> 已使用</span
        >
        <span
          ><span class="garden" style="background: #61aeb2"></span> 已预约</span
        >
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
              beforeMonth:
                isBefore(arg.event.end) && currentType != 'dayGridMonth',
            },
            {
              nobeforeMonth:
                !isBefore(arg.event.end) && currentType != 'dayGridMonth',
            },
            {
              beforeDay:
                !isBefore(arg.event.end) && currentType == 'dayGridMonth',
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
              <div class="fullCalendarstext tips">{{ arg.event.title }}</div>
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
import {
  getSpaceReserveList,
  getSpaceBoardList,
} from "@/api/space/spaceresrve.js";
import { getSpaceUsageBoard } from "@/api/space/spaceusage.js";
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
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
        slotDuration: "00:30:00", //一格时间槽代表多长时间，默认00:30:00（30分钟
        weekMode: "fixed", //在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
        weekNumbers: false, //是否在视图左边显示这是第多少周，默认fals
        weekNumberTitle: "周次", //周的国际化,默认为"W"
        slotEventOverlap: true, //相同时间段的多个日程视觉上是否允许重叠，默认true允许
        aspectRatio: 2.0, //设置日历单元格宽度与高度的比例。
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
      webSocketUrl: "",
      limitConnect: 0,
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["userList", "userInfo"]),
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi();
    let startTime = this.$route.query.startTime;
    this.$nextTick(() => {
      if (startTime) {
        let today = getFormatDate("y-m-d", new Date(), "00", "00");
        if (startTime.indexOf(today) == -1) {
          this.calendarApi.gotoDate(startTime);
        }
      }
      this.getCurrentDate();
    });
  },
  computed: {
    ...mapGetters(["userList"]),
  },
  watch: {},
  methods: {
    searchKeywords() {
      console.log("this.$route.path", this.$route.path);
      if (this.$route.path == "/reservation/fullcalendar/index") {
        this.getSpaceReservePage();
      } else if (
        this.$route.path == "/reservation/usefullcalendar/index" ||
        this.$route.path == "/space/usereservation"
      ) {
        this.getSpaceUsageBoard();
      } else {
        this.getSpaceReserveList();
      }
    },
    getTimeReserveList(start, end) {
      console.log("start, end", start, end);
      let startTime = getFormatDate("y-m-d h:i", start, "00", "00");
      let endTime = getFormatDate("y-m-d h:i", end, "00", "00");
      this.spaceReserveList["startTime"] = startTime;
      this.spaceReserveList["endTime"] = endTime;
      this.getSpaceReserveList();
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
    // 预定列表
    getSpaceReserveList() {
      if (
        this.$route.path == "/reservation/fullcalendar/index" ||
        this.$route.path == "/reservation/usefullcalendar/index" ||
        this.$route.path == "/space/usereservation"
      )
        return;
      getSpaceReserveList(this.spaceReserveList, this.$route.query.id).then(
        (res) => {
          if (res.data.success) {
            let data = res.data.data;
            this.reserveList = data;
            this.changeReserveList();
            this.$nextTick(() => {
              console.log("this.reserveList", this.reserveList);
              this.setFullCalendarData(this.reserveList);
            });
          }
        }
      );
    },
    // 使用看板
    getSpaceUsageBoard() {
      // return;
      getSpaceUsageBoard(
        {
          keywords: this.spaceReserveList.keywords,
        },
        this.currentSchool
      ).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.reserveList = data;
          this.reserveList.map((item) => {
            item["name"] = item["username"];
            this.userList.map((i) => {
              if (item.enterUserId == i.value) {
                item["enterUserName"] = i.label;
              }
            });
          });
          this.changeReserveList();
          this.$nextTick(() => {
            console.log("this.reserveList", this.reserveList);
            this.setFullCalendarData(this.reserveList);
          });
        }
      });
    },
    // 预定看板
    getSpaceReservePage() {
      // return;
      getSpaceBoardList(
        {
          keywords: this.spaceReserveList.keywords,
        },
        this.currentSchool
      ).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.reserveList = data;
          this.changeReserveList();
          this.$nextTick(() => {
            console.log("this.reserveList", this.reserveList);
            this.setFullCalendarData(this.reserveList);
          });
        }
      });
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
    handleDateSelect(selectInfo) {
      if (!this.permissions["space_reserve_add"]) return;
      // 过期时间不可预约
      // if (this.currentType == "dayGridMonth") {
      //   this.changeDayType(this.dayType[2]);
      //   this.$refs.fullCalendar.getApi().gotoDate(selectInfo.start);
      //   this.currentDatePicker = selectInfo.start;
      //   return;
      // }
      // if (this.isBefore(selectInfo.end)) return;
      let start = getFormatDate("y-m-d h:i", selectInfo.start);
      let end = getFormatDate("y-m-d h:i", selectInfo.end);
      this.$emit("setReserve", start, end);
    },
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
      let nowDate = new Date();
      data.map((item) => {
        let endTime = Date.parse(new Date(item.endTime));
        let className = nowDate.getTime() > endTime ? "isBefore" : "noBefore";
        calendarFunc.addEvent({
          id: item.id,
          title: item.name,
          start: item.startTime,
          end: item.endTime,
          className: className,
          extendedProps: {
            list: item.list,
          },
        });
      });
    },
    // 点击预约
    handleEventClick(Info) {
      console.log("info", Info);
      let data = this.reserveList.filter((item) => {
        return item.id == Info.event.id;
      });
      this.$emit("getReserveDetail", data);
    },
    handlePopoverClick(item) {
      this.$emit("getReserveDetail", [item]);
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
      // console.log("events", events);
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

    init() {
      const _this = this;
      let id = _this.$route.query.id;
      let path =
        process.env.NODE_ENV == "development"
          ? window.configUrl.devUrl
          : window.configUrl.proUrl;
      let url = `${path}/workspace/space/reserve/${id}?access_token=${_this.access_token}`;
      const ws = new WebSocket(`ws://${url}`);
      // 获取连接状态
      // console.log("ws连接状态：" + ws.readyState);
      //监听是否连接成功
      ws.onopen = function () {
        console.log("建立连接啦" + ws.readyState);
        // _this.limitConnect = 0;
        //连接成功则发送一个数据
        ws.send("我们建立连接啦11");
      };
      // 接听服务器发回的信息并处理展示
      ws.onmessage = function (data) {
        console.log("接收到来自服务器的消息：", data);
        if (data.data == "1") {
          if (this.$route.path == "/reservation/fullcalendar/index") {
            _this.getSpaceReservePage();
          } else if (
            this.$route.path == "/reservation/usefullcalendar/index" ||
            this.$route.path == "/space/usereservation"
          ) {
            console.log("  this.$route.path", this.$route.path);
            _this.getSpaceUsageBoard();
          } else {
            _this.getSpaceReserveList();
          }
        }
        //完成通信后关闭WebSocket连接
        // ws.close();
      };
      // 监听连接关闭事件
      ws.onclose = function () {
        console.log("连接关闭" + ws.readyState);
        // 监听整个过程中websocket的状态
        if (_this.limitConnect < 10) {
          _this.reconnect();
        }
      };
      // 监听并处理error事件
      ws.onerror = function (error) {
        if (_this.limitConnect < 10) {
          _this.reconnect();
        }
      };
    },
    // 设置重连
    reconnect() {
      const _this = this;
      _this.limitConnect++;
      console.log("重连第" + _this.limitConnect + "次");
      setTimeout(function () {
        _this.init();
      }, 10000);
    },
    getCurrentTimeList(item) {
      let startTime = Date.parse(new Date(item.startTime));
      let endTime = Date.parse(new Date(item.endTime));
      let list = [];
      list = this.reserveList.filter((res) => {
        let start = Date.parse(new Date(res.startTime));
        let end = Date.parse(new Date(res.endTime));
        return !(startTime > end || endTime < start);
        // return (
        //   (startTime <= start && start <= endTime) ||
        //   (startTime <= end && end <= endTime) ||
        //   (start <= startTime && endTime <= end)
        // );
      });
      return list;
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
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
}
.nobeforeMonth {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  background: #61aeb2;
  .fullCalendarstatus {
    background: #fff;
  }
  .fullCalendarstext {
    color: #fff;
  }
}
.beforeDay {
  .fullCalendarstatus {
    background: #43b49e;
  }
  .fullCalendarstext {
  }
}
.beforeMonth {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  background-color: #cccccc;
  .fullCalendarstatus {
    background: #9a9a9a;
  }
  .fullCalendarstext {
    color: #333333;
  }
}

/deep/.isBefore {
  border: none;
  border-radius: 0px;
  background: rgba(204, 204, 204, 0.4) !important;
}
/deep/.noBefore {
  border: none;
  border-radius: 0px;
  background: rgba(97, 174, 178, 0.3) !important;
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
    background: rgba(204, 204, 204, 0.4) !important;
    .fullCalendarstatus {
    }
    .fullCalendarstext {
    }
  }
  .noBefore {
    border: none;
    border-radius: 0px;
    background: rgba(97, 174, 178, 0.2) !important;
    .fullCalendarstatus {
      background-color: rgba(97, 174, 178, 1);
    }
    .fullCalendarstext {
      // color: #ffffff;
    }
  }
}
</style>
  