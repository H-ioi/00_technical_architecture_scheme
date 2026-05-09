import CryptoJS from 'crypto-js'

import { request } from 'uni-ui-lib'

export interface CaptchaImageData {
  originalImageBase64: string
  jigsawImageBase64: string
  token: string
  secretKey?: string
}

interface CaptchaResponse<T> {
  repCode: string
  repMsg?: string
  repData: T
}

const CAPTCHA_TYPE = 'blockPuzzle'

const normalizeCaptchaResponse = <T>(response: CaptchaResponse<T> | { data: CaptchaResponse<T> }) =>
  'data' in response ? response.data : response

// AES 加密滑块校验点位。
export const encryptCaptchaPoint = (value: string, secretKey?: string) => {
  if (!secretKey) {
    return value
  }

  const key = CryptoJS.enc.Utf8.parse(secretKey)
  const source = CryptoJS.enc.Utf8.parse(value)

  return CryptoJS.AES.encrypt(source, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

// 获取滑块验证码图片。
export const fetchCaptchaImage = async (): Promise<CaptchaImageData> => {
  const response = await request.get<
    CaptchaResponse<CaptchaImageData> | { data: CaptchaResponse<CaptchaImageData> },
    CaptchaResponse<CaptchaImageData> | { data: CaptchaResponse<CaptchaImageData> }
  >('/code', {
    data: { captchaType: CAPTCHA_TYPE }
  })
  const result = normalizeCaptchaResponse(response)

  if (result.repCode !== '0000') {
    throw new Error(result.repMsg || '验证码获取失败')
  }

  return result.repData
}

// 校验滑块位置。
export const checkCaptchaPoint = async (data: {
  pointJson: string
  token: string
}): Promise<void> => {
  const response = await request.post<
    CaptchaResponse<unknown> | { data: CaptchaResponse<unknown> },
    CaptchaResponse<unknown> | { data: CaptchaResponse<unknown> }
  >('/code/check', undefined, {
    params: {
      captchaType: CAPTCHA_TYPE,
      pointJson: data.pointJson,
      token: data.token
    }
  })
  const result = normalizeCaptchaResponse(response)

  if (result.repCode !== '0000') {
    throw new Error(result.repMsg || '验证失败')
  }
}
