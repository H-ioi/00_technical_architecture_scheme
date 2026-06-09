/** 校巴考勤模块枚举（0正常 1请假 2缺勤；1上车 2下车） */
export default {
  busAttendanceStatus: [
    { label: "正常", value: 0, id: 0, enLabel: "Normal" },
    { label: "请假", value: 1, id: 1, enLabel: "Leave" },
    { label: "缺勤", value: 2, id: 2, enLabel: "Absent" },
  ],
  busRideType: [
    { label: "上车", value: 1, id: 1, enLabel: "Boarding" },
    { label: "下车", value: 2, id: 2, enLabel: "Alighting" },
  ],
};
