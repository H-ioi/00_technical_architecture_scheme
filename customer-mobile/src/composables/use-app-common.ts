/**
 * 原全局 能力聚合（页面只需引入一个 composable）
 *
 * ```ts
 * const {
 *   userInfo, curCity, isLogin, isWxPhone,
 *   openToPage, backPage, getUserInfo, getPhoneNumber, getAddressData,
 * } = useAppCommon({ onAfterProfile: submit })
 * ```
 */
import { authorityApi, commonsApi } from "@/api";
import {
  createDefaultCurCity,
  useUserStore,
} from "@/stores/modules/user";
import type { CurCity, MapLocationTarget, UserInfo } from "@/types/modules/user";
import { debounce } from "@/utils/index";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const ABSOLUTE_URL_RE =
  /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;

export interface UseAppCommonOptions {
  /** 拉取用户信息成功后重试提交（原 mixin submit） */
  onAfterProfile?: () => void;
}

export function useAppCommon(options: UseAppCommonOptions = {}) {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { userInfo, curCity, isLogin, isWxPhone, loginRedirect } =
    storeToRefs(userStore);

  function openToPage(
    url: string,
    requireLogin = false,
    isVideo = false,
    payload: unknown = null,
  ): boolean {
    if (requireLogin && (!isLogin.value || !isWxPhone.value)) {
      userStore.setLoginRedirect(url, payload);
      uni.navigateTo({ url: "/pages/login/index" });
      return false;
    }
    if (ABSOLUTE_URL_RE.test(url)) {
      if (!isVideo) {
        uni.navigateTo({
          url: `/pages/view/web-view?url=${encodeURIComponent(url)}`,
        });
      } else {
        uni.navigateTo({ url });
      }
      return true;
    }
    uni.navigateTo({ url });
    return true;
  }

  function backPage() {
    uni.navigateBack();
  }

  function toAddressMap(item: MapLocationTarget, fromBaidu = true) {
    let { longitude, latitude } = item;
    if (fromBaidu) {
      const xPi = (Math.PI * 3000) / 180;
      const x = longitude - 0.0065;
      const y = latitude - 0.006;
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
      longitude = z * Math.cos(theta);
      latitude = z * Math.sin(theta);
    }
    uni.openLocation({
      latitude,
      longitude,
      name: item.name,
      address: item.address,
    });
  }

  function makeCall(phone: string) {
    uni.makePhoneCall({ phoneNumber: phone });
  }

  function formatClosestList(city: CurCity): CurCity {
    return {
      ...city,
      closest: city.closest.map((item) => {
        if (typeof item.distance !== "number") {
          return item;
        }
        const num = item.distance;
        let label: string;
        if (num < 1000) {
          label = num < 100 ? "100m内" : `${num.toFixed(0)}m`;
        } else {
          label = `${(num / 1000).toFixed(1)}km`;
        }
        return { ...item, distance: label };
      }),
    };
  }

  function getAddressData(): Promise<CurCity> {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: "gcj02",
        success: async (res) => {
          const base: CurCity = {
            ...curCity.value,
            latitude: res.latitude,
            longitude: res.longitude,
          };
          try {
            const resolved = await commonsApi.location.get(
              base.latitude,
              base.longitude,
            );
            const merged = formatClosestList({
              ...base,
              ...resolved,
              closest: resolved?.closest ?? base.closest,
            });
            userStore.setCurCity(merged);
            userStore.setLocationAddress(merged.title, merged.city);
            resolve(merged);
          } catch {
            reject(new Error("location resolve failed"));
          }
        },
        fail: () => {
          userStore.setCurCity(createDefaultCurCity());
          reject(new Error("getLocation failed"));
        },
      });
    });
  }

  function finishLoginSuccess() {
    if (!isLogin.value) {
      return;
    }
    if (loginRedirect.value.url) {
      uni.redirectTo({ url: loginRedirect.value.url });
      userStore.clearLoginRedirect();
      return;
    }
    if (getCurrentPages().length > 1) {
      uni.navigateBack();
      return;
    }
    uni.redirectTo({ url: "/pages/home/index" });
  }

  function saveLoginUser(profile: Partial<UserInfo>, token: string) {
    userStore.login({ ...userInfo.value, ...profile, token });
    uni.setStorageSync("token", token);
  }

  function afterPhoneBound(phone: string) {
    userStore.login({ ...userInfo.value, mobilePhone: phone });
    finishLoginSuccess();
  }

  function getPhoneNumber(e: {
    detail: { errMsg: string; encryptedData?: string; iv?: string };
  }) {
    if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
      return;
    }
    if (!e.detail.encryptedData || !e.detail.iv) {
      return;
    }
    uni.login({
      provider: "weixin",
      success: async (infoRes) => {
        const result = await authorityApi.bind.post({
          encrypted: e.detail.encryptedData as string,
          iv: e.detail.iv as string,
          code: infoRes.code,
        });
        const phone = result?.fitUser?.mobilePhone;
        if (phone) {
          afterPhoneBound(phone);
        }
      },
    });
  }

  async function onWechatProfileOk(userRes: UniApp.GetUserProfileRes, code: string) {
    const result = await authorityApi.wechat.post({
      code,
      ...userRes.userInfo,
    });
    if (!result?.token) {
      return;
    }
    saveLoginUser(
      { ...userRes.userInfo, ...result.wechatUser, ...result.fitUser },
      result.token,
    );
    options.onAfterProfile?.();
    if (!isWxPhone.value) {
      uni.showToast({
        title: t("auth.needPhoneAfterLogin"),
        icon: "none",
        duration: 3000,
      });
      return;
    }
    finishLoginSuccess();
  }

  const getUserInfo = debounce(
    () => {
      uni.getUserProfile({
        lang: "zh_CN",
        desc: "用于完善会员资料",
        success: (userRes) => {
          uni.login({
            provider: "weixin",
            success: (infoRes) => {
              void onWechatProfileOk(userRes, infoRes.code);
            },
          });
        },
      });
    },
    1000,
    { leading: true, trailing: false },
  );

  return {
    userInfo,
    curCity,
    isLogin,
    isWxPhone,
    openToPage,
    backPage,
    toAddressMap,
    makeCall,
    getPhoneNumber,
    getUserInfo,
    getAddressData,
    finishLoginSuccess,
  };
}
