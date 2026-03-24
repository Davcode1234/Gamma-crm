import { useEffect, useState } from 'react';
import {
  addSubtask,
  deleteSubtask,
  getPlackerTasks,
  updateSubtask,
} from '../services/studio-tasks-service';
import useStudioTasksContext from './Context/useStudioTasksContext';
import socket from '../socket';
import usePlackerTasksContext from './Context/usePlackerTasksContext';

const useSubtask = (task) => {
  const { dispatch } = useStudioTasksContext();
  const { dispatch: plackerTasksDispatch } = usePlackerTasksContext();

  const refreshPlacker = async () => {
    const plackerTasks = await getPlackerTasks();
    if (plackerTasks && plackerTasks.length > 0 && plackerTasks[0].pairs) {
      plackerTasks[0].pairs.sort((a, b) => b.tasks.length - a.tasks.length);
    }
    plackerTasksDispatch({
      type: 'SET_PLACKERTASKS',
      payload: plackerTasks,
    });
  };

  const [addSubtaskInput, setAddSubtaskInput] = useState({
    isInputOpen: false,
    isSubtaskLoading: false,
    inputValue: '',
  });
  const [editSubtaskContent, setEditSubtaskContent] = useState({
    isEditing: false,
    isLoading: false,
    contentValue: '',
    subtaskId: '',
  });

  useEffect(() => {
    socket.on('updateSubtask', (subtask) => {
      dispatch({ type: 'UPDATE_SUBTASK', payload: subtask });
    });
  }, []);

  const handleAddSubtaskInput = (object) => {
    setAddSubtaskInput((prev) => {
      return {
        ...prev,
        ...object,
      };
    });
  };

  const handleEditSubtask = (object) => {
    setEditSubtaskContent((prev) => {
      return {
        ...prev,
        ...object,
      };
    });
  };

  const handleUpdateSubtask = async (taskId, subtaskId, subtaskData) => {
    try {
      handleEditSubtask({ isLoading: true, subtaskId });
      const response = await updateSubtask({ taskId, subtaskId, subtaskData });
      dispatch({ type: 'UPDATE_SUBTASK', payload: response });
      refreshPlacker();

      socket.emit('subtaskUpdated', response);
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleEditSubtask({ isLoading: false, subtaskId: '' });
    }
  };

  const handleAddSubtask = async () => {
    try {
      if (addSubtaskInput.inputValue.length > 0) {
        handleAddSubtaskInput({ isSubtaskLoading: true });

        const response = await addSubtask({
          taskId: task._id,
          content: addSubtaskInput.inputValue,
          done: false,
        });
        dispatch({ type: 'UPDATE_SUBTASK', payload: response });
        refreshPlacker();

        socket.emit('subtaskUpdated', response);
      }
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleAddSubtaskInput({
        isSubtaskLoading: false,
        inputValue: '',
        isInputOpen: false,
      });
    }
  };

  const handleDeleteSubtask = async (taskId, subtaskId) => {
    try {
      const response = await deleteSubtask(taskId, subtaskId);
      dispatch({ type: 'UPDATE_SUBTASK', payload: response });
      refreshPlacker();
      socket.emit('subtaskUpdated', response);
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };
  return {
    handleAddSubtask,
    handleDeleteSubtask,
    handleAddSubtaskInput,
    handleUpdateSubtask,
    handleEditSubtask,
    editSubtaskContent,
    addSubtaskInput,
  };
};

export default useSubtask;
