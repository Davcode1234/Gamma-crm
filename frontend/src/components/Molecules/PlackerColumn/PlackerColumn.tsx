import { Droppable } from '@hello-pangea/dnd';
import PlackerCard from '../PlackerCard/PlackerCard';
import styles from './PlackerColumn.module.css';

function PlackerColumn({ tasks, columnId, isDragAllowed }) {
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
              } ${tasks.length > 0 ? styles.noBorder : null}`}
            >
              {tasks.length > 0 &&
                tasks.map((task, index) => {
                  return (
                    <div key={task._id}>
                      <PlackerCard
                        task={task}
                        index={index}
                        isDragAllowed={isDragAllowed}
                        userId={columnId}
                      />
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
