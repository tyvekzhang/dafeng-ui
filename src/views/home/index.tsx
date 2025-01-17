import DataTable from './components/DataTable';
import StatCard from './components/StatCard';

export default function Home() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="总用户数" value="1,234" icon="UserOutlined" />
        <StatCard title="今日活跃用户" value="567" icon="FireOutlined" />
        <StatCard title="总文章数" value="890" icon="FileTextOutlined" />
        <StatCard title="今日新增文章" value="23" icon="PlusCircleOutlined" />
      </div>
      <DataTable />
    </div>
    // <div className="columns-2">
    //   <p>Well, let me tell you something, ...</p>
    //   <p className="break-inside-avoid-column">Sure, go ahead, laugh...</p>
    //   <p>Maybe we can live without...</p>
    //   <p>Look. If you think this is...</p>
    // </div>
  );
}
