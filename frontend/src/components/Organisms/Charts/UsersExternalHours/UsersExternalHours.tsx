import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Icon } from '@iconify/react';
import styles from './UsersExternalHours.module.css';

function UsersExternalHours({
  data,
  dataReady,
  isLoading,
  isYearly,
  year,
  selectedMonth,
}) {
  const chartTitle = isYearly
    ? `[h] Podsumowanie grafików - ${year}`
    : `[h] Podsumowanie grafików - ${selectedMonth}`;
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

  console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.chartInfoContainer}>
        <p>{` ${chartTitle}`}</p>
      </div>
      {dataReady ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="zewnętrzne" stackId="a" fill="#8884d8" />
            <Bar dataKey="wewnętrzne" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.noTasksContainer}>
          <p>Brak zleceń</p>
          <Icon icon="line-md:coffee-loop" width="24" height="24" />
        </div>
      )}
    </div>
  );
}

export default UsersExternalHours;
