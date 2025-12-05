import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, UpdateUser, User } from '../../services/users-service';
import styles from './UserProfile.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import BackButton from '../../components/Atoms/BackButton/BackButton';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ProfileTopBar from '../../components/Atoms/ProfileTopBar/ProfileTopBar';
import MultiselectDropdown from '../../components/Molecules/MultiselectDropdown/MultiselectDropdown';
import useMultiSelect from '../../hooks/useMultiSelect';
import FilterCheckbox from '../../components/Molecules/FilterCheckbox/FilterCheckbox';
import { getMyReckoningTasks } from '../../services/reckoning-view-service';
import useCurrentDate from '../../hooks/useCurrentDate';
import Select from '../../components/Atoms/Select/Select';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import ReckoningTaskList from '../../components/Organisms/ReckoningTaskList/ReckoningTaskList';
import useReckoTasksContext from '../../hooks/Context/useReckoTasksContext';
import ReckoningInfoBar from '../../components/Molecules/ReckoningInfoBar/ReckoningInfoBar';
import generateDaysArray from '../../utils/generateDaysArray';
import hasRole from '../../utils/hasRole';
import useAuth from '../../hooks/useAuth';
import SaveButton from '../../components/Atoms/SaveButton/SaveButton';
import DeleteButton from '../../components/Atoms/DeleteButton/DeleteButton';

const VIEW = {
  PROFILE: 'Profil',
  RECKO: 'Rozliczenie',
};

const viewOptions = [VIEW.PROFILE, VIEW.RECKO];

const initialUserObject = {
  name: '',
  lastname: '',
  email: '',
  phone: 0,
  job: '',
  roles: [],
};

