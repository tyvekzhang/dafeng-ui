import { Layout as AntLayout } from 'antd';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const { Header, Sider, Content } = AntLayout;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AntLayout className="min-h-screen">
      <Header className="p-0 bg-white">
        <Navbar />
      </Header>
      <AntLayout>
        <Sider width={200} className="bg-white">
          <Sidebar />
        </Sider>
        <Content className="bg-gray-100">{children}</Content>
      </AntLayout>
    </AntLayout>
  );
}
