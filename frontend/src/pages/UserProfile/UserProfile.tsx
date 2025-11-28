import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, User } from '../../services/users-service';
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

function UserProfile() {
  const params = useParams();
  const [user, setUser] = useState<User[]>([]);
  const currentUserId = user.length > 0 && user[0]._id;
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();

  const [isReckoTasksLoading, setIsReckoTasksLoading] = useState(false);
  const [reckoTasks, setReckoTasks] = useState([]);
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

      const response = await getMyReckoningTasks(params.id, '2025', index);
      if (response) {
        // setReckoningTasks(response);
        setReckoTasks(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReckoTasksLoading(false);
    }
  };

  useEffect(() => {
    getUserById(params.id)
      .then((singleUserArray: User | User[]) => {
        if (Array.isArray(singleUserArray)) {
          if (singleUserArray.length > 0) {
            setUser(singleUserArray);
          }
        } else {
          setUser([singleUserArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [params.id]);

  useEffect(() => {
    fetchReckoningTasks(selectedMonthIndex);
  }, [selectedMonth]);

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

  return (
    <ViewContainer>
      <ListContainer>
        <ProfileTopBar>
          <div className={styles.topBarContainer}>
            <BackButton path="użytkownicy" />
            <h2>{user.length > 0 && user[0].name}</h2>
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
          </div>
        </ProfileTopBar>
        <div className={styles.reckoTilesContainer}>
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
      </ListContainer>
    </ViewContainer>
  );
}

export default UserProfile;
