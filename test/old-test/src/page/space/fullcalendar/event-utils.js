let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
console.log("todayStr", todayStr);
export const INITIAL_EVENTS = [
  // {
  //   // id: createEventId(),
  //   title: 'testtest',
  //   start: '2022-11-16 06:00',
  //   end: '2022-11-16 20:59',
  //   className: "isBefore",
  // },
  // {
  //   // id: createEventId(),
  //   title: 'testtest',
  //   start: '2022-11-16 06:00',
  //   end: '2022-11-16 10:59',
  //   className: "isBefore",
  // },
  // {
  //   // id: createEventId(),
  //   title: 'testtest',
  //   start: '2022-11-18 06:00',
  //   end: '2022-11-20 20:59',
  //   className: "noBefore",
  // },
  // {
  //   // id: createEventId(),
  //   title: 'testtest',
  //   start: '2022-11-16 06:00',
  //   end: '2022-11-20 20:59',
  //   className: "noBefore",
  // },
]

export function createEventId() {
  return String(eventGuid++)
}
export const monthList = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]
export const dayViewType = [{
    name: "月",
    type: "dayGridMonth",
  },
  {
    name: "周",
    type: "timeGridWeek",
  },
  {
    name: "日",
    type: "timeGridDay",
  },
]
