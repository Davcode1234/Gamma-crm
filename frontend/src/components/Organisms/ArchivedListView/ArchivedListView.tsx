import { useEffect, useState } from 'react';
import ListContainer from '../../Atoms/ListContainer/ListContainer';
import ViewContainer from '../../Atoms/ViewContainer/ViewContainer';
import {
  getAllArchivedStudioTasks,
  unarchiveStudioTask,
} from '../../../services/archived-studio-tasks-service';
import DateFormatter from '../../../utils/dateFormatter';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './ArchivedListView.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import SkeletonUsersLoading from '../SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../Atoms/InfoBar/InfoBar';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import socket from '../../../socket';

function ArchivedListView({
  activeGroupedTasks,
  setViewVariable,
  matchingTasks,
}) {
  const [archivedStudioTasks, setArchivedStudioTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useStudioTasksContext();

  useEffect(() => {
    socket.on('unArchiveTask', (task) => {
      dispatch({ type: 'CREATE_STUDIOTASK', payload: task });
    });
  }, []);

  const fetchArchivedStudioTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getAllArchivedStudioTasks();
      setArchivedStudioTasks(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedStudioTasks();
  }, []);

  const handleUnarchiveStudioTask = async (task) => {
    const taskColumn = activeGroupedTasks[task.status];
    const taskColumnLength = taskColumn.length;
    const lastItemOfColumnIndex =
      taskColumnLength > 0 ? taskColumn[taskColumnLength - 1].index + 1 : 1;
    socket.emit('taskUnarchived', task);

    const response = await unarchiveStudioTask({
      id: task._id,
      index: lastItemOfColumnIndex,
    });
    dispatch({ type: 'CREATE_STUDIOTASK', payload: response });

    fetchArchivedStudioTasks();

    setViewVariable('Aktywne');
  };

  const tasksArray =
    matchingTasks.length > 0 ? matchingTasks : archivedStudioTasks;

  return (
    <ViewContainer>
      <ListContainer>
        <InfoBar>
          <div className={styles.infoBarContainer}>
            <div className={styles.tileElementInfoBar}>
              <p>ID</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Utworzono</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Autor</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Tytuł</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Firma</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Klient</p>
            </div>
            <div className={styles.usersImgContainer}>
              <p>Graficy</p>
            </div>
          </div>
        </InfoBar>
        {isLoading ? (
          <SkeletonUsersLoading />
        ) : (
          tasksArray.length > 0 && (
            <>
              {tasksArray.map((studioTask, index) => {
                return (
                  <TileWrapper key={studioTask._id} index={index}>
                    <div className={styles.tileContainer}>
                      <div className={styles.taskID}>
                        <p>{studioTask.searchID}</p>
                      </div>
                      <div className={styles.createdAt}>
                        <DateFormatter dateString={studioTask.startDate} />
                      </div>
                      <div className={styles.authorImgContainer}>
                        <img
                          className={styles.authorImg}
                          src={studioTask.author.img}
                          alt=""
                        />
                      </div>
                      <div className={styles.title}>
                        <p>{studioTask.title}</p>
                      </div>
                      <div className={styles.client}>
                        <p>{studioTask.client}</p>
                      </div>
                      <div className={styles.clientPerson}>
                        <p>{studioTask.clientPerson}</p>
                      </div>
                      <div className={styles.participants}>
                        <UsersDisplay
                          data={studioTask}
                          usersArray={studioTask.participants}
                          isSmall={false}
                        />
                      </div>
                      <div className={styles.restoreButtonContainer}>
                        <button
                          onClick={() => {
                            handleUnarchiveStudioTask(studioTask);
                          }}
                          className={styles.restoreButton}
                          type="button"
                        >
                          Przywróć
                        </button>
                      </div>
                    </div>
                  </TileWrapper>
                );
              })}
            </>
          )
        )}
      </ListContainer>
    </ViewContainer>
  );
}

export default ArchivedListView;
