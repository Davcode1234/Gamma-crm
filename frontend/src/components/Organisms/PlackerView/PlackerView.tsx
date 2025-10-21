import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { getPlackerTasks } from '../../../services/studio-tasks-service';
import styles from './PlackerView.module.css';
// import DroppableColumn from '../../Molecules/DroppableColumn/DroppableColumn';
import PlackerColumn from '../../Molecules/PlackerColumn/PlackerColumn';

function PlackerView() {
  const [tasks, setTasks] = useState([]);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });
  // const [isDragAllowed, setIsDragAllowed] = useState(true);

  const fetchPlackerTasks = async () => {
    let errorHappened = false;
    try {
      setLoadingState(() => ({
        isLoading: true,
        isError: false,
      }));
      const plackerTasks = await getPlackerTasks();
      setTasks(plackerTasks);
      console.log(plackerTasks);
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
  }, []);
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
          onDragEnd={() => console.log('dsds')}
          onDragStart={() => console.log('ddsfdfsds')}
        >
          <div className={styles.columnWrapper}>
            {tasks[0].pairs.map((col) => {
              return (
                <div key={col.name}>
                  <div className={styles.headerWrapper}>
                    <p>{col.tasks.length}</p>
                    <p>{col.name}</p>
                  </div>

                  <PlackerColumn tasks={col.tasks} />
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
