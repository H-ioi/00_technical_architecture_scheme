import type { CurCity, LoginRedirectState, UserInfo } from "@/types/modules/user";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const TOKEN_KEY = "token";

const DEFAULT_AVATAR =
  "https://gcimage.oss-cn-shenzhen.aliyuncs.com/img/touxiang.png";

export function createDefaultUserInfo(): UserInfo {
  return {
    nickName: "微信一键登录",
    gender: 1,
    language: "",
    city: "",
    province: "",
    country: "",
    headimgUrl: DEFAULT_AVATAR,
    openId: "",
    mobilePhone: "",
    session_key: "",
    unionId: "",
    token: "",
  };
}

export function createDefaultCurCity(): CurCity {
  return {
    latitude: 23.12463,
    longitude: 113.36199,
    address: "广东省广州市天河区",
    city: "广州市",
    cityCode: "156440100",
    distance: null,
    district: "天河区",
    nation: "中国",
    province: "广东省",
    title: "广州市",
    closest: [],
  };
}

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo>(createDefaultUserInfo());
  const curCity = ref<CurCity>(createDefaultCurCity());
  const loginRedirect = ref<LoginRedirectState>({ url: "", data: null });
  const locationTitle = ref("");
  const locationCity = ref("");

  const isLogin = computed(() => Boolean(userInfo.value.token));
  const isWxPhone = computed(() => Boolean(userInfo.value.mobilePhone));

  function hydrateTokenFromStorage() {
    const token = uni.getStorageSync(TOKEN_KEY);
    if (typeof token === "string" && token) {
      userInfo.value.token = token;
    }
  }

  function setUserInfo(patch: Partial<UserInfo>) {
    userInfo.value = { ...userInfo.value, ...patch };
  }

  function login(info: UserInfo) {
    userInfo.value = { ...userInfo.value, ...info };
    if (info.token) {
      uni.setStorageSync(TOKEN_KEY, info.token);
    }
  }

  function logout() {
    userInfo.value = createDefaultUserInfo();
    try {
      uni.removeStorageSync(TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  function setCurCity(city: CurCity) {
    curCity.value = city;
  }

  function setLocationAddress(title: string, city: string) {
    locationTitle.value = title;
    locationCity.value = city;
  }

  function setLoginRedirect(url: string, data: unknown = null) {
    loginRedirect.value = { url, data };
  }

  function clearLoginRedirect() {
    loginRedirect.value = { url: "", data: null };
  }

  hydrateTokenFromStorage();

  return {
    userInfo,
    curCity,
    loginRedirect,
    locationTitle,
    locationCity,
    isLogin,
    isWxPhone,
    setUserInfo,
    login,
    logout,
    setCurCity,
    setLocationAddress,
    setLoginRedirect,
    clearLoginRedirect,
  };
});
