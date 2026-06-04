import type { LocationResolveVO } from "@/types/modules/commons";
import http from "@/utils/request";

export default {
  location: {
    url: "/commons/location",
    name: "经纬度解析地址",
    get: async function (
      this: { url: string },
      latitude: number,
      longitude: number,
    ): Promise<LocationResolveVO | undefined> {
      const res = await http.get<LocationResolveVO>(
        `${this.url}/${latitude}/${longitude}`,
      );
      return res.data;
    },
  },
};
