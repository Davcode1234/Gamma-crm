const summarizeHours = (array) => {
  const totalHours = array.reduce((acc, task) => acc + Number(task.hourNum), 0);

  return totalHours;
};

export default summarizeHours;
