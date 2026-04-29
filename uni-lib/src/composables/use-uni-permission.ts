import { hasUniPermission } from "@/directives/permission";

export const useUniPermission = () => ({
  hasPermission: hasUniPermission,
});
