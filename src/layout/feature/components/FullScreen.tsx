import { Tooltip } from 'antd'
import { useFullscreen } from 'ahooks'
import {CompressOutlined, ExpandOutlined} from "@ant-design/icons";
import React from "react";

export default function FullScreen() {
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)

  return (
    <Tooltip title={isFullscreen ? '退出全屏' : '进入全屏'} placement='bottom' mouseEnterDelay={0.5}>
      <span className='icon-btn' style={{fontSize: 20}} onClick={toggleFullscreen}>
        {!isFullscreen ? <ExpandOutlined /> : <CompressOutlined />}
      </span>
    </Tooltip>
  )
}
