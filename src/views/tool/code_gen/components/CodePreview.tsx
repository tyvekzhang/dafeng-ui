import { Modal, Tabs } from 'antd'
import { CopyOutlined, CloseOutlined } from '@ant-design/icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodePreviewProps {
  open: boolean
  onClose: () => void
}

const sampleCode = {
  domain: `package com.ruoyi.project.system.domain;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.framework.aspectj.lang.annotation.Excel;
import com.ruoyi.framework.web.domain.BaseEntity;

/**
 * 操作日志记录对象 sys_oper_log
 *
 * @author ruoyi
 * @date 2024-11-27
 */
public class SysOperLog extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 日志主键 */
    private Long operId;

    /** 模块标题 */
    @Excel(name = "模块标题")
    private String title;

    /** 业务类型（0其它 1新增 2修改 3删除）*/
    @Excel(name = "业务类型", readConverterExp = "0=其它,1=新增,2=修改,3=删除")
    private Integer businessType;

    /** 方法名称 */`,
  mapper: '// Mapper code here',
  service: '// Service code here',
  serviceImpl: '// Service Implementation code here',
  controller: '// Controller code here',
  mapperXml: '// Mapper XML here',
  sql: '-- SQL queries here',
  api: '// API endpoints here',
  index: '<!-- Vue component here -->'
}

export default function CodePreview({ open, onClose }: CodePreviewProps) {
  const items = [
    { key: 'domain', label: 'domain.java', children: sampleCode.domain },
    { key: 'mapper', label: 'mapper.java', children: sampleCode.mapper },
    { key: 'service', label: 'service.java', children: sampleCode.service },
    { key: 'serviceImpl', label: 'serviceImpl.java', children: sampleCode.serviceImpl },
    { key: 'controller', label: 'controller.java', children: sampleCode.controller },
    { key: 'mapperXml', label: 'mapper.xml', children: sampleCode.mapperXml },
    { key: 'sql', label: 'sql', children: sampleCode.sql },
    { key: 'api', label: 'api.js', children: sampleCode.api },
    { key: 'index', label: 'index.vue', children: sampleCode.index }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Modal
      title="代码预览"
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      closeIcon={<CloseOutlined />}
    >
      <Tabs
        items={items.map(item => ({
          key: item.key,
          label: item.label,
          children: (
            <div className="relative">
              <button
                onClick={() => copyToClipboard(item.children)}
                className="absolute right-2 top-2 p-2 hover:bg-gray-700 rounded"
                title="复制代码"
              >
                <CopyOutlined className="text-gray-400" />
              </button>
              <SyntaxHighlighter
                language="java"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {item.children}
              </SyntaxHighlighter>
            </div>
          )
        }))}
      />
    </Modal>
  )
}

