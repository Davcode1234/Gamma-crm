import { Icon } from '@iconify/react';
import { useEffect, useState, useRef } from 'react';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import {
  getAllStudioTasks,
  getPlackerTasks,
  getPlackerTasksByCompany,
  UpdateStudioTask,
} from '../../../services/studio-tasks-service';
import styles from './PlackerView.module.css';
// import DroppableColumn from '../../Molecules/DroppableColumn/DroppableColumn';
import PlackerColumn from '../../Molecules/PlackerColumn/PlackerColumn';
import useUsersContext from '../../../hooks/Context/useUsersContext';
import { getAllUsers } from '../../../services/users-service';
import socket from '../../../socket';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import usePlackerTasksContext from '../../../hooks/Context/usePlackerTasksContext';

function PlackerView({ plackerDataVariable }) {
  // const [tasks, setTasks] = useState([]);
  const { plackerTasks: tasks, dispatch: plackerTasksDispatch } =
    usePlackerTasksContext();
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });

  const [isDragAllowed, setIsDragAllowed] = useState(true);
  const { users, dispatch } = useUsersContext();
  const { dispatch: studioTasksDispatch } = useStudioTasksContext();
  const scrollContainerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    if (e.target.closest('.placker-task-card')) {
      return;
    }

    isDown.current = true;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.add(styles.activeDrag);
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove(styles.activeDrag);
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove(styles.activeDrag);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault(); // Stop text selection
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.5; // * 1.5 is the scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        try {
          const allUsers = await getAllUsers();
          dispatch({ type: 'SET_USERS', payload: allUsers });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [dispatch, users.length]);

  const fetchPlackerTasks = async () => {
    let errorHappened = false;
    try {
      setLoadingState(() => ({
        isLoading: true,
        isError: false,
      }));
      if (plackerDataVariable === 'Graficy') {
        const plackerTasks = await getPlackerTasks();
        if (plackerTasks && plackerTasks.length > 0 && plackerTasks[0].pairs) {
          plackerTasks[0].pairs.sort((a, b) => b.tasks.length - a.tasks.length);
        }
        plackerTasksDispatch({
          type: 'SET_PLACKERTASKS',
          payload: plackerTasks,
        });
      } else {
        const plackerTasks = await getPlackerTasksByCompany();
        if (plackerTasks && plackerTasks.length > 0 && plackerTasks[0].pairs) {
          plackerTasks[0].pairs.sort((a, b) => b.tasks.length - a.tasks.length);
        }

        plackerTasksDispatch({
          type: 'SET_PLACKERTASKS',
          payload: plackerTasks,
        });
      }
    } catch (error) {
      errorHappened = true;
      setLoadingState(() => ({
        isLoading: false,
        isError: true,
      }));
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: false,
        isError: errorHappened ? true : prev.isError,
      }));
    }
  };

  useEffect(() => {
    fetchPlackerTasks();
  }, [plackerDataVariable]);

  const onDragEnd: OnDragEndResponder = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setIsDragAllowed(true);
    const sourceUserId = source.droppableId;
    const destUserId = destination.droppableId;
    const destinationUser = users.find((user) => user._id === destUserId);

    if (!destinationUser) {
      console.error('User not found');
      return;
    }

    const newTasksState = JSON.parse(JSON.stringify(tasks)); // Deep copy state, React trick that create new state instead of referance to previous state (geminy prompt),https://medium.com/@mgarg2121/shallow-vs-deep-copying-in-react-essential-knowledge-for-efficient-state-management-22404614e6a7
    const pairs = [...newTasksState[0].pairs];

    const sourceCol = pairs.find((col) => col.id === sourceUserId);
    const destCol = pairs.find((col) => col.id === destUserId);

    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    if (
      !movedTask.participants.some((user) => user._id === destinationUser._id)
    ) {
      movedTask.participants = movedTask.participants.filter(
        (u) => u._id !== sourceUserId
      );
      movedTask.participants.push(destinationUser);
    } else {
      return;
    }

    destCol.tasks.splice(destination.index, 0, movedTask);

    plackerTasksDispatch({ type: 'SET_PLACKERTASKS', payload: newTasksState });

    try {
      await UpdateStudioTask({
        id: movedTask._id,
        studioTaskData: { participants: movedTask.participants },
      });
      const allStudioTasks = await getAllStudioTasks();
      studioTasksDispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
      socket.emit('taskUpdated', allStudioTasks);
    } catch (error) {
      console.error('Error handling drag and drop', error);
    }
  };

  if (loadingState.isError) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:close-small"
          width="70"
          height="70"
          className={styles.errorIcon}
        />
        <p>Coś poszło nie tak :(</p>
      </div>
    );
  }
  if (!loadingState.isError && loadingState.isLoading) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  if (!loadingState.isError && !loadingState.isLoading && tasks.length > 0) {
    return (
      <div className={styles.columnsWrapper}>
        {/* <h1>Placker</h1> */}
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={() => console.log('ddsfdfsds')}
        >
          {/* eslint-disable-next-line */}
          <div
            className={styles.columnWrapper}
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            role="region"
            aria-label="Kanban Board"
          >
            {plackerDataVariable === 'Graficy'
              ? [...tasks[0].pairs].map((col) => {
                  const userColumn =
                    users.length > 0 && users.find((us) => us._id === col.id);

                  if (!userColumn) return null;

                  return (
                    <div
                      key={col.id}
                      // className={`${
                      //   index % 2 === 0 ? styles.darker : styles.lighter
                      // }`}
                    >
                      <div className={styles.headerWrapper}>
                        <p className={styles.tasksNumber}>{col.tasks.length}</p>
                        <p className={styles.columnName}>{userColumn.name}</p>
                      </div>

                      <PlackerColumn
                        tasks={col.tasks}
                        columnId={col.id}
                        isDragAllowed={isDragAllowed}
                      />
                    </div>
                  );
                })
              : [...tasks[0].pairs].map((col) => {
                  return (
                    <div
                      key={col.id}
                      // className={`${
                      //   index % 2 === 0 ? styles.darker : styles.lighter
                      // }`}
                    >
                      <div className={styles.headerWrapper}>
                        <p className={styles.tasksNumber}>{col.tasks.length}</p>
                        <p className={styles.columnName}>{col.id}</p>
                      </div>

                      <PlackerColumn
                        tasks={col.tasks}
                        columnId={col.id}
                        isDragAllowed={isDragAllowed}
                      />
                    </div>
                  );
                })}
          </div>
        </DragDropContext>
      </div>
    );
  }

  return (
    <div className={styles.noTasksContainer}>
      <p>Brak zleceń</p>
      <Icon icon="line-md:coffee-loop" width="24" height="24" />
    </div>
  );
}

export default PlackerView;
