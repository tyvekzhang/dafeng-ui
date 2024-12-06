import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import type { ModalFuncProps } from 'antd';
import { message as Message, Modal } from 'antd';

import { isString } from '@/utils/is';

export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'success' | 'info' | 'warning' | 'error';
}

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled className="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled className="modal-icon-success" />;
  } else if (iconType === 'info') {
    return <InfoCircleFilled className="modal-icon-info" />;
  } else {
    return <CloseCircleFilled className="modal-icon-error" />;
  }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div dangerouslySetInnerHTML={{ __html: `<div>${content}</div>` }} />;
  } else {
    return content; // 直接返回 content
  }
}

// Add confirmation box
function createConfirm(options: ModalOptionsEx) {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');

  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    content: renderContent(options),
    okText: '确定',
    cancelText: '取消',
    ...options,
  };

  return Modal.confirm(opt);
}

export function myMessage() {
  return {
    createMessage: Message,
    createConfirm,
  };
}
