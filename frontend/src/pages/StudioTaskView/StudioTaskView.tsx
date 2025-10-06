import { useEffect, useRef, useState } from 'react';
import { debounce, isEqual } from 'lodash';
import { useCombobox } from 'downshift';
import styles from './StudioTaskView.module.css';
import { getTasksByStatus, statuses, statusNames } from '../../statuses';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  // addStudioTask,
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../services/studio-tasks-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import AddStudioTaskModalContent from '../../components/Organisms/AddStudioTaskModalContent/AddStudioTaskModalContent';
import useSelectUser from '../../hooks/useSelectUser';
import useAuth from '../../hooks/useAuth';
// import generateSearchID from '../../utils/generateSearchId';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import Select from '../../components/Atoms/Select/Select';
import KanbanView from '../../components/Organisms/KanbanView/KanbanView';
import ArchivedListView from '../../components/Organisms/ArchivedListView/ArchivedListView';
import MultiselectDropdown from '../../components/Molecules/MultiselectDropdown/MultiselectDropdown';
import socket from '../../socket';
import { SearchArchivedTask } from '../../services/archived-studio-tasks-service';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import Overlay from '../../components/Atoms/Overlay/Overlay';
import FilterDropdownContainer from '../../components/Atoms/FilterDropdownContainer/FilterDropdownContainer';
import DropdownHeader from '../../components/Atoms/DropdownHeader/DropdownHeader';
import FilterCheckbox from '../../components/Molecules/FilterCheckbox/FilterCheckbox';
import FiltersClearButton from '../../components/Atoms/FiltersClearButton/FiltersClearButton';
import PlackerView from '../../components/Organisms/PlackerView/PlackerView';

const initialTaskObject: StudioTaskTypes = {
  searchID: 0,
  reckoTaskID: '',
  title: '',
  client: '',
  clientPerson: '',
  status: 'na_później',
  index: 1,
  author: {
    _id: '',
    email: '',
    img: '',
    job: '',
    lastname: '',
    name: '',
    phone: 0,
    roles: [],
  },
  taskType: '',
  participants: [],
  description: '',
  subtasks: [],
  deadline: '',
  startDate: new Date(),
  createdAt: new Date(),
};

const VIEWS = {
  ACTIVE: 'Aktywne',
  ARCHIVE: 'Archiwum',
  PLACKER: 'Placker',
};

const viewOptions = [VIEWS.ACTIVE, VIEWS.ARCHIVE, VIEWS.PLACKER];

