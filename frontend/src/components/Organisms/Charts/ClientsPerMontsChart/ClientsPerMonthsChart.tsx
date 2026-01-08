import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import { useState } from 'react';
import { Icon } from '@iconify/react';
// import ChartContainer from '../../Atoms/ChartContainer/ChartContainer';
import styles from './ClientsPerMonthsChart.module.css';
import Select from '../../../Atoms/Select/Select';

const selectValues = ['Godziny', 'Przychód'];

function ClientsPerMonthsChart({
  dataReady,
  clientsMonthSummary,
  selectedMonth,
  clientsMonthSummaryByRevenue,
  isYearly,
  year,
  isLoading,
  displayRevenue,
}) {
  const [selectValue, setSelectValue] = useState('Godziny');

  const handleSelectValue = (e) => {
    e.preventDefault();
    setSelectValue(e.target.value);
  };
  const renderCustomizedLabel = ({ x, y, width, value }) => {
    const cx = x + width / 2;

    const raw =
      typeof value === 'string' && value.includes(' ')
        ? value.split(' ')[1]
        : String(value ?? '');

    const MAX_LETTERS = 10;
    const letters =
      raw.length > MAX_LETTERS
        ? [...raw.slice(0, MAX_LETTERS - 1), '…']
        : [...raw];

    const badgeW = 17;
    const lineH = 10;
    const padY = 6;
    const badgeH = Math.max(20, letters.length * lineH + padY * 2);

    const gap = 6;
    const top = y - gap;

    const bx = cx - badgeW / 2;
    let by = top - badgeH;
    let showNotch = true;

    if (by < 4) {
      by = y + 2;
      showNotch = false;
    }

    return (
      <g style={{ pointerEvents: 'none' }}>
        {showNotch && (
          <path
            d={`M ${cx - 4} ${top - 2} L ${cx} ${top + 3} L ${cx + 4} ${
              top - 2
            } Z`}
            fill="#1f2937"
          />
        )}

        <rect
          x={bx}
          y={by}
          width={badgeW}
          height={badgeH}
          rx={8}
          ry={8}
          fill="#1f2937"
        />

        {letters.map((ch, i) => {
          return (
            <text
              key={i}
              x={cx}
              y={by + badgeH / 2}
              fill="#fff"
              fontSize={10}
              fontWeight={500}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                writingMode: 'vertical-rl', // stack top→bottom
                textOrientation: 'sideways', // rotate each glyph 90°
                letterSpacing: '2px', // tweak spacing uniformly
                // fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              {raw}
            </text>
          );
        })}
      </g>
    );
  };
  const chartTitle = isYearly
    ? `Podsumowanie klientów - ${year}`
    : `Podsumowanie klientów - ${selectedMonth}`;

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
      <div className={styles.chartInfoContainer}>
        {displayRevenue && (
          <Select
            value={selectValue}
            handleValueChange={handleSelectValue}
            optionData={selectValues}
          />
        )}

        <p>{`${selectValue === 'Godziny' ? '[h]' : '[zł]'}  ${chartTitle}`}</p>
      </div>

      {dataReady ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={
              selectValue === 'Godziny'
                ? clientsMonthSummary
                : clientsMonthSummaryByRevenue
            }
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={selectValue === 'Godziny' ? 'Suma_godzin' : 'przychód'}
              fill={selectValue === 'Godziny' ? '#8884d8' : '#82ca9d'}
              activeBar={<Rectangle fill="#f68c1e" stroke="#f68c1e" />}
              animationBegin={0}
              animationDuration={500}
            >
              <LabelList dataKey="_id" content={renderCustomizedLabel} />
            </Bar>
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

export default ClientsPerMonthsChart;
