import { useEffect, useState } from 'react';
import {
  DragDropContext,
  OnDragEndResponder,
  OnDragStartResponder,
} from '@hello-pangea/dnd';
import { isEqual } from 'lodash';
import { useMutation } from 'react-query';
import styles from './KanbanView.module.css';
import {
  getTasksByStatus,
  statuses,
  updateTaskStatus,
  updateTaskStatusLocal,
} from '../../../statuses';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../../services/companies-service';
import {
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../../services/studio-tasks-service';
import DroppableColumn from '../../Molecules/DroppableColumn/DroppableColumn';
import socket from '../../../socket';

function KanbanView({ filterArray, companiesFilterArray }) {
  const { studioTasks, dispatch } = useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [tasksByStatus, setTasksByStatus] = useState(getTasksByStatus([]));
  const [isDragAllowed, setIsDragAllowed] = useState(true);
  const [isStudioTasksLoading, setIsStudioTasksLoading] = useState(true);

  useEffect(() => {
    socket.on('refreshTasks', (updatedTasks) => {
      console.log('Received task update');

      dispatch({ type: 'SET_STUDIOTASKS', payload: updatedTasks });
    });

    socket.on('disableDrag', (condition) => {
      setIsDragAllowed(condition);
    });

    socket.on('enableDrag', (condition) => {
      setIsDragAllowed(condition);
    });
    return () => {
      socket.off('refreshTasks');
      socket.off('disableDrag');
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, [companiesDispatch, companies]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (studioTasks.length === 0) {
        try {
          setIsStudioTasksLoading(true);
          const allStudioTasks = await getAllStudioTasks();
          dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setIsStudioTasksLoading(false);
        }
      }

      if (studioTasks) {
        setIsStudioTasksLoading(false);
        const filteredStudioTasks = studioTasks.filter((taskToFilter) => {
          return taskToFilter.participants.some((participant) =>
            filterArray.includes(participant._id)
          );
        });

        const filteredByCompanies =
          companiesFilterArray.length > 0 && filteredStudioTasks.length > 0
            ? filteredStudioTasks.filter((task) =>
                companiesFilterArray.includes(task.client)
              )
            : studioTasks.filter((task) =>
                companiesFilterArray.includes(task.client)
              );

        if (companiesFilterArray.length <= 0) {
          const newTasksByStatus = getTasksByStatus(
            filteredStudioTasks.length > 0 ? filteredStudioTasks : studioTasks
          );
          if (!isEqual(newTasksByStatus, tasksByStatus)) {
            setTasksByStatus({ ...newTasksByStatus });
          }
          return;
        }

        const newTasksByStatus = getTasksByStatus(
          filteredByCompanies.length > 0
            ? filteredByCompanies
            : filteredStudioTasks
        );
        if (!isEqual(newTasksByStatus, tasksByStatus)) {
          setTasksByStatus({ ...newTasksByStatus });
        }
      }
    };
    fetchTasks();
  }, [dispatch, studioTasks, filterArray, companiesFilterArray]);

  const mutation = useMutation<
    void,
    Error,
    {
      source: StudioTaskTypes;
      destination: { status: StudioTaskTypes['status']; index?: number };
    }
  >(({ source, destination }) => updateTaskStatus(source, destination), {
    onSettled: async () => {
      try {
        setIsDragAllowed(false);
        const allStudioTasks = await getAllStudioTasks();
        dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
        socket.emit('taskUpdated', allStudioTasks);
      } catch (error) {
        console.error(error);
      } finally {
        setIsDragAllowed(true);
        socket.emit('dragConditionOn', true);
        console.log('dragging enabled');
      }
    },
  });

  // console.log('tasks:', tasksByStatus);

  const onDragStart: OnDragStartResponder = () => {
    socket.emit('dragConditionOff', false);
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!isDragAllowed) return;

    const { destination, source } = result;

    if (!destination) return;

    setIsDragAllowed(false);

    try {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        setIsDragAllowed(true);
        return;
      }

      const sourceStatus = source.droppableId as StudioTaskTypes['status'];
      const destinationStatus =
        destination.droppableId as StudioTaskTypes['status'];
      const sourceTask = tasksByStatus[sourceStatus][source.index];
      const destinationTask = tasksByStatus[destinationStatus][
        destination.index
      ] ?? {
        status: destinationStatus,
        index: undefined,
      };

      const updatedTasks = updateTaskStatusLocal(
        sourceTask,
        { status: sourceStatus, index: source.index },
        { status: destinationStatus, index: destination.index },
        tasksByStatus
      );

      // console.log('Updated tasksByStatus:', updatedTasks);

      setTasksByStatus({ ...updatedTasks });
      // console.log('dest task', destinationTask);

      mutation.mutateAsync({
        source: sourceTask,
        destination: destinationTask,
      });
    } catch (error) {
      console.error('Error handling drag and drop', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className={styles.columnsContainer}>
        <div className={styles.columnsWrapper}>
          {statuses.map((status) => {
            return (
              <DroppableColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                isDragAllowed={isDragAllowed}
                isLoading={isStudioTasksLoading}
              />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}

export default KanbanView;
