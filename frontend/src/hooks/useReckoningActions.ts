import { useState } from 'react';
import useReckoTasksContext from './Context/useReckoTasksContext';
import generateSearchID from '../utils/generateSearchId';
import generateDaysArray from '../utils/generateDaysArray';
import {
  addReckoningTask,
  addReckoningTaskFromKanban,
  getMyReckoningTasks,
} from '../services/reckoning-view-service';
import {
  getStudioTask,
  UpdateStudioTask,
} from '../services/studio-tasks-service';
import socket from '../socket';

const useReckoningActions = (user) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { dispatch } = useReckoTasksContext();
  const currentUserId = user.length > 0 && user[0]._id;

  const createEmptyTask = async (selectedMonthIndex, selectedYear) => {
    if (!currentUserId || !user?.[0]) {
      console.error('User data is missing');
      return false;
    }
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
                hours: generateDaysArray(selectedMonthIndex, selectedYear),
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

  const handleAddFromKanban = async ({
    _id,
    searchID,
    client,
    clientPerson,
    title,
    description,
    participants,
    createdAt,
    selectedMonthIndex,
    selectedYear,
    setAddTaskFromKanbanState,
    studioTasksDispatch,
  }) => {
    try {
      setIsAddingTask(true);

      // const startDate = new Date(selectedYear, selectedMonthIndex, 1);

      const addResponse = await addReckoningTaskFromKanban({
        searchID,
        idOfAssignedStudioTask: _id,
        client,
        clientPerson,
        title,
        description,
        comment: '',
        author: user[0],
        printWhat: '',
        printWhere: '',
        participants: participants.map((part) => {
          return {
            _id: part._id,
            isVisible: currentUserId === part._id,
            name: part.name,
            img: part.img,
            months: [
              {
                createdAt: new Date(selectedYear, selectedMonthIndex, 1),
                hours: generateDaysArray(selectedMonthIndex, selectedYear),
                addedToRecko: new Date(),
              },
            ],
          };
        }),
        startDate: new Date(createdAt ?? Date.now()),
        month: selectedMonthIndex,
        // deadline: '',
      });

      if (addResponse.alreadyExist) {
        setAddTaskFromKanbanState((prev) => {
          return {
            ...prev,
            isAlreadyExist: true,
          };
        });
        console.log(addResponse);
      }

      const updatedTask = await UpdateStudioTask({
        id: _id,
        studioTaskData: { reckoTaskID: addResponse._id },
      });

      const res = await getStudioTask(updatedTask._id);
      studioTasksDispatch({
        type: 'UPDATE_STUDIOTASK',
        payload: res,
      });
      socket.emit('tasksUpdated', res);

      const response = await getMyReckoningTasks(
        currentUserId,
        `${selectedYear}`,
        selectedMonthIndex
      );
      if (response) {
        // setReckoningTasks(response);
        dispatch({ type: 'SET_RECKOTASKS', payload: response });
      }
    } catch (error) {
      console.error(error);
      setAddTaskFromKanbanState((prev) => {
        return {
          ...prev,
          errorMessage: 'Coś poszło nie tak :(',
        };
      });
    } finally {
      setIsAddingTask(false);

      setAddTaskFromKanbanState((prev) => {
        return {
          ...prev,
          successMessage: 'Zlecenie utworzone!',
        };
      });
    }
  };

  return {
    createEmptyTask,
    isAddingTask,
    handleAddFromKanban,
  };
};

export default useReckoningActions;
