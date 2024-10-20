/**
 * 将光标定位到可编辑div的末尾
 * @param target 目标HTMLElement
 */
export function keepCursorEnd(target: HTMLElement) {
  // 解决Firefox不获取焦点无法定位问题
  target.focus();
  // 创建range对象
  const range = window.getSelection();
  // 选择target下所有子内容
  range?.selectAllChildren(target);
  // 光标移至最后
  range?.collapseToEnd();
}

interface Window {
  clipboardData?: DataTransfer; // 扩展window对象的类型定义
}
/**
 * 获取粘贴事件中的纯文本内容
 * @param event 粘贴事件的ClipboardEvent
 * @returns {string} 返回粘贴的文本，如果没有则返回空字符串
 */
export function getPasteText(event: ClipboardEvent): string {
  const clipboardData = event.clipboardData || (window as Window).clipboardData;
  if (clipboardData) {
    return clipboardData.getData('text/plain') || '';
  }
  return '';
}
