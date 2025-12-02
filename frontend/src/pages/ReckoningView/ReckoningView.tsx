import { useEffect, useState } from 'react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
import CheckboxLoader from '../../components/Atoms/CheckboxLoader/CheckboxLoader';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import Select from '../../components/Atoms/Select/Select';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import useReckoTasksContext from '../../hooks/Context/useReckoTasksContext';
import useAuth from '../../hooks/useAuth';
import useCurrentDate from '../../hooks/useCurrentDate';
import {
  addReckoningTaskFromKanban,
  getMyReckoningTasks,
} from '../../services/reckoning-view-service';
import styles from './ReckoningView.module.css';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  getStudioTask,
  UpdateStudioTask,
} from '../../services/studio-tasks-service';
import CompanyBatch from '../../components/Atoms/CompanyBatch/CompanyBatch';
import UsersDisplay from '../../components/Organisms/UsersDisplay/UsersDisplay';
import socket from '../../socket';
import generateDaysArray from '../../utils/generateDaysArray';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import ReckoningTaskList from '../../components/Organisms/ReckoningTaskList/ReckoningTaskList';
import useReckoningActions from '../../hooks/useReckoningActions';
import ReckoningInfoBar from '../../components/Molecules/ReckoningInfoBar/ReckoningInfoBar';

