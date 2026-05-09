export type UniPermissionMode = "remove" | "hidden" | "disabled";
export type UniPermissionValue =
  | string
  | string[]
  | { code: string | string[]; mode?: UniPermissionMode };
export type UniPermissionChecker = (permission: string | string[]) => boolean;

export interface UniPermissionOptions {
  hasPermission?: UniPermissionChecker;
  defaultMode?: UniPermissionMode;
  onDenied?: (permission: string | string[]) => void;
}
