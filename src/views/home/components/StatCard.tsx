import { FileTextOutlined, FireOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Statistic } from 'antd';

const iconMap = {
  UserOutlined,
  FireOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
};

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <Card>
      <Statistic title={title} value={value} prefix={<IconComponent className="mr-2" />} />
    </Card>
  );
}
