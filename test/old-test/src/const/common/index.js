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
    if (!value) {
      return "--";
    } else {
      let str = value.replace(/\s/g, "");
      return str == "" ? "--" : value;
    }
  },
};
