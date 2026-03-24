import { useMemo, useState } from 'react';

const getSummedHours = (participants, currentMonthIndex) => {
  return participants.reduce((totalHours, participant) => {
    return (
      totalHours +
      participant.months.reduce((monthSum, month) => {
        const isApril =
          new Date(month.createdAt).getUTCMonth() === currentMonthIndex;
        if (!isApril) return monthSum;

        const hoursSum = month.hours.reduce(
          (hourSum, hour) => hourSum + (hour.hourNum || 0),
          0
        );
        return monthSum + hoursSum;
      }, 0)
    );
  }, 0);
};

const compareValues = (a, b, order = 'asc') => {
  if (typeof a === 'string' && typeof b === 'string') {
    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return order === 'asc' ? a - b : b - a;
  }

  if (a instanceof Date && b instanceof Date) {
    const aTime = a.getTime();
    const bTime = b.getTime();
    return order === 'asc' ? aTime - bTime : bTime - aTime;
  }

  return 0;
};

const useSort = (data, currentMonthIndex, companyHourRate) => {
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      console.log(aVal, bVal);

      if (sortColumn === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortColumn === 'participants') {
        aVal = getSummedHours(aVal, currentMonthIndex);
        bVal = getSummedHours(bVal, currentMonthIndex);
      }

      if (sortColumn === 'hourRate' && companyHourRate) {
        aVal =
          getSummedHours(aVal, currentMonthIndex) * Number(companyHourRate);
        bVal =
          getSummedHours(bVal, currentMonthIndex) * Number(companyHourRate);
      }

      return compareValues(aVal, bVal, sortOrder);
    });
  }, [sortColumn, sortOrder, data]);

  const handleSortChange = (column) => {
    if (sortColumn === column) {
      setSortOrder((prev) => {
        return prev === 'asc' ? 'desc' : 'asc';
      });
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return {
    sortedData,
    sortColumn,
    sortOrder,
    handleSortChange,
  };
};

export default useSort;
