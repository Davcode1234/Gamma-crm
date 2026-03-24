import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteUser,
  getUserById,
  getUserClientsChart,
  getUserProfileSummary,
  UpdateUser,
  User,
} from '../../services/users-service';
import styles from './UserProfile.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import BackButton from '../../components/Atoms/BackButton/BackButton';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ProfileTopBar from '../../components/Atoms/ProfileTopBar/ProfileTopBar';
import { getMyReckoningTasks } from '../../services/reckoning-view-service';
import useCurrentDate from '../../hooks/useCurrentDate';
import Select from '../../components/Atoms/Select/Select';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import ReckoningTaskList from '../../components/Organisms/ReckoningTaskList/ReckoningTaskList';
import useReckoTasksContext from '../../hooks/Context/useReckoTasksContext';
import ReckoningInfoBar from '../../components/Molecules/ReckoningInfoBar/ReckoningInfoBar';
import generateDaysArray from '../../utils/generateDaysArray';
import SaveButton from '../../components/Atoms/SaveButton/SaveButton';
import DeleteButton from '../../components/Atoms/DeleteButton/DeleteButton';
import UserProfileViewComponent from '../../components/Organisms/UserProfileViewComponent/UserProfileViewComponent';
import CheckboxLoader from '../../components/Atoms/CheckboxLoader/CheckboxLoader';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import Captcha from '../../components/Molecules/Captcha/Captcha';
import useModal from '../../hooks/useModal';
import useAuth from '../../hooks/useAuth';
import hasRole from '../../utils/hasRole';

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

const viewVariableSelectValue = ['Miesięczne', 'Roczne'];

