import { Table } from 'antd';

const columns = [
  {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '发布日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '阅读量',
    dataIndex: 'views',
    key: 'views',
  },
];

const data = [
  {
    key: '1',
    title: '人工智能的未来展望',
    author: '张三',
    date: '2023-05-15',
    views: 1234,
  },
  {
    key: '2',
    title: '深度学习在自然语言处理中的应用',
    author: '李四',
    date: '2023-05-14',
    views: 987,
  },
  {
    key: '3',
    title: '区块链技术的发展趋势',
    author: '王五',
    date: '2023-05-13',
    views: 765,
  },
];

export default function DataTable() {
  return <Table columns={columns} dataSource={data} pagination={false} />;
}
