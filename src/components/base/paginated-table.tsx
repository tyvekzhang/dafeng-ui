import React, { useState, useEffect } from 'react'
import { Table, Pagination } from 'antd'
import type { TableProps, PaginationProps } from 'antd'

interface PaginatedTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  total: number
  current: number
  pageSize: number
  onPaginationChange: (current: number, pageSize: number) => void
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
  rowSelectionType?: 'checkbox' | 'radio'
}

export function PaginatedTable<T extends object>({
                                                   total,
                                                   current,
                                                   pageSize,
                                                   onPaginationChange,
                                                   onSelectionChange,
                                                   rowSelectionType = 'checkbox',
                                                   rowSelection: propRowSelection,
                                                   ...tableProps
                                                 }: PaginatedTableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const rowSelection: TableProps<T>['rowSelection'] = {
    type: rowSelectionType,
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => {
      setSelectedRowKeys(selectedRowKeys)
      onSelectionChange?.(selectedRowKeys, selectedRows)
    },
    ...(propRowSelection as TableProps<T>['rowSelection']),
  }

  useEffect(() => {
    // Reset selection when page or pageSize changes
    setSelectedRowKeys([])
  }, [current, pageSize])

  const handlePaginationChange: PaginationProps['onChange'] = (newCurrent, newPageSize) => {
    onPaginationChange(newCurrent, newPageSize)
  }

  return (
    <div className="flex flex-col">
      <Table
        {...tableProps}
        pagination={false}
        rowKey={tableProps.rowKey || 'id'}
        rowSelection={rowSelection}
        className={`min-h-[400px] ${tableProps.className || ''}`}
      />
      <div className="mt-4">
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          onChange={handlePaginationChange}
          className="flex justify-end"
        />
      </div>
    </div>
  )
}

