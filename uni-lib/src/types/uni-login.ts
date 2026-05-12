/** 滑块验证码图片接口约定（与宿主 `/code` 等接口返回对齐）。 */
export interface UniCaptchaImageData {
  originalImageBase64: string
  jigsawImageBase64: string
  token: string
  secretKey?: string
}

/** 宿主注入：拉图、加密点位、校验（请求路径由宿主封装）。 */
export interface UniCaptchaClient {
  fetchImage: () => Promise<UniCaptchaImageData>
  encrypt: (value: string, secretKey?: string) => string
  verify: (params: { pointJson: string; token: string }) => Promise<void>
}
