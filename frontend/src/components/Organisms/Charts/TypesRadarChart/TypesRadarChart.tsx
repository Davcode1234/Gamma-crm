import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { Icon } from '@iconify/react';
import DashboardContainerTitle from '../../../Atoms/DashboardContainerTitle/DashboardContainerTitle';
import styles from './TypesRadarChart.module.css';

function TypesRadarChart({ tasksTypeSummary, dataReady, isYearly }) {
  const chartTitle = isYearly
    ? `Typy archiwalnych zleceń`
    : `Typy aktywnych zleceń`;

  return (
    <div className={styles.radarChartContainer}>
      <DashboardContainerTitle>{chartTitle}</DashboardContainerTitle>
      {dataReady ? (
        <ResponsiveContainer width="100%" height="85%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={tasksTypeSummary}
          >
            <Label value="any" />
            <PolarGrid />
            <PolarAngleAxis dataKey="taskType" />
            <PolarRadiusAxis />
            <Radar
              name="Mike"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
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

export default TypesRadarChart;