function UserProfile() {
  const params = useParams();
  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);
  const [formValue, setFormValue] = useState(initialUserObject);

  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [isReckoTasksLoading, setIsReckoTasksLoading] = useState(false);
  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const currentUserId = user.length > 0 && user[0]._id;
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { reckoTasks, dispatch } = useReckoTasksContext();
  const [chartData, setChartData] = useState([]);
  const [clientsChartData, setClientsChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [chartDataLoading, setChartDataLoading] = useState(false);
  const [chartViewVariable, setChartViewVariable] = useState('Miesięczne');
  const [dataReady, setDataReady] = useState(false);
  const navigate = useNavigate();
  const { user: loggedUser } = useAuth();
  const [viewVariable, setViewVariable] = useState(() => {
    return params.id === loggedUser[0]._id ? 'Profil' : 'Rozliczenie';
  });
  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();
  const selectedMonthIndex = months.indexOf(selectedMonth) + 1;

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

  const fetchChartData = async () => {
    try {
      setChartDataLoading(true);
      const response = await getUserProfileSummary(
        selectedMonthIndex,
        selectedYear,
        chartViewVariable === 'Roczne',
        params.id
      );

      const clientsChartResponse = await getUserClientsChart(
        selectedMonthIndex,
        selectedYear,
        chartViewVariable === 'Roczne',
        params.id
      );

      if (response.length > 0 && clientsChartResponse.length > 0) {
        const structuredForPieChat = clientsChartResponse.reduce(
          (acc, client) => {
            if (client._id === 'COTE' || client._id === 'GAMMA') {
              acc[0].value += client.Suma_godzin;
            } else {
              acc[1].value += client.Suma_godzin;
            }
            return acc;
          },
          [
            { status: 'Wewnętrzne', value: 0 },
            { status: 'Zewnętrzne', value: 0 },
          ]
        );

        setChartData(response);
        setClientsChartData(clientsChartResponse);
        setPieChartData(structuredForPieChat);
        setDataReady(true);
        return;
      }
      throw new Error('Something went wrong while fetching chart data');
    } catch (error) {
      console.error(error);
    } finally {
      setChartDataLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      setIsUserProfileLoading(true);
      const result = await getUserById(params.id);

      if (Array.isArray(result)) {
        if (result.length > 0) {
          const formUser = result[0];
          setUser(result);
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
        setUser([result]);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsUserProfileLoading(false);
    }
  };

  useEffect(() => {
    setDataReady(false);
  }, [selectedMonth, selectedYear, chartViewVariable]);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  useEffect(() => {
    setSelectedMonthDaysArray(
      generateDaysArray(selectedMonthIndex, selectedYear)
    );
    fetchChartData();

    fetchReckoningTasks(selectedMonthIndex);
  }, [selectedMonth, selectedYear, chartViewVariable]);

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

  const handleChartViewChange = (e) => {
    setChartViewVariable(e.target.value);
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
    try {
      setIsUpdateProfileLoading(true);
      const updatedUser = await UpdateUser({
        id: currentUserId,
        userData: formValue,
      });
      if (Object.keys(updatedUser).length !== 0) {
        fetchUser();
      }
    } catch (error) {
      console.error('Error updating a user', error.message);
    } finally {
      setIsUpdateProfileLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('Error deleting user', error.message);
    } finally {
      navigate('/użytkownicy');
    }
  };

  const clientsMonthSummaryByRevenue = clientsChartData.map((client) => {
    const [filteredCompany] = companies.filter(
      (com) => com.name === client._id
    );

    if (!filteredCompany) {
      console.warn(`Company not found for client ID: ${client._id}`);
      return {
        ...client,
        przychód: 0,
      };
    }

    const { hourRate } = filteredCompany;

    return {
      ...client,
      przychód: client.Suma_godzin * Number(hourRate),
    };
  });

  const filteredClientsChartData = clientsChartData.filter((client) => {
    return client.Suma_godzin > 0;
  });

  const summedHours = clientsChartData.reduce((acc, client) => {
    return Number(acc) + Number(client.Suma_godzin);
  }, 0);

  const summedRevenue = clientsMonthSummaryByRevenue.reduce((acc, client) => {
    return Number(acc) + Number(client.przychód);
  }, 0);

  const viewRender = {
    [VIEW.PROFILE]: (
      <UserProfileViewComponent
        isLoading={isUserProfileLoading}
        profileData={formValue}
        handleFormChange={handleFormChange}
        user={user}
        viewVariable={viewVariable}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        dataReady={dataReady}
        monthDaysSummary={chartData}
        chartViewVariable={chartViewVariable}
        isChartLoading={chartDataLoading}
        clientsMonthSummary={filteredClientsChartData}
        clientsMonthSummaryByRevenue={clientsMonthSummaryByRevenue}
        pieChartsData={pieChartData}
        summedHours={summedHours}
        summedRevenue={summedRevenue}
      />
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
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        <Captcha
          handleDelete={handleDeleteUser}
          closeFunction={closeModal}
          isUserProfile
          id={currentUserId}
        />
      </ModalTemplate>
      <ViewContainer>
        <ListContainer>
          <ProfileTopBar>
            <div className={styles.topBarContainer}>
              <BackButton path="użytkownicy" />
              <h2>{user.length > 0 && user[0].name}</h2>

              {viewVariable === 'Profil' && hasRole(loggedUser, ['admin']) && (
                <div className={styles.buttonsWrapper}>
                  <div className={styles.loaderWrapper}>
                    {isUpdateProfileLoading && <CheckboxLoader />}
                  </div>
                  <SaveButton
                    callbackFunc={() => {
                      handleUpdateUser();
                    }}
                  >
                    Zapisz
                  </SaveButton>
                  <DeleteButton
                    callbackFunc={() => {
                      openModal();
                    }}
                  >
                    Usuń
                  </DeleteButton>
                </div>
              )}

              <div>
                {hasRole(loggedUser, ['admin']) && (
                  <Select
                    value={viewVariable}
                    handleValueChange={handleViewChange}
                    optionData={viewOptions}
                  />
                )}

                {chartViewVariable === 'Miesięczne' && (
                  <Select
                    value={selectedMonth}
                    handleValueChange={handleMonthChange}
                    optionData={months}
                  />
                )}

                <Select
                  value={selectedYear}
                  handleValueChange={handleYearChange}
                  optionData={years}
                />

                {viewVariable === 'Profil' && (
                  <Select
                    value={chartViewVariable}
                    handleValueChange={handleChartViewChange}
                    optionData={viewVariableSelectValue}
                  />
                )}
              </div>
            </div>
          </ProfileTopBar>
          {viewRender[viewVariable]}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default UserProfile;
