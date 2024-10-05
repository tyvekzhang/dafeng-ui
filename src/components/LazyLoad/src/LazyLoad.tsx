import type { LoadableComponent } from '@loadable/component'
import React, { type ReactNode, Suspense } from 'react'
import { Spin } from 'antd'

/**
 * @description 路由懒加载
 * @param {LoadableComponent<any>} Component - 需要访问的组件
 * @returns {ReactNode} 包含加载状态的组件
 */
const LazyLoad = (Component: LoadableComponent<Record<string, unknown>>): ReactNode => {
  const spinnerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }

  return (
    <Suspense fallback={<Spin size='large' style={spinnerStyle} />}>
      <Component />
    </Suspense>
  )
}

export default LazyLoad
