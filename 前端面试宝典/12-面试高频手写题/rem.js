// 基准设计稿宽度（750px）
const designWidth = 750;
// 基准1rem对应的px值（100px=1rem）
const baseRem = 100;

function setRootFontSize() {
  const clientWidth = document.documentElement.clientWidth;
  // 限制最小/最大宽度（可选，根据需求调整）
  const adjustedWidth = Math.min(Math.max(clientWidth, 320), 750);
  // 计算当前屏幕下的根字体大小
  const fontSize = (adjustedWidth / designWidth) * baseRem;
  document.documentElement.style.fontSize = `${fontSize}px`;
}

// 初始化
setRootFontSize();
// 监听窗口变化（屏幕旋转、窗口调整等）
window.addEventListener('resize', setRootFontSize);
window.addEventListener('orientationchange', setRootFontSize);