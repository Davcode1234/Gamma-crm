import { Droppable } from '@hello-pangea/dnd';
import PlackerCard from '../PlackerCard/PlackerCard';
import styles from './PlackerColumn.module.css';

function PlackerColumn({ tasks, columnId }) {
  return (
    <div className={styles.column}>
      <Droppable droppableId={columnId}>
        {(droppableProvided, snapshot) => {
          return (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className={`${
                snapshot.isDraggingOver
                  ? styles.draggedColumn
                  : styles.columnContainer
              } ${
                tasks.some((task) => task.status === columnId)
                  ? styles.noBorder
                  : null
              }`}
            >
              {tasks.length > 0 &&
                tasks.map((task) => {
                  return (
                    <div key={task._id}>
                      <PlackerCard task={task} />
                    </div>
                  );
                })}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default PlackerColumn;
