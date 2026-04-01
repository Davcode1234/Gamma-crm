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

function UsersExternalHours({ data, dataReady, isLoading }) {
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
    <div className={styles.container}>
      {dataReady ? (
        <ResponsiveContainer>
          <BarChart
            style={{
              width: '100%',
              maxWidth: '700px',
              maxHeight: '70vh',
              aspectRatio: 1.618,
            }}
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="external" stackId="a" fill="#f68c1e" background />
            <Bar dataKey="internal" stackId="a" fill="#8884d8" background />
            {/* <RechartsDevtools /> */}
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
