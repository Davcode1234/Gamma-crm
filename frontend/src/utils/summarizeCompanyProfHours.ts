const summarizeCompanyProfHours = (
  array,
  currentMonthIndex: number,
  currentYear: number | string
) => {
  const year = Number(currentYear);

  return array.participants.reduce((totalHours, participant) => {
    const participantHours = (participant.months ?? []).reduce(
      (monthSum, month) => {
        const date = new Date(month.createdAt);

        const monthMatches = date.getUTCMonth() === currentMonthIndex;
        const yearMatches = date.getUTCFullYear() === year;

        if (!monthMatches || !yearMatches) return monthSum;

        const hoursSum = (month.hours ?? []).reduce(
          (hourSum, hour) => hourSum + (hour.hourNum || 0),
          0
        );

        return monthSum + hoursSum;
      },
      0
    );

    return totalHours + participantHours;
  }, 0);
};

export default summarizeCompanyProfHours;
