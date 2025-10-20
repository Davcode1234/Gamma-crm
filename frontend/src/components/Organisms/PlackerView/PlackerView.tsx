import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { getPlackerTasks } from '../../../services/studio-tasks-service';
import styles from './PlackerView.module.css';
import DroppableColumn from '../../Molecules/DroppableColumn/DroppableColumn';

function PlackerView() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragAllowed, setIsDragAllowed] = useState(true);

  const displayPlacker = async () => {
    const plackerTasks = await getPlackerTasks();
    setTasks(plackerTasks);
    console.log(plackerTasks);
  };

  useEffect(() => {
    displayPlacker();
  }, []);
  return (
    <div>
      <h1>Placker</h1>
      <DragDropContext
        onDragEnd={() => console.log('dsds')}
        onDragStart={() => console.log('ddsfdfsds')}
      >
        <div className={styles.columnWrapper}>
          {tasks.length > 0 &&
            tasks[0].pairs.map((col) => {
              return (
                <DroppableColumn
                  key={col.name}
                  status={col.name}
                  tasks={col.tasks}
                  isDragAllowed={isDragAllowed}
                  isLoading={isLoading}
                />
              );
            })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default PlackerView;
