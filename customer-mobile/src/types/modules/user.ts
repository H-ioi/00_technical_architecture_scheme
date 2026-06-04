/** 微信用户信息（登录后合并） */
export interface UserInfo {
  id?: string;
  nickName: string;
  gender: number;
  language: string;
  city: string;
  province: string;
  country: string;
  headimgUrl: string;
  openId: string;
  mobilePhone: string;
  session_key: string;
  unionId: string;
  token: string;
  memberCode?: string;
}

/** 定位附近点 */
export interface ClosestPlace {
  /** 接口为米；展示时可能格式化为 "100m内" / "1.2km" */
  distance: number | string;
  [key: string]: unknown;
}

/** 当前城市/定位信息 */
export interface CurCity {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  cityCode: string;
  distance: number | null;
  district: string;
  nation: string;
  province: string;
  title: string;
  closest: ClosestPlace[];
}

/** 地图导航目标 */
export interface MapLocationTarget {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

/** 登录后跳转缓存 */
export interface LoginRedirectState {
  url: string;
  data: unknown;
}
