import type {
  BindPhonePayload,
  BindPhoneResult,
  WechatLoginPayload,
  WechatLoginResult,
} from "@/types/modules/authority";
import http from "@/utils/request";

export default {
  bind: {
    url: "/authority/bind",
    name: "绑定手机号",
    post: async function (
      this: { url: string },
      data: BindPhonePayload,
    ): Promise<BindPhoneResult | undefined> {
      const res = await http.post<BindPhoneResult>(this.url, data);
      return res.data;
    },
  },

  wechat: {
    url: "/authority/wechat",
    name: "微信登录",
    post: async function (
      this: { url: string },
      data: WechatLoginPayload,
    ): Promise<WechatLoginResult | undefined> {
      const res = await http.post<WechatLoginResult>(this.url, data);
      return res.data;
    },
  },
};
