/**
 * 元素拖拽调整宽度（左侧边缘拖动）
 * @param {HTMLElement} el 目标元素
 * @param {Object} options 配置
 */
export function useDragResize(el, options = {}) {
  if (!el) return;

  const {
    minWidth = 300,
    maxWidth = 800,
    edgeWidth = 3,
    throttleDelay = 10,
    customCursor = "/thepool/icon/icon_drag.png", // 自定义鼠标图片
    dragCursor = "col-resize",
  } = options;

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  // 最终鼠标样式
  // CSS cursor 语法: url(图像URL) x热点 y热点 宽度 高度, 备用光标
  const finalCursor = customCursor
    ? `url(${customCursor}) 10 10 , ${dragCursor}`
    : dragCursor;
  // 节流函数（防抖）
  function throttle(fn, delay) {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= delay) {
        fn(...args);
        lastTime = now;
      }
    };
  }

  // 鼠标移动：判断是否在左侧边缘
  function onMouseMove(e) {
    if (isDragging) return;
    const rect = el.getBoundingClientRect();
    const inEdge = e.clientX >= rect.left && e.clientX <= rect.left + edgeWidth;
    el.style.cursor = inEdge ? finalCursor : "default";
  }

  // 鼠标按下：开始拖拽
  function onMouseDown(e) {
    const rect = el.getBoundingClientRect();
    if (e.clientX > rect.left + edgeWidth) return;

    isDragging = true;
    startX = e.clientX;
    startWidth = rect.width;

    document.body.style.cursor = finalCursor;
    document.body.style.userSelect = "none";
    e.preventDefault();
  }

  // 拖拽中
  const onDragging = throttle((e) => {
    if (!isDragging) return;
    let newWidth = startWidth + (startX - e.clientX);
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    el.style.width = newWidth + "px";
  }, throttleDelay);

  // 结束拖拽
  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "";
    }
  }

  // 绑定事件
  el.addEventListener("mousemove", onMouseMove);
  el.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onDragging);
  window.addEventListener("mouseup", onMouseUp);

  // 销毁方法（页面销毁时清除事件）
  return () => {
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onDragging);
    window.removeEventListener("mouseup", onMouseUp);
  };
}
