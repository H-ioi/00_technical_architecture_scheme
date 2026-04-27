// 配置编译环境和线上环境之间的切换

const env = process.env
const baseUrl = ''
//at.alicdn.com/t/c/font_3632099_p3bhuxwys9.css
// const iconfontVersion = ['667895_v7uduh4zui', '1638883_qi08jij1ln', '3632099_p3bhuxwys9']
//at.alicdn.com/t/c/font_3632099_gqmaulwp0or.css
//at.alicdn.com/t/c/font_3632099_rf7siou1ddc.css
//at.alicdn.com/t/c/font_4236062_f32e31jjr0e.css
const iconfontVersion = ['3632099_rf7siou1ddc','4236062_f32e31jjr0e']
const iconfontUrl = '//at.alicdn.com/t/c/font_$key.css'
const codeUrl = `${window.location.origin}/code`
const actUrl = `${window.location.origin}/act/modeler.html?modelId=`
if (env.NODE_ENV === 'development') {

} else if (env.NODE_ENV === 'production') {

} else if (env.NODE_ENV === 'test') {

}
export {
  baseUrl,
  actUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
