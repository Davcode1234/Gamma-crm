function generateDaysArray(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let i = 1; i <= daysInMonth; i += 1) {
    const dayOfWeek = new Date(year, month - 1, i).getDay(); // Sunday=0, Saturday=6
    daysArray.push({
      hourNum: 0,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      dayIndex: i,
    });
  }

  return daysArray;
}

export default generateDaysArray;