function ReckoningView() {
  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [addTaskFromKanbanState, setAddTaskFromKanbanState] = useState({
    errorMessage: '',
    successMessage: '',
    isAlreadyExist: false,
  });
  const [taskLoadingState, setTaskLoadingState] = useState({
    isGetMyTasksLoading: false,
    isAddEmptyLoading: false,
  });

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  // const [reckoningTasks, setReckoningTasks] = useState([]);
  const { reckoTasks, dispatch } = useReckoTasksContext();
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { studioTasks, dispatch: studioTasksDispatch } =
    useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { user } = useAuth();
  const currentUserId = user[0]._id;
  const monthIndex = new Date().getMonth();
  const selectedMonthIndex = months.indexOf(selectedMonth) + 1;
  const { createEmptyTask, isAddingTask } = useReckoningActions(user);

  const handleLoadingStateChange = (key, value) => {
    setTaskLoadingState((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const fetchReckoningTasks = async (index) => {
    try {
      handleLoadingStateChange('isGetMyTasksLoading', true);

      // DODANE +1 PO ZMIANIE REQUESTOW NA LOCALHOST NIE WIEM DLACZEGO, PEWNIE TRZEBA ZMIENIC TAK JAK BYLO NA MAINE I FETCHOW Z API

      const response = await getMyReckoningTasks(
        currentUserId,
        selectedYear,
        index + 1
      );
      if (response) {
        // setReckoningTasks(response);
        dispatch({ type: 'SET_RECKOTASKS', payload: response });
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleLoadingStateChange('isGetMyTasksLoading', false);
    }
  };

  const fetchTasksFromKanban = async () => {
    if (studioTasks.length === 0) {
      try {
        const allStudioTasks = await getAllStudioTasks();
        studioTasksDispatch({
          type: 'SET_STUDIOTASKS',
          payload: allStudioTasks,
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  };

  const matchedTasksFromSearchInput = searchInputValue
    ? reckoTasks.filter((cts) => {
        return (
          cts.title.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          cts.client.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          cts.description
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          cts.comment.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          cts.clientPerson
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          cts.searchID.toString().includes(searchInputValue) ||
          cts.participants.some((member) =>
            member.name.toLowerCase().includes(searchInputValue.toLowerCase())
          )
        );
      })
    : reckoTasks;

  useEffect(() => {
    const fetchCompanies = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchCompanies();
  }, [companiesDispatch, companies]);

  useEffect(() => {
    fetchReckoningTasks(monthIndex);
    fetchTasksFromKanban();
  }, []);

  useEffect(() => {
    setSelectedMonthDaysArray(generateDaysArray(selectedMonthIndex, 2025));

    const alreadyHasDataForMonth = reckoTasks.some(
      (task) => task.month === selectedMonthIndex
    );

    if (!alreadyHasDataForMonth) {
      fetchReckoningTasks(selectedMonthIndex - 1);
    }
  }, [selectedMonth, selectedYear]);

  const totalHours = matchedTasksFromSearchInput
    .flatMap(
      (task) =>
        task.participants?.flatMap(
          (p) =>
            (p._id === currentUserId &&
              p.months?.flatMap((m) => {
                const monthIndexToSumm =
                  new Date(m.createdAt).getUTCMonth() + 1;
                return monthIndexToSumm === selectedMonthIndex
                  ? m.hours || []
                  : [];
              })) ||
            []
        ) || []
    )
    .reduce((sum, hourObj) => sum + hourObj.hourNum, 0);

  const handleAddFromKanban = async ({
    _id,
    searchID,
    client,
    clientPerson,
    title,
    description,
    participants,
    createdAt,
  }) => {
    try {
      handleLoadingStateChange('isAddEmptyLoading', true);

      // const startDate = new Date(selectedYear, selectedMonthIndex, 1);

      const addResponse = await addReckoningTaskFromKanban({
        searchID,
        idOfAssignedStudioTask: _id,
        client,
        clientPerson,
        title,
        description,
        comment: '',
        author: user[0],
        printWhat: '',
        printWhere: '',
        participants: participants.map((part) => {
          return {
            _id: part._id,
            isVisible: currentUserId === part._id,
            name: part.name,
            img: part.img,
            months: [
              {
                createdAt: new Date(selectedYear, selectedMonthIndex, 1),
                hours: generateDaysArray(selectedMonthIndex, 2025),
                addedToRecko: new Date(),
              },
            ],
          };
        }),
        startDate: new Date(createdAt ?? Date.now()),
        month: selectedMonthIndex,
        // deadline: '',
      });

      if (addResponse.alreadyExist) {
        setAddTaskFromKanbanState((prev) => {
          return {
            ...prev,
            isAlreadyExist: true,
          };
        });
      }

      const updatedTask = await UpdateStudioTask({
        id: _id,
        studioTaskData: { reckoTaskID: addResponse._id },
      });

      const res = await getStudioTask(updatedTask._id);
      studioTasksDispatch({
        type: 'UPDATE_STUDIOTASK',
        payload: res,
      });
      socket.emit('tasksUpdated', res);

      const response = await getMyReckoningTasks(
        currentUserId,
        '2025',
        selectedMonthIndex
      );
      if (response) {
        // setReckoningTasks(response);
        dispatch({ type: 'SET_RECKOTASKS', payload: response });
      }
    } catch (error) {
      console.error(error);
      setAddTaskFromKanbanState((prev) => {
        return {
          ...prev,
          errorMessage: 'Coś poszło nie tak :(',
        };
      });
    } finally {
      handleLoadingStateChange('isAddEmptyLoading', false);

      setAddTaskFromKanbanState((prev) => {
        return {
          ...prev,
          successMessage: 'Zlecenie utworzone!',
        };
      });
    }
  };

  const studioTasksAssignedTome = studioTasks.filter((task) => {
    return task.participants.some((participant) => {
      return participant._id === currentUserId;
    });
  });

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          // handleLoadingStateChange('isFinalMessage', false);
          // setFormValue(initialTaskObject);
        }}
        exitAnim={exitAnim}
      >
        <h3>Aktywne zlecenia</h3>

        <div className={styles.tasksWrapper}>
          {studioTasksAssignedTome.map((studioTask) => {
            const companyClass = studioTask.client.split(' ').join(' ');
            return (
              <div
                className={styles.studioTaskContainer}
                key={studioTask._id}
                onMouseEnter={() => {
                  setHoveredCardId(studioTask._id);
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  setAddTaskFromKanbanState((prev) => {
                    return {
                      ...prev,
                      successMessage: '',
                      isAlreadyExist: false,
                      errorMessage: '',
                    };
                  });
                }}
              >
                <div
                  className={`${styles.contentWrapper} ${
                    hoveredCardId === studioTask._id
                      ? styles.fadeOut
                      : styles.fadeIn
                  }`}
                >
                  <div className={styles.batchWrapper}>
                    <CompanyBatch
                      companyClass={companyClass}
                      isClientPerson={false}
                      isBigger={false}
                    >
                      {studioTask.client}
                    </CompanyBatch>
                    <CompanyBatch
                      companyClass={null}
                      isClientPerson
                      isBigger={false}
                    >
                      {studioTask.clientPerson}
                    </CompanyBatch>
                  </div>
                  <p className={styles.searchIDel}>#{studioTask.searchID}</p>
                  <p className={styles.studioTaskTitle}>{studioTask.title}</p>
                  <div className={styles.userDisplayWrapper}>
                    <UsersDisplay
                      data={studioTask}
                      usersArray={studioTask.participants}
                      isSmall={false}
                    />
                  </div>
                </div>
                <div
                  className={`${styles.ctaContainer} ${
                    hoveredCardId === studioTask._id
                      ? styles.fadeIn
                      : styles.fadeOut
                  }`}
                >
                  <CTA
                    onClick={() => {
                      handleAddFromKanban(
                        studioTask as {
                          _id: string;
                          searchID: number;
                          client: string;
                          clientPerson: string;
                          title: string;
                          description: string;
                          participants: any[];
                          createdAt: Date;
                        }
                      );
                    }}
                  >
                    Dodaj
                  </CTA>
                  <div className={styles.loaderWrapper}>
                    {isAddingTask && <CheckboxLoader />}
                  </div>
                  {addTaskFromKanbanState.successMessage.length > 0 && (
                    <p className={styles.successMessage}>
                      {!addTaskFromKanbanState.isAlreadyExist &&
                        addTaskFromKanbanState.successMessage}
                      {addTaskFromKanbanState.isAlreadyExist && 'Już istnieje'}
                    </p>
                  )}

                  {addTaskFromKanbanState.errorMessage.length > 0 && (
                    <p className={styles.errorMessage}>
                      {addTaskFromKanbanState.errorMessage}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Rozliczenie</ControlBarTitle>
        <Select
          value={selectedMonth}
          handleValueChange={handleMonthChange}
          optionData={months}
        />

        <Select
          value={selectedYear}
          handleValueChange={handleYearChange}
          optionData={years}
        />
        <SearchInput
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
        />
        <div className={styles.totalHoursContainer}>
          <p>{totalHours}</p>
        </div>
        <div className={styles.ctaWrapper}>
          <CTA type="button" onClick={openModal}>
            Dodaj ze zleceń
          </CTA>
        </div>
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          <div className={styles.reckoningContainer}>
            <ReckoningInfoBar selectedMonthDaysArray={selectedMonthDaysArray} />

            <ReckoningTaskList
              tasks={matchedTasksFromSearchInput}
              user={user}
              isLoading={taskLoadingState.isGetMyTasksLoading}
              currentUserId={currentUserId}
              selectedMonthIndex={selectedMonthIndex}
              selectedYear={selectedYear}
              companies={companies}
            />
            {reckoTasks.length > 0 && !taskLoadingState.isGetMyTasksLoading && (
              <div className={styles.addNewReckoTaskWrapper}>
                <button
                  type="button"
                  className={styles.addNewReckoTaskButton}
                  onClick={() =>
                    createEmptyTask(selectedMonthIndex, selectedYear)
                  }
                >
                  Dodaj wiersz..
                </button>

                {isAddingTask && <CheckboxLoader />}
              </div>
            )}
          </div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ReckoningView;
