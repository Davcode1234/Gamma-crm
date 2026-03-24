import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById, TaskTypes } from '../../services/tasks-service';
import styles from './TaskProfile.module.css';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import BackButton from '../../components/Atoms/BackButton/BackButton';

function TaskProfile() {
  const params = useParams();
  const [task, setTask] = useState<TaskTypes[]>([]);

  useEffect(() => {
    getTaskById(params.id)
      .then((singleTaskArray: TaskTypes | TaskTypes[]) => {
        if (Array.isArray(singleTaskArray)) {
          if (singleTaskArray.length > 0) {
            setTask(singleTaskArray);
          }
        } else {
          setTask([singleTaskArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  }, [params.id]);

  return (
    <>
      <ControlBar>
        <BackButton path="zlecenia" />
        {task.length > 0 && (
          <div>
            <h3>{task[0]._id.substring(2, 8)}</h3>
          </div>
        )}
        <div className={styles.controlBarBtnsWrapper}>
          <button type="button" onClick={() => {}}>
            Filtry
          </button>
        </div>
      </ControlBar>
      <div className={styles.taskProfileContainer}>
        {task.length > 0 && (
          <>
            <h2 key={task[0]._id}>{task[0].title}</h2>
            <img
              // @ts-ignore
              src={task[0].image}
              alt="task pic"
              className={styles.taskImage}
            />
          </>
        )}
      </div>
    </>
  );
}

export default TaskProfile;
