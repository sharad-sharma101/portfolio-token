import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import useIsMobile from '../../../hooks/useIsMobile';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FFC49F'];

const PieChartComponent = ({ data }: any) => {
    const isMobile = useIsMobile();
    
    return (
        <PieChart width={isMobile ? 300 : 240} height={isMobile ? 300 : 240}>
        <Pie
          data={data}
          cx={isMobile ? 150 : 100}
          cy={isMobile ? 150 : 100}
          innerRadius={isMobile ? 70 : 50}
          outerRadius={isMobile ? 140 : 100}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry: any, index: any) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    )
}

export default PieChartComponent;