import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Icon } from '@iconify/react';
import DashboardContainerTitle from '../../../Atoms/DashboardContainerTitle/DashboardContainerTitle';
import styles from './MonthPerDaySummaryChart.module.css';

function MonthPerDaySummaryChart({
  selectedMonth,
  monthDaysSummary,
  dataReady,
  isYearly,
  year,
  isLoading,
}) {
  const chartTitle = isYearly
    ? `[h] Podsumowanie roku - ${year}`
    : `[h] Podsumowanie miesiąca - ${selectedMonth}`;

  const dataKey = isYearly ? 'month' : 'day';

  const fullYearArray = [
    { month: 1, totalHours: 0 },
    { month: 2, totalHours: 0 },
    { month: 3, totalHours: 0 },
    { month: 4, totalHours: 0 },
    { month: 5, totalHours: 0 },
    { month: 6, totalHours: 0 },
    { month: 7, totalHours: 0 },
    { month: 8, totalHours: 0 },
    { month: 9, totalHours: 0 },
    { month: 10, totalHours: 0 },
    { month: 11, totalHours: 0 },
    { month: 12, totalHours: 0 },
  ];

  const chartData = isYearly
    ? fullYearArray.map(({ month }) => {
        const updated = monthDaysSummary.find(
          (m) => Number(m.month) === Number(month)
        );
        return {
          month,
          totalHours: updated ? updated.totalHours : 0,
        };
      })
    : monthDaysSummary;

  if (isLoading) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  return (
    <div className={styles.lineChartContainer}>
      <DashboardContainerTitle>{chartTitle}</DashboardContainerTitle>
      {dataReady ? (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalHours"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              animationBegin={0}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.noTasksContainer}>
          <p>Brak danych</p>
          <Icon icon="line-md:coffee-loop" width="24" height="24" />
        </div>
      )}
    </div>
  );
}

export default MonthPerDaySummaryChart;
