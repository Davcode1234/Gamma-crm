import { useState } from 'react';

export const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const years = [2024, 2025, 2026];

const useCurrentDate = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // useEffect(() => {
  //   const monthIndex = new Date().getMonth();
  //   const currentYear = new Date().getFullYear();
  //   setSelectedYear(currentYear);
  //   setSelectedMonth(months[monthIndex]);
  // }, []);

  return {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  };
};

export default useCurrentDate;
