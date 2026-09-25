import { useState } from 'react';
import socket from '../socket';
import {
  getAllArchivedStudioTasks,
  unarchiveStudioTask,
} from '../services/archived-studio-tasks-service';
import useStudioTasksContext from './Context/useStudioTasksContext';

const useArchivedActions = (activeGroupedTasks, setViewVariable) => {
  const [archivedStudioTasks, setArchivedStudioTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { dispatch } = useStudioTasksContext();

  const fetchArchivedStudioTasks = async (currentPage = 1) => {
    try {
      setIsLoading(true);
      const response = await getAllArchivedStudioTasks(currentPage, 20);
      if (response) {
        setArchivedStudioTasks((prev) =>
          currentPage === 1 ? response.data : [...prev, ...response.data]
        );
        setHasMore(response.hasMore);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchiveStudioTask = async (task) => {
    const taskColumn = activeGroupedTasks[task.status];
    const taskColumnLength = taskColumn.length;
    const lastItemOfColumnIndex =
      taskColumnLength > 0 ? taskColumn[taskColumnLength - 1].index + 1 : 1;
    socket.emit('taskUnarchived', task);

    const response = await unarchiveStudioTask({
      id: task._id,
      index: lastItemOfColumnIndex,
    });
    dispatch({ type: 'CREATE_STUDIOTASK', payload: response });

    fetchArchivedStudioTasks();

    setViewVariable('Aktywne');
  };

  return {
    fetchArchivedStudioTasks,
    handleUnarchiveStudioTask,
    isLoading,
    hasMore,
    archivedStudioTasks,
  };
};

export default useArchivedActions;
