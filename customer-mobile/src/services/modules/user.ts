import { request } from "@/services/request";
import type { UserProfile } from "@/types/modules/user";

export async function fetchUserProfile() {
  return request<UserProfile>({
    url: "/api/user/profile",
    mockData: {
      id: "u-1001",
      nickname: "游客",
    },
  });
}
