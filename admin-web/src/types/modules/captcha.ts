export interface CaptchaImageData {
  originalImageBase64: string
  jigsawImageBase64: string
  token: string
  secretKey?: string
}

export interface CaptchaResponse<T> {
  repCode: string
  repMsg?: string
  repData: T
}
