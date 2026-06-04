import type { CurCity } from "@/types/modules/user";

/** 逆地理/定位接口返回，与 CurCity 字段对齐 */
export type LocationResolveVO = Partial<CurCity>;
