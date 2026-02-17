import { useEffect } from 'react';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import styles from './TasksView.module.css';
import useAddNewTask from '../../hooks/useAddNewTask';
import { getAllTasks } from '../../services/tasks-service';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import useTasksContext from '../../hooks/Context/useTasksContext';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import AddTaskModalContent from '../../components/Organisms/AddTaskModalContent/AddTaskModalContent';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import useAuth from '../../hooks/useAuth';
import CTA from '../../components/Atoms/CTA/CTA';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';

function TasksView() {
  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const {
    title,
    client,
    path,
    description,
    deadline,
    imgLabel,
    imgSrc,
    isLoading,
    finalMessage,
    showFinalMessage,
    handleIconClick,
    imgIconRef,
    handleFileChange,
    handleTitleChange,
    handleClientChange,
    handlePathChange,
    handleDescriptionChange,
    handlePriorityChange,
    handleStatusChange,
    handleDeadlineChange,
    createTaskHandler,
    clearValues,
  } = useAddNewTask();

  // const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // @ts-ignore
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuth();

  const filteredTaskByMe = tasks.filter((filteredTasks) => {
    return filteredTasks.author === user[0]._id;
  });

  useEffect(() => {
    getAllTasks().then((allTasks) => {
      dispatch({ type: 'SET_TASKS', payload: allTasks });
    });
  }, [exitAnim, dispatch]);

  const sortedTasks = tasks.sort((a, b) => {
    return Number(b.priority) - Number(a.priority);
  });

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <AddTaskModalContent
          isLoading={isLoading}
          showFinalMessage={showFinalMessage}
          finalMessage={finalMessage}
          createTaskHandler={createTaskHandler}
          imgIconRef={imgIconRef}
          title={title}
          imgSrc={imgSrc}
          handleFileChange={handleFileChange}
          handleIconClick={handleIconClick}
          imgLabel={imgLabel}
          handleTitleChange={handleTitleChange}
          client={client}
          handleClientChange={handleClientChange}
          description={description}
          handleDescriptionChange={handleDescriptionChange}
          path={path}
          handlePathChange={handlePathChange}
          handlePriorityChange={handlePriorityChange}
          handleStatusChange={handleStatusChange}
          handleDeadlineChange={handleDeadlineChange}
          deadline={deadline}
        />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>
        <select name="widok" id="widok" className={styles.selectInput}>
          <option value="Lista">Lista</option>
          <option value="Kanban">Kanban</option>
        </select>
        <SearchInput />
        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
              clearValues();
              // setIsCalendarVisible(false);
            }}
          >
            Nowe zlecenie
          </CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Utworzono</p>
            </div>
            <div className={styles.taskAuthorCreatorWrapper}>
              <p className={styles.InfoBarElement}>Autor</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Klient</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Tytuł</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Opis</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Ścieżka</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Status</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Priorytet</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Deadline</p>
            </div>
          </InfoBar>

          {sortedTasks.length > 0 ? (
            sortedTasks.map((task, index) => {
              return (
                <TileWrapper
                  key={task._id}
                  linkPath={`/zlecenia/${task._id}`}
                  index={index}
                >
                  <div className={styles.tileContentWrapper}>
                    <p>{task.date.split('T')[0]}</p>
                  </div>
                  <div className={styles.taskAuthorCreatorWrapper}>
                    <img
                      src={task.authorAvatar}
                      alt="user"
                      className={styles.userImg}
                    />
                    <p>{task.authorName}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.client}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.title}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.description}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.path}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.status}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.priority}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.deadline.split('T')[0]}</p>
                  </div>
                </TileWrapper>
              );
            })
          ) : (
            <SkeletonUsersLoading />
          )}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default TasksView;
