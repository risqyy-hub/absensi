import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { AttendanceStats } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: AttendanceStats;
}

export const PieChart = ({ data }: PieChartProps) => {
  const chartData = {
    labels: ['Hadir', 'Izin', 'Sakit', 'Alfa'],
    datasets: [
      {
        data: [data.hadir, data.izin, data.sakit, data.alfa],
        backgroundColor: [
          'hsl(142, 76%, 36%)', // success
          'hsl(48, 96%, 53%)',  // warning  
          'hsl(39, 100%, 57%)', // orange for sakit
          'hsl(0, 84%, 60%)',   // danger
        ],
        borderColor: [
          'hsl(142, 76%, 30%)',
          'hsl(48, 96%, 45%)',
          'hsl(39, 100%, 50%)',
          'hsl(0, 84%, 55%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = data.hadir + data.izin + data.sakit + data.alfa;
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="w-full h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};