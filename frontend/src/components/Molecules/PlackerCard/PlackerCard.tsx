import { Draggable } from '@hello-pangea/dnd';
import { statusNames } from '../../../statuses';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import styles from './PlackerCard.module.css';
import DateFormatter from '../../../utils/dateFormatter';
import UsersDisplay from '../../Organisms/UsersDisplay/UsersDisplay';

function PlackerCard({ task, index, isDragAllowed, userId }) {
  const companyClass = task.client.split(' ').join('');
  const dragDisabledClass = isDragAllowed ? '' : styles.dragDisabled;

  return (
    <Draggable
      draggableId={`${userId}_${task._id}`}
      index={index}
      isDragDisabled={!isDragAllowed}
    >
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={dragDisabledClass}
        >
          <div
            className={styles.card}
            style={{
              opacity: snapshot.isDragging ? 0.9 : 1,
              transform: snapshot.isDragging ? 'scale(0.95)' : '',
            }}
          >
            <div className={styles.clientInfoWrapper}>
              <CompanyBatch
                companyClass={companyClass}
                isClientPerson={false}
                isBigger={false}
              >
                {task.client}
              </CompanyBatch>

              <CompanyBatch companyClass={null} isClientPerson isBigger={false}>
                {task.clientPerson}
              </CompanyBatch>
            </div>
            <p className={styles.title}>{task.title}</p>
            <p className={styles.statusName}>{statusNames[task.status]}</p>
            <div className={styles.userDisplayWrapper}>
              <UsersDisplay
                data={task}
                usersArray={task.participants}
                isSmall
              />
            </div>
            <div className={styles.datesWrapper}>
              {task.deadline && task.startDate ? (
                <>
                  <DateFormatter dateString={task.startDate} />
                  <span>&nbsp;-&nbsp;</span>
                  <DateFormatter dateString={task.deadline} />
                </>
              ) : (
                <p className={styles.noDates}>Brak dat</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default PlackerCard;