function UserProfile() {
  const params = useParams();
  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);
  const [formValue, setFormValue] = useState(initialUserObject);
  const [viewVariable, setViewVariable] = useState('Profil');
  const [isReckoTasksLoading, setIsReckoTasksLoading] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const currentUserId = user.length > 0 && user[0]._id;
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { user: loggedUser } = useAuth();
  const { reckoTasks, dispatch } = useReckoTasksContext();

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();
  const selectedMonthIndex = months.indexOf(selectedMonth) + 1;

  const {
    isSelectOpen,
    setIsSelectOpen,
    selectFilterValue,
    handleFilterDropdownInputValue,
    assignedRoles,
    filteredRolesForDropdown,
    handleRoleAssign,
  } = useMultiSelect(user);

  const fetchReckoningTasks = async (index) => {
    try {
      setIsReckoTasksLoading(true);

      // DODANE +1 PO ZMIANIE REQUESTOW NA LOCALHOST NIE WIEM DLACZEGO, PEWNIE TRZEBA ZMIENIC TAK JAK BYLO NA MAINE I FETCHOW Z API

      const response = await getMyReckoningTasks(
        params.id,
        selectedYear,
        index
      );
      if (response) {
        // setReckoningTasks(response);
        dispatch({ type: 'SET_RECKOTASKS', payload: response });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReckoTasksLoading(false);
    }
  };

  const fetchUser = () => {
    getUserById(params.id)
      .then((singleUserArray: User | User[]) => {
        if (Array.isArray(singleUserArray)) {
          if (singleUserArray.length > 0) {
            const formUser = singleUserArray[0];
            setUser(singleUserArray);
            console.log(singleUserArray[0]);
            setFormValue({
              name: formUser.name,
              lastname: formUser.lastname,
              email: formUser.email,
              phone: formUser.phone,
              job: formUser.job,
              roles: formUser.roles,
            });
          }
        } else {
          setUser([singleUserArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  useEffect(() => {
    setSelectedMonthDaysArray(generateDaysArray(selectedMonthIndex, 2025));

    fetchReckoningTasks(selectedMonthIndex);
  }, [selectedMonth, selectedYear]);

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

  const handleViewChange = (e) => {
    setViewVariable(e.target.value);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof typeof initialUserObject
  ) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdateUser = async () => {
    const updatedUser = await UpdateUser({
      id: currentUserId,
      userData: formValue,
    });
    fetchUser();
    console.log(updatedUser);
  };

  const viewRender = {
    [VIEW.PROFILE]: (
      <div className={styles.columnsWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.infoInputsWrapper}>
            <div className={styles.inputWrapper}>
              <label htmlFor="userName">Imie </label>
              <input
                type="text"
                name="userName"
                id="userName"
                maxLength={30}
                value={formValue.name}
                onChange={(e) => {
                  handleFormChange(e, 'name');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userLastname">Nazwisko</label>
              <input
                type="text"
                name="userLastname"
                id="userLastname"
                maxLength={40}
                value={formValue.lastname}
                onChange={(e) => {
                  handleFormChange(e, 'lastname');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userEmail">Email</label>
              <input
                type="text"
                name="userEmail"
                id="userEmail"
                maxLength={100}
                value={formValue.email}
                onChange={(e) => {
                  handleFormChange(e, 'email');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userPhone">Numer</label>
              <input
                type="text"
                name="userPhone"
                id="userPhone"
                maxLength={15}
                value={formValue.phone}
                onChange={(e) => {
                  handleFormChange(e, 'phone');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userJob">Stanowisko</label>
              <input
                type="text"
                name="userJob"
                id="userJob"
                maxLength={20}
                value={formValue.job}
                onChange={(e) => {
                  handleFormChange(e, 'job');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              {user.length > 0 &&
                hasRole(loggedUser, ['admin']) &&
                viewVariable === 'Profil' && (
                  <div className={styles.multiSelectWrapper}>
                    <MultiselectDropdown
                      isSelectOpen={isSelectOpen}
                      setIsSelectOpen={setIsSelectOpen}
                      label="Rola"
                      inputKey="role"
                      inputValue={selectFilterValue}
                      handleInputValue={handleFilterDropdownInputValue}
                      isBigger={false}
                      isSquare={false}
                    >
                      {filteredRolesForDropdown.map((role) => {
                        return (
                          <FilterCheckbox
                            key={role}
                            name={role}
                            isSelected={assignedRoles.includes(role)}
                            toggleCompany={handleRoleAssign}
                            filterVariable={role}
                          />
                        );
                      })}
                    </MultiselectDropdown>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <p>trg</p>
        </div>
      </div>
    ),
    [VIEW.RECKO]: (
      <div className={styles.reckoTilesContainer}>
        <ReckoningInfoBar selectedMonthDaysArray={selectedMonthDaysArray} />

        <ReckoningTaskList
          tasks={reckoTasks}
          isLoading={isReckoTasksLoading}
          currentUserId={currentUserId}
          selectedMonthIndex={selectedMonthIndex}
          selectedYear={selectedYear}
          companies={companies}
          user={user}
        />
      </div>
    ),
  };

  return (
    <ViewContainer>
      <ListContainer>
        <ProfileTopBar>
          <div className={styles.topBarContainer}>
            <BackButton path="użytkownicy" />
            <h2>{user.length > 0 && user[0].name}</h2>

            {viewVariable === 'Profil' && (
              <div className={styles.buttonsWrapper}>
                <SaveButton
                  callbackFunc={() => {
                    handleUpdateUser();
                  }}
                >
                  Zapisz
                </SaveButton>
                <DeleteButton callbackFunc={() => {}}>Usuń</DeleteButton>
              </div>
            )}

            <Select
              value={viewVariable}
              handleValueChange={handleViewChange}
              optionData={viewOptions}
            />

            {viewVariable === 'Rozliczenie' && (
              <>
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
              </>
            )}
          </div>
        </ProfileTopBar>
        {viewRender[viewVariable]}
      </ListContainer>
    </ViewContainer>
  );
}

export default UserProfile;
