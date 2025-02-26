import { type FC, useMemo, useState } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Tag } from 'antd';
import {
  CloseCircleOutlined,
  CloseOutlined,
  CloseSquareOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';

// 定义组件的属性类型
interface TagItemProps {
  name: string;
  fixed?: boolean;
  active?: boolean;
  id: string;
  isFirst: boolean;
  isLast: boolean;
  closeTag: () => void;
  onClick: () => void;
  onCloseOthers?: () => void;
  onCloseLeft?: () => void;
  onCloseRight?: () => void;
  onCloseAll?: () => void;
  onRefresh?: () => void;
}

// 封装一个函数来处理菜单项的点击事件
const handleMenuItemClick = (callback?: () => void) => (e: { domEvent: { stopPropagation: () => void } }) => {
  e.domEvent.stopPropagation();
  callback?.();
};

const TagItem: FC<TagItemProps> = ({
                                     name,
                                     fixed = false,
                                     active = false,
                                     isFirst,
                                     isLast,
                                     closeTag,
                                     onClick,
                                     onCloseOthers,
                                     onCloseLeft,
                                     onCloseRight,
                                     onCloseAll,
                                     onRefresh,
                                   }) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  // 使用 useMemo 缓存菜单项数组
  const items: MenuProps["items"] = useMemo(() => {
    const baseItems: MenuProps["items"] = [
      {
        key: "refresh",
        label: "刷新页面",
        icon: <ReloadOutlined />,
        onClick: handleMenuItemClick(onRefresh),
      },
      {
        key: "closeCurrent",
        label: "关闭当前",
        icon: <CloseOutlined />,
        onClick: handleMenuItemClick(closeTag),
        disabled: fixed,
      },
      {
        key: "closeOthers",
        label: "关闭其他",
        icon: <CloseSquareOutlined />,
        onClick: handleMenuItemClick(onCloseOthers),
      },
    ];

    if (!isFirst) {
      baseItems.push({
        key: "closeLeft",
        label: "关闭左侧",
        icon: <LeftOutlined />,
        onClick: handleMenuItemClick(onCloseLeft),
      });
    }

    if (!isLast) {
      baseItems.push({
        key: "closeRight",
        label: "关闭右侧",
        icon: <RightOutlined />,
        onClick: handleMenuItemClick(onCloseRight),
      });
    }

    baseItems.push({
      key: "closeAll",
      label: "全部关闭",
      icon: <CloseCircleOutlined />,
      onClick: handleMenuItemClick(onCloseAll),
    });

    return baseItems;
  }, [isFirst, isLast, fixed, closeTag, onCloseOthers, onCloseLeft, onCloseRight, onCloseAll, onRefresh]);

  return (
    <Dropdown menu={{ items }} trigger={["contextMenu"]} open={contextMenuOpen} onOpenChange={setContextMenuOpen}>
      <Tag
        closable={!fixed}
        onClose={(e) => {
          e.preventDefault();
          closeTag();
        }}
        onClick={onClick}
        className={`mr-1 h-full flex justify-center items-center cursor-pointer transition-colors duration-200 ${
          active ? "bg-blue-500 text-white hover:bg-blue-400 " : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <span className="max-w-16 truncate">{name}</span>
      </Tag>
    </Dropdown>
  );
};

export default TagItem;