function StudioTaskView() {
  const [viewVariable, setViewVariable] = useState('Aktywne');
  const { studioTasks, dispatch } = useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [tasksByStatus, setTasksByStatus] = useState(getTasksByStatus([]));
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [isUsersSelectOpen, setIsUsersSelectOpen] = useState(false);
  const [isCompaniesSelectOpen, setIsCompaniesSelectOpen] = useState(false);
  const [matchingTasks, setMatchingTasks] = useState([]);
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
    company: '',
    userAdd: '',
  });

  // const [loadingState, setLoadingState] = useState({
  //   isLoading: false,
  //   isFinalMessage: false,
  //   finalMessage: '',
  // });
  const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
  const [participantsToFilter, setParticipantsToFilter] = useState<string[]>(
    () => {
      const storedFilters = localStorage.getItem('participantsToFilter');
      return storedFilters ? JSON.parse(storedFilters) : [];
    }
  );
  const [companiesToFilter, setCompaniesToFilter] = useState<string[]>(() => {
    const storedCompanies = localStorage.getItem('companiesToFilter');
    return storedCompanies ? JSON.parse(storedCompanies) : [];
  });

  const { user } = useAuth();

  useEffect(() => {
    socket.on('addTask', (updatedTasks) => {
      console.log('Received task update');
      dispatch({ type: 'CREATE_STUDIOTASK', payload: updatedTasks });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'participantsToFilter',
      JSON.stringify(participantsToFilter)
    );

    localStorage.setItem(
      'companiesToFilter',
      JSON.stringify(companiesToFilter)
    );
  }, [participantsToFilter, companiesToFilter]);

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

  const {
    users,
    // formValue,
    // setFormValue,
    // handleAddMember,
    // handleDeleteMember,
  } = useSelectUser<StudioTaskTypes>({
    initialValue: initialTaskObject,
    objectKey: 'participants',
  });

  const handleViewChange = (e) => {
    setViewVariable(e.target.value);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (studioTasks.length === 0) {
        try {
          const allStudioTasks = await getAllStudioTasks();
          dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }

      if (studioTasks) {
        const newTasksByStatus = getTasksByStatus(studioTasks);
        if (!isEqual(newTasksByStatus, tasksByStatus)) {
          setTasksByStatus({ ...newTasksByStatus });
        }
      }
    };

    fetchTasks();
  }, [dispatch, studioTasks]);

  const latestInputValue = useRef('');

  const getMatchingTasks = debounce(async ({ inputValue }) => {
    if (inputValue !== latestInputValue.current) return;

    try {
      const matchedArchivedTasks = await SearchArchivedTask(inputValue);
      if (inputValue === latestInputValue.current) {
        setMatchingTasks(matchedArchivedTasks);
      }
    } catch (error) {
      console.error('Error fetching matching companies:', error.message);
    }
    if (!inputValue) setMatchingTasks([]);
  }, 200);

  const handleUserAssign = (userOnDrop) => {
    if (participantsToFilter.includes(userOnDrop._id)) {
      setParticipantsToFilter(
        participantsToFilter.filter((part) => part !== userOnDrop._id)
      );

      setIsUsersSelectOpen(true);
    } else {
      setParticipantsToFilter((prev) => {
        return [...prev, userOnDrop._id];
      });
      setIsUsersSelectOpen(true);
    }
  };

  const toogleCompany = (name: string) => {
    if (companiesToFilter.includes(name)) {
      setCompaniesToFilter((prev) => {
        return prev.filter((company) => {
          return company !== name;
        });
      });
    } else {
      setCompaniesToFilter((prev) => {
        return [...prev, name];
      });
    }

    setIsCompaniesSelectOpen(true);
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: matchingTasks,
    onInputValueChange: ({ inputValue }) => {
      latestInputValue.current = inputValue;
      getMatchingTasks({ inputValue });
    },
    onSelectedItemChange: () => {
      setViewVariable('Archiwum');
    },
    itemToString: (item) => (item ? item.name : ''),
  });

  const handleFilterDropdownInputValue = (e, key) => {
    const { value } = e.target;
    setSelectFilterValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const filteredUsersForDropdown = users.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.user.toLocaleLowerCase());
  });

  const filteredCompaniesForDropdown = companies.filter((c) => {
    return c.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.company.toLocaleLowerCase());
  });

  const viewRender = {
    [VIEWS.ACTIVE]: (
      <KanbanView
        filterArray={participantsToFilter}
        companiesFilterArray={companiesToFilter}
      />
    ),
    [VIEWS.ARCHIVE]: (
      <ArchivedListView
        activeGroupedTasks={tasksByStatus}
        setViewVariable={setViewVariable}
        matchingTasks={matchingTasks}
      />
    ),
    [VIEWS.PLACKER]: <PlackerView />,
  };

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
        <AddStudioTaskModalContent
          tasksByStatus={tasksByStatus}
          companies={companies}
          statusNames={statusNames}
          statuses={statuses}
          selectFilterValue={selectFilterValue}
          filteredUsersForDropdown={filteredUsersForDropdown}
          handleFilterDropdownInputValue={handleFilterDropdownInputValue}
        />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>

        <Select
          value={viewVariable}
          handleValueChange={handleViewChange}
          optionData={viewOptions}
        />
        <div className={styles.searchContainer}>
          <SearchInput {...getInputProps()} />
          <div
            {...getMenuProps()}
            className={
              isOpen && matchingTasks.length > 0
                ? styles.searchResultContainer
                : styles.hidden
            }
            aria-label="results"
          >
            {isOpen && viewVariable === 'Aktywne' && (
              <>
                <p className={styles.dropdownTitle}>Zarchwizowane:</p>
                {matchingTasks.map((item, index) => (
                  <div key={item._id} className={styles.searchedCompanyItem}>
                    {highlightedIndex === index ? (
                      <div
                        {...getItemProps({ item, index })}
                        className={styles.highlightedCompanyItem}
                      >
                        <div className={styles.clientInfoWrapper}>
                          <p
                            className={`${styles.clientBatch} ${[
                              `${item.client}`,
                            ]}`}
                          >
                            {item.client}
                          </p>
                          <p
                            className={`${styles.clientBatch} ${styles.clientPersonBatch}`}
                          >
                            {item.clientPerson}
                          </p>
                        </div>

                        <span className={styles.searchTitle}>{item.title}</span>
                      </div>
                    ) : (
                      <div
                        {...getItemProps({ item, index })}
                        className={styles.companyItem}
                      >
                        <div className={styles.clientInfoWrapper}>
                          <p
                            className={`${styles.clientBatch} ${[
                              `${item.client}`,
                            ]}`}
                          >
                            {item.client}
                          </p>
                          <p
                            className={`${styles.clientBatch} ${styles.clientPersonBatch}`}
                          >
                            {item.clientPerson}
                          </p>
                        </div>
                        <span className={styles.searchTitle}>{item.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
            }}
          >
            Nowe zlecenie
          </CTA>
          <CTA
            onClick={() => {
              setFilterDropdown((prev) => !prev);
            }}
          >
            Filtry
          </CTA>
        </div>
        {filterDropdown && (
          <>
            <Overlay closeFunction={setFilterDropdown} />
            <FilterDropdownContainer>
              <DropdownHeader>Filtr</DropdownHeader>
              <div className={styles.assignedToMeWrapper}>
                <input
                  type="checkbox"
                  className={styles.assignedToMeCheckbox}
                  checked={participantsToFilter.includes(user[0]._id)}
                  onChange={() => {
                    if (participantsToFilter.includes(user[0]._id)) {
                      setParticipantsToFilter(
                        participantsToFilter.filter(
                          (part) => part !== user[0]._id
                        )
                      );
                    } else {
                      setParticipantsToFilter((prev) => {
                        return [...prev, user[0]._id];
                      });
                    }
                  }}
                />
                <img src={`${user[0].img}`} alt="" className={styles.userImg} />
                <p>Przypisane do mnie</p>
              </div>
              <div className={styles.usersDropdownContainer}>
                <MultiselectDropdown
                  isSelectOpen={isUsersSelectOpen}
                  setIsSelectOpen={setIsUsersSelectOpen}
                  label="Członkowie"
                  inputKey="user"
                  inputValue={selectFilterValue.user}
                  handleInputValue={handleFilterDropdownInputValue}
                  isBigger={false}
                  isSquare={false}
                >
                  {filteredUsersForDropdown.map((userOnDrop) => {
                    return (
                      user._id !== user[0]._id && (
                        <FilterCheckbox
                          key={userOnDrop._id}
                          name={userOnDrop.name}
                          isSelected={participantsToFilter.includes(
                            userOnDrop._id
                          )}
                          toggleCompany={handleUserAssign}
                          filterVariable={userOnDrop}
                        />
                      )
                    );
                  })}
                </MultiselectDropdown>
              </div>

              <div className={styles.companiesDropdownContainer}>
                <MultiselectDropdown
                  isSelectOpen={isCompaniesSelectOpen}
                  setIsSelectOpen={setIsCompaniesSelectOpen}
                  label="Firmy"
                  inputKey="company"
                  inputValue={selectFilterValue.company}
                  handleInputValue={handleFilterDropdownInputValue}
                  isBigger={false}
                  isSquare={false}
                >
                  {filteredCompaniesForDropdown.map((company) => {
                    return (
                      <FilterCheckbox
                        key={company._id}
                        name={company.name}
                        isSelected={companiesToFilter.includes(company.name)}
                        toggleCompany={toogleCompany}
                        filterVariable={company.name}
                      />
                    );
                  })}
                </MultiselectDropdown>
              </div>

              <FiltersClearButton
                handleClear={() => {
                  setParticipantsToFilter([]);
                  setCompaniesToFilter([]);
                }}
              />
            </FilterDropdownContainer>
          </>
        )}
      </ControlBar>

      {viewRender[viewVariable]}
    </>
  );
}

export default StudioTaskView;
