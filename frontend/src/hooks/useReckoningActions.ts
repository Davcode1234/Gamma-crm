import { useState } from 'react';
import useReckoTasksContext from './Context/useReckoTasksContext';
import generateSearchID from '../utils/generateSearchId';
import generateDaysArray from '../utils/generateDaysArray';
import { addReckoningTask } from '../services/reckoning-view-service';

const useReckoningActions = (user) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { dispatch } = useReckoTasksContext();

  const createEmptyTask = async (selectedMonthIndex, selectedYear) => {
    try {
      setIsAddingTask(true);
      const startDate = new Date();

      const addResponse = await addReckoningTask({
        searchID: generateSearchID(),
        idOfAssignedStudioTask: '',
        client: 'Wybierz firme',
        clientPerson: 'Wybierz klienta',
        title: '',
        description: '',
        comment: '',
        author: user[0],
        printWhat: '',
        printWhere: '',
        participants: [
          {
            _id: user[0]._id,
            isVisible: true,
            name: user[0].name,
            img: user[0].img,
            months: [
              {
                createdAt: new Date(selectedYear, selectedMonthIndex, 1),
                hours: generateDaysArray(selectedMonthIndex, 2025),
                addedToRecko: new Date(),
              },
            ],
          },
        ],
        startDate,
        month: selectedMonthIndex,
        // deadline: '',
      });

      if (addResponse !== null) {
        dispatch({ type: 'CREATE_RECKOTASK', payload: addResponse });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating empty task:', error);
      return false;
    } finally {
      setIsAddingTask(false);
    }
  };
  return {
    createEmptyTask,
    isAddingTask,
  };
};

export default useReckoningActions;
