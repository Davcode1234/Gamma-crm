import { useEffect, useState } from 'react';
import { archiveStudioTask } from '../services/archived-studio-tasks-service';
import {
  deleteTask,
  UpdateStudioTask,
  StudioTaskTypes,
  getStudioTask,
  getPlackerTasks,
} from '../services/studio-tasks-service';
import useStudioTasksContext from './Context/useStudioTasksContext';
import useUsersContext from './Context/useUsersContext';
import useCompaniesContext from './Context/useCompaniesContext';
import socket from '../socket';
import {
  getReckoningTask,
  updateReckoningTask,
} from '../services/reckoning-view-service';
import generateDaysArray from '../utils/generateDaysArray';
import usePlackerTasksContext from './Context/usePlackerTasksContext';

const useStudioTaskUpdate = (task, closeModal, isPlacker) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isUserAssigned, setIsUserAssigned] = useState(false);
  const [formValue, setFormValue] = useState<StudioTaskTypes>(task);
  const [isMemberChangeLoading, setIsMemberChangeLoading] = useState({
    userName: '',
    isLoading: false,
    loadPlace: '',
  });
  const { users } = useUsersContext();
  const { companies } = useCompaniesContext();
  const { dispatch } = useStudioTasksContext();
  const { dispatch: plackerTasksDispatch } = usePlackerTasksContext();

  const fetchRelatedReckoTask = async () => {
    if (task.reckoTaskID) {
      const reckoTask = await getReckoningTask(task.reckoTaskID);
      return reckoTask;
    }
    return null;
  };

  const refreshPlacker = async () => {
    if (isPlacker) {
      const plackerTasks = await getPlackerTasks();
      if (plackerTasks && plackerTasks.length > 0 && plackerTasks[0].pairs) {
        plackerTasks[0].pairs.sort((a, b) => b.tasks.length - a.tasks.length);
      }
      plackerTasksDispatch({
        type: 'SET_PLACKERTASKS',
        payload: plackerTasks,
      });
    }
  };

  useEffect(() => {
    socket.on('deleteTask', (taskToDel) => {
      dispatch({ type: 'DELETE_STUDIOTASK', payload: taskToDel });
    });

    socket.on('archiveTask', (taskToArch) => {
      dispatch({ type: 'DELETE_STUDIOTASK', payload: taskToArch });
    });

    socket.on('updateTasks', (tasks) => {
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: tasks });
    });
  }, []);

  const handleDeleteTask = async (id) => {
    socket.emit('taskDeleted', task);
    dispatch({ type: 'DELETE_STUDIOTASK', payload: task });
    closeModal();
    await deleteTask(id);
  };

  const handleArchiveTask = async (id) => {
    socket.emit('taskArchived', task);
    dispatch({ type: 'DELETE_STUDIOTASK', payload: task });
    closeModal();
    await archiveStudioTask(id);
  };

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleBlur = async () => {
    setIsEditing(false);
    try {
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: formValue,
      });
      if (task.reckoTaskID.length > 0) {
        await updateReckoningTask({
          taskId: task.reckoTaskID,
          value: {
            title: formValue.title,
            description: formValue.description,
          },
        });
      }
      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleMemberLoadChange = (name, loadState, loadPlace) => {
    setIsMemberChangeLoading(() => {
      return {
        userName: name,
        isLoading: loadState,
        loadPlace,
      };
    });
  };

  const handleAddMember = async (userId: string, loadPlace: string) => {
    const userToAdd = users.find((user) => user._id === userId);
    const userToAddNasme = userToAdd.name;
    const date = new Date();

    if (!userToAdd) return;

    const participants = [...task.participants];

    const isAlreadyAdded = participants.some(
      (participant) => participant._id === userId
    );

    if (isAlreadyAdded) return;

    const relatedReckoTask = await fetchRelatedReckoTask();

    if (relatedReckoTask !== null) {
      const updatedReckoTask = {
        ...relatedReckoTask,
        participants: [
          ...relatedReckoTask.participants,
          {
            _id: userToAdd._id,
            name: userToAdd.name,
            img: userToAdd.img,
            isVisible: false,
            hours: generateDaysArray(date.getMonth() + 1, 2025),
            createdAt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
          },
        ],
      };

      await updateReckoningTask({
        taskId: updatedReckoTask._id,
        value: updatedReckoTask,
      });
    }

    const newFormValue = {
      ...task,
      participants: [...participants, userToAdd],
    };

    setFormValue(newFormValue);

    try {
      handleMemberLoadChange(userToAddNasme, true, loadPlace);
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: newFormValue,
      });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);

      refreshPlacker();
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleMemberLoadChange(userToAddNasme, false, loadPlace);
    }
  };

  const handleDeleteMember = async (userId: string, loadPlace: string) => {
    const userToDelete = users.find((user) => user._id === userId);
    const userToDeleteName = userToDelete.name;
    const participants = [...task.participants];

    const filteredParticipants = participants.filter(
      (participant) => participant._id !== userId
    );

    setFormValue((prev) => {
      return {
        ...prev,
        participants: filteredParticipants,
      };
    });

    try {
      handleMemberLoadChange(userToDeleteName, true, loadPlace);

      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: { ...task, participants: filteredParticipants },
      });
      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
      refreshPlacker();
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleMemberLoadChange(userToDeleteName, false, loadPlace);
    }
  };

  const handleClientChange = async (e) => {
    const selectedCompany = e.target.value;
    const companyObject = companies.filter(
      (com) => com.name === selectedCompany
    );
    const companyFirstClientPerson = companyObject[0].clientPerson[0].name;
    handleFormChange(e, 'client');
    setFormValue((prev) => {
      return {
        ...prev,
        clientPerson: companyFirstClientPerson,
      };
    });
    try {
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          ...task,
          client: selectedCompany,
          clientPerson: companyFirstClientPerson,
        },
      });

      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);

      if (task.reckoTaskID.length > 0) {
        await updateReckoningTask({
          taskId: task.reckoTaskID,
          value: {
            client: selectedCompany,
            clientPerson: companyFirstClientPerson,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClientPersonChange = async (e) => {
    handleFormChange(e, 'clientPerson');
    const selectedClientPerson = e.target.value;
    try {
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          ...task,
          clientPerson: selectedClientPerson,
        },
      });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);

      if (task.reckoTaskID.length > 0) {
        await updateReckoningTask({
          taskId: task.reckoTaskID,
          value: {
            clientPerson: selectedClientPerson,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    users,
    companies,
    isEditing,
    setIsEditing,
    isSelectOpen,
    setIsSelectOpen,
    isMemberChangeLoading,
    formValue,
    handleFormChange,
    handleDeleteTask,
    handleArchiveTask,
    handleBlur,
    handleAddMember,
    handleDeleteMember,
    handleClientChange,
    handleClientPersonChange,
    isUserAssigned,
    setIsUserAssigned,
  };
};

export default useStudioTaskUpdate;
