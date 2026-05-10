export default {
  getScreen: function () {
    var width = document.body.clientWidth
    return 2
    if (width >= 1200) {
      return 3 // 大屏幕
    } else if (width >= 992) {
      return 2 // 中屏幕
    } else if (width >= 768) {
      return 1 // 小屏幕
    } else {
      return 0 // 超小屏幕
    }
  }
}
