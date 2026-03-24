const summarizeCompanyProfHours = (array, currentMonthIndex) => {
  const summarizedHours = array.participants.reduce(
    (totalHours, participant) => {
      return (
        totalHours +
        participant.months.reduce((monthSum, month) => {
          const date = new Date(month.createdAt);
          const monthMatches = date.getUTCMonth() === currentMonthIndex;

          if (!monthMatches) return monthSum;

          const hoursSum = month.hours.reduce((hourSum, hour) => {
            return hourSum + (hour.hourNum || 0);
          }, 0);
          return hoursSum + monthSum;
        }, 0)
      );
    },
    0
  );

  return summarizedHours;
};

export default summarizeCompanyProfHours;
