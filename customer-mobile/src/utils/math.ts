/**
 * 项目设计金额问题
 * 处理运算精度
 * 四则运算
 *
 * @param x 左操作数
 * @param y 右操作数
 * @param op 操作符，0：加；1：减；2：乘；3：除
 * @param acc 保留小数位个数，进行四舍五入
 */
export function execute(
  x?: number | string,
  y?: number | string,
  op?: number | string,
  acc?: number | string
): number {
  const xx = Number(x === undefined ? 0 : x);
  const yy = Number(y === undefined ? 0 : y);

  const a = science(xx);
  const b = science(yy);

  const na = a.r1;
  const nb = b.r1;

  const ta = a.r2;
  const tb = b.r2;
  const maxt = Math.max(ta, tb);

  // 精度值处理
  let result = 0;
  switch (parseInt(String(op), 10)) {
    case 0: // 加
      result = (xx * maxt + yy * maxt) / maxt;
      break;
    case 1: // 减
      result = (xx * maxt - yy * maxt) / maxt;
      break;
    case 2: // 乘
      result = (na * nb) / (ta * tb);
      break;
    case 3: // 除
      result = (na / nb) * (tb / ta);
      break;
    default:
      break;
  }

  // 小数位数处理
  if (acc) {
    return Number(Number(result).toFixed(parseInt(String(acc), 10)));
  }
  return Number(result);
}

/** 将数值升级(10的X的次方)到整数 */
function science(num: number): { r1: number; r2: number } {
  const re = {
    r1: 0, // 数字去掉小数点后的值，也就是 r1*r2 的结果
    r2: 1 // 小数部分，10 的长度次幂
  };
  if (isInteger(num)) {
    // 整数直接返回
    re.r1 = num;
    return re;
  }
  const snum = scienceNum(String(num)); // 处理 0.123e-10 类似问题
  const dotPos = snum.indexOf("."); // 小数点位置
  const len = snum.substr(dotPos + 1).length; // 小数点长度
  re.r2 = Math.pow(10, len);
  re.r1 = parseInt(snum.replace(".", ""), 10);
  return re;
}

/** 生成 num 个 0 的字符串 */
function _makeZero(num: number): string {
  let str = "";
  for (let i = 0; i < num; i++) {
    str += "0";
  }
  return str;
}

/**
 * 判断是否为整数，字符整数也返回 true
 */
function isInteger(num: number): boolean {
  return Math.floor(num) === Number(num);
}

/**
 * 将数值转为字符串
 *
 * 通过移动小数点扩大倍数或缩小倍数(解决出现 e+、e- 的问题)
 *
 * JavaScript 在以下情景会自动将数值转换为科学计数法：
 *   1）小数点前的数字多于 21 位。
 *   2）小数点后的零多于 5 个
 */
function scienceNum(value: string | number): string {
  if (!value) {
    return String(value);
  }
  let str = typeof value === "number" ? String(value) : value;
  let eIndex = str.indexOf("E");
  if (eIndex === -1) {
    eIndex = str.indexOf("e");
  }
  if (eIndex !== -1) {
    const doubleStr = str.substring(0, eIndex); // e 前面的值
    const eStr = parseInt(str.substring(eIndex + 1), 10); // e 后面的值
    const doubleStrArr = doubleStr.split(".");
    const doubleStr1 = doubleStrArr[0] || "";
    const doubleStr2 = doubleStrArr[1] || "";
    let normalized: string;

    if (eStr < 0) {
      // e- 很小的数
      const str1Len = doubleStr1.length;
      const eStrs = Math.abs(eStr);
      if (str1Len > eStrs) {
        const nums = doubleStr1.substring(0, eStrs);
        const nume = doubleStr1.substring(eStrs, str1Len);
        normalized = nums + "." + nume + nume;
      } else if (str1Len < eStrs) {
        const indexNum = eStrs - str1Len;
        const pad = _makeZero(indexNum);
        normalized = `0.${pad}${doubleStr1}${doubleStr2}`;
      } else {
        normalized = `0.${doubleStr1}${doubleStr2}`;
      }
    } else {
      // e+ 很大的数
      const str2Len = doubleStr2.length;
      if (str2Len > eStr) {
        const _nums = doubleStr2.substring(0, eStr);
        const _nume = doubleStr2.substring(eStr, str2Len);
        normalized = `${doubleStr1}${_nums}.${_nume}`;
      } else if (str2Len < eStr) {
        const _indexNum = eStr - str2Len;
        const _str = _makeZero(_indexNum);
        normalized = `${doubleStr1}${doubleStr2}${_str}`;
      } else {
        normalized = `${doubleStr1}${doubleStr2}`;
      }
    }
    str = normalized;
  }
  return str;
}
