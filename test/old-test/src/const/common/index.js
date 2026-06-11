import { getStore } from "@/util/store";
export default {
  $getListLabel(data, id, label = "label", value = "value") {
    let str = "--";
    const i18nlocel = getStore({ name: "i18nlocel" });
    data.map((item) => {
      if (id == item[value]) {
        str =
          label == "label"
            ? i18nlocel == "en"
              ? item["enLabel"] || item["label"]
              : item["label"]
            : item[label];
      }
    });
    return str;
  },
  $getListLabels(data, ids, label = "label", value = "value") {
    let str = [];
    const i18nlocel = getStore({ name: "i18nlocel" });
    data.map((item) => {
      if (ids.includes(item[value])) {
        let name =
          label == "label"
            ? i18nlocel == "en"
              ? item["enLabel"] || item["label"]
              : item["label"]
            : item[label];
        str.push(name);
      }
    });
    return str == [] ? "--" : String(str);
  },
  $checkNull(value) {
    // 1. 严格判断 null 和 undefined
    if (value === null || value === undefined) {
      return "--";
    }

    // 2. 对于字符串，判断是否为空或全空白
    if (typeof value === "string") {
      return value.trim() === "" ? "--" : value;
    }

    // 3. 其他类型（数字、布尔等）保留原值
    return value;
  },
};
