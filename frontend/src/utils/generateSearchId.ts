function generateSearchID(numberOfTasks?) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');

  // const addOne = Number(numberOfTasks) + 1;
  // const searchID = numberOfTasks
  //   ? `${year}${month}${String(addOne).slice(4, 8)}`
  //   : `${year}${month}${Math.floor(1000 + Math.random() * 9000)}`;

  const searchID = numberOfTasks
    ? `${year}${month}${Math.floor(1000 + Math.random() * 9000)}`
    : `${year}${month}${Math.floor(1000 + Math.random() * 9000)}`;
  return Number(searchID);
}

export default generateSearchID;
