import { useEffect, useState } from 'react';
import ListContainer from '../../Atoms/ListContainer/ListContainer';
import ViewContainer from '../../Atoms/ViewContainer/ViewContainer';
import DateFormatter from '../../../utils/dateFormatter';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './ArchivedListView.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import SkeletonUsersLoading from '../SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../Atoms/InfoBar/InfoBar';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import socket from '../../../socket';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import useArchivedActions from '../../../hooks/useArchivedActions';

function ArchivedListView({
  activeGroupedTasks,
  setViewVariable,
  matchingTasks,
}) {
  const [page, setPage] = useState(1);
  const { dispatch } = useStudioTasksContext();

  const {
    fetchArchivedStudioTasks,
    handleUnarchiveStudioTask,
    isLoading,
    hasMore,
    archivedStudioTasks,
  } = useArchivedActions(activeGroupedTasks, setViewVariable);

  useEffect(() => {
    socket.on('unArchiveTask', (task) => {
      dispatch({ type: 'CREATE_STUDIOTASK', payload: task });
    });
  }, []);

  useEffect(() => {
    fetchArchivedStudioTasks();
  }, []);

  const loadMoreTasks = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArchivedStudioTasks(nextPage);
    }
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
        {tasksArray.length > 0 && (
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
        )}
        {isLoading && <SkeletonUsersLoading />}

        {!isLoading && hasMore && matchingTasks.length === 0 && (
          <div
            className={styles.loadMoreContainer}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              margin: '10px 0',
            }}
          >
            {isLoading && <CheckboxLoader />}

            <button
              onClick={loadMoreTasks}
              type="button"
              className={styles.loadMoreButton}
            >
              Pokaż więcej
            </button>
          </div>
        )}
      </ListContainer>
    </ViewContainer>
  );
}

export default ArchivedListView;
