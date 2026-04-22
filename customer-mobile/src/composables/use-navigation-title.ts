import { onShow } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";

/** 页面显示时同步原生导航栏标题（与 vue-i18n 当前语言一致） */
export function useNavigationTitle(titleKey: string) {
  const { t } = useI18n();

  onShow(() => {
    uni.setNavigationBarTitle({ title: String(t(titleKey)) });
  });
}
