import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: Array<{
    date: string;
    hadir: number;
    izin: number;
    sakit: number;
    alfa: number;
  }>;
}

export const BarChart = ({ data }: BarChartProps) => {
  const last7Days = data.slice(-7);
  
  const chartData = {
    labels: last7Days.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Hadir',
        data: last7Days.map(item => item.hadir),
        backgroundColor: 'hsl(142, 76%, 36%)',
      },
      {
        label: 'Izin',
        data: last7Days.map(item => item.izin),
        backgroundColor: 'hsl(48, 96%, 53%)',
      },
      {
        label: 'Sakit',
        data: last7Days.map(item => item.sakit),
        backgroundColor: 'hsl(39, 100%, 57%)',
      },
      {
        label: 'Alfa',
        data: last7Days.map(item => item.alfa),
        backgroundColor: 'hsl(0, 84%, 60%)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Grafik Absensi 7 Hari Terakhir',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-96">
      <Bar data={chartData} options={options} />
    </div>
  );
};