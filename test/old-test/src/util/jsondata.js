import ISO6391 from "iso-639-1";
import chinaAreaData from "china-area-data";
// 格式化省市区数据为 el-cascader 可用结构
export function formatChinaArea() {
  const provs = chinaAreaData["86"];
  const arr = [];

  for (const provCode in provs) {
    const provName = provs[provCode];
    const cityData = chinaAreaData[provCode];

    const cities = [];
    for (const cityCode in cityData) {
      const cityName = cityData[cityCode];
      const districtData = chinaAreaData[cityCode] || {};

      const districts = Object.entries(districtData).map(([code, name]) => ({
        label: name,
        // value: code,
        value: name,
      }));

      cities.push({
        label: cityName,
        // value: cityCode,
        value: cityName,
        children: districts,
      });
    }

    // arr.push({ label: provName, value: provCode, children: cities });
    arr.push({ label: provName, value: provName, children: cities });
  }

  return arr;
}
export function getLanguageList() {
  const codes = ISO6391.getAllCodes();

  return codes.map((code) => {
    const nativeName = ISO6391.getNativeName(code); // 母语（如 English、日本語）
    // const chineseName = getChineseName(code, nativeName); // 中文

    return {
      code: nativeName,
      //   name: `${chineseName} (${nativeName})`, // 你要的格式：中文(母语)
      name: nativeName,
    };
  });
}
// 内置所有语言的中文名称（最全、最标准）
function getChineseName(code, nativeName) {
  const map = {
    zh: "中文",
    en: "英语",
    ja: "日语",
    ko: "韩语",
    fr: "法语",
    de: "德语",
    es: "西班牙语",
    pt: "葡萄牙语",
    ru: "俄语",
    it: "意大利语",
    ar: "阿拉伯语",
    hi: "印地语",
    id: "印尼语",
    ms: "马来语",
    th: "泰语",
    vi: "越南语",
    tr: "土耳其语",
    nl: "荷兰语",
    el: "希腊语",
    hu: "匈牙利语",
    pl: "波兰语",
    cs: "捷克语",
    sv: "瑞典语",
    fi: "芬兰语",
    da: "丹麦语",
    no: "挪威语",
    he: "希伯来语",
    fa: "波斯语",
    uk: "乌克兰语",
    ro: "罗马尼亚语",
    bg: "保加利亚语",
    hr: "克罗地亚语",
    sk: "斯洛伐克语",
    sl: "斯洛文尼亚语",
    lt: "立陶宛语",
    lv: "拉脱维亚语",
    et: "爱沙尼亚语",
    fil: "菲律宾语",
    bn: "孟加拉语",
    ur: "乌尔都语",
    mk: "马其顿语",
    mg: "马尔加什语",
    mt: "马耳他语",
    mi: "毛利语",
    mr: "马拉地语",
    mn: "蒙古语",
    ne: "尼泊尔语",
    oc: "奥克语",
    or: "奥里亚语",
    om: "奥罗莫语",
    os: "奥塞梯语",
    pi: "巴利语",
    ps: "普什图语",
    pa: "旁遮普语",
    qu: "克丘亚语",
    rm: "罗曼什语",
    rn: "隆迪语",
    se: "萨米语",
    sm: "萨摩亚语",
    sg: "桑戈语",
    sa: "梵语",
    sc: "撒丁语",
    sn: "绍纳语",
    sd: "信德语",
    si: "僧伽罗语",
    so: "索马里语",
    st: "塞索托语",
    su: "巽他语",
    sw: "斯瓦希里语",
    ta: "泰米尔语",
    te: "泰卢固语",
    tg: "塔吉克语",
    ti: "提格雷语",
    bo: "藏语",
    tk: "土库曼语",
    tl: "他加禄语",
    tn: "茨瓦纳语",
    to: "汤加语",
    ts: "聪加语",
    tt: "鞑靼语",
    tw: "特威语",
    ug: "维吾尔语",
    uz: "乌兹别克语",
    ve: "文达语",
    wa: "瓦隆语",
    cy: "威尔士语",
    wo: "沃洛夫语",
    xh: "科萨语",
    yi: "意第绪语",
    yo: "约鲁巴语",
    za: "壮语",
    zu: "祖鲁语",
  };
  return map[code] || nativeName;
}
