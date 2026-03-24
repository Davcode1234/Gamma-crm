import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ClientsType,
  deleteClient,
  getCurrentClient,
  UpdateClient,
} from '../../services/clients-service';
import styles from './ClientProfile.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import {
  getAllCompanies,
  UpdateCompany,
} from '../../services/companies-service';
import useClientsContext from '../../hooks/Context/useClientsContext';
import ClientProfileViewComponent from '../../components/Organisms/ClientProfileViewComponent/ClientProfileViewComponent';
import useUsersContext from '../../hooks/Context/useUsersContext';
import { getAllUsers } from '../../services/users-service';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import CTA from '../../components/Atoms/CTA/CTA';
import useCurrentDate from '../../hooks/useCurrentDate';
import useNotes from '../../hooks/useNotes';
import useClientStats from '../../hooks/useClientStats';

const initialClientObject = {
  name: '',
  company: '',
  email: '',
  phone: '',
};

const initialCompanyObject = {
  name: '',
  nip: '',
  address: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
  keyWords: [],
  hourRate: '',
};

function ClientProfile() {
  const [client, setClient] = useState<ClientsType>();
  const [formValue, setFormValue] = useState(initialClientObject);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });
  const { dispatch } = useClientsContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { users, dispatch: usersDispatch } = useUsersContext();
  const params = useParams();
  const navigate = useNavigate();
  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const currentMonthIndex = months.indexOf(selectedMonth);

  const clientID = params.id;

  const {
    notes,
    setNotes,
    noteValue,
    setNoteValue,
    isMouseOverIcon,
    setIsMouseOverIcon,
    handleDeleteNote,
    handleAddNote,
  } = useNotes(clientID);

  const { chartData, tasksLength, currentCompany } = useClientStats(
    currentMonthIndex,
    selectedYear,
    selectedMonth,
    client,
    companies,
    initialCompanyObject
  );

  const fetchClient = async () => {
    let errorHappened = false;
    setLoadingState(() => ({
      isLoading: true,
      isError: false,
    }));
    const currentClient = await getCurrentClient(clientID);
    if (currentClient) {
      try {
        setClient(currentClient);
        setNotes(currentClient.notes);
        setFormValue({
          name: currentClient.name || '',
          company: currentClient.company || '',
          email: currentClient.email || '',
          phone: currentClient.phone || '',
        });

        setLoadingState(() => ({
          isLoading: false,
          isError: false,
        }));
      } catch (error) {
        errorHappened = true;
        setLoadingState((prevState) => ({
          isLoading: false,
          isError: errorHappened ? true : prevState.isError,
        }));
      }
    }
  };

  const fetchCompanies = async () => {
    if (companies.length === 0) {
      try {
        const allCompanies = await getAllCompanies();
        companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    }
  };

  const fetchUsers = async () => {
    if (users.length === 0) {
      try {
        const allUsers = await getAllUsers();
        usersDispatch({ type: 'SET_USERS', payload: allUsers });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [companiesDispatch, companies]);

  useEffect(() => {
    fetchClient();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof typeof initialClientObject
  ) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdateClient = async () => {
    const updatedClient = await UpdateClient({
      id: clientID,
      clientData: formValue,
    });
    const company = companies.find((com) => com.name === updatedClient.company);

    if (!company) {
      console.warn(`Company "${updatedClient.company}" not found.`);
      return;
    }

    const updatedClientPersons = company.clientPerson.map((person) => {
      return person.name === updatedClient.name ? formValue : person;
    });

    await UpdateCompany({
      id: company._id,
      companyData: { clientPerson: updatedClientPersons },
    });
    const allCompanies = await getAllCompanies();
    companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
    fetchClient();
  };

  const handleDeleteClient = async (id) => {
    try {
      const deletedClient = await deleteClient(id);
      dispatch({ type: 'DELETE_CLIENT', payload: deletedClient });
      navigate('/klienci');

      const company = companies.find(
        (com) => com.name === deletedClient.company
      );

      if (!company) {
        console.warn(`Company "${deletedClient.company}" not found.`);
        return;
      }

      const filteredClientPersons = company.clientPerson.filter(
        (cp) => cp.name !== deletedClient.name
      );

      await UpdateCompany({
        id: company._id,
        companyData: { clientPerson: filteredClientPersons },
      });

      const refreshedCompanies = await getAllCompanies();
      companiesDispatch({ type: 'SET_COMPANIES', payload: refreshedCompanies });
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const summedHours =
    chartData.length > 0 &&
    chartData[0]?.participants?.reduce((summ, cms) => {
      return Number(summ) + Number(cms.hours || 0);
    }, 0);

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          setNoteValue('');
        }}
        exitAnim={exitAnim}
      >
        <h2>Dodaj notatke</h2>
        <textarea
          id="note"
          name="note"
          placeholder="Wpisz swoją notatkę..."
          rows={5}
          cols={40}
          aria-label="Pole na notatkę"
          autoFocus
          required
          maxLength={1000}
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          className={styles.addNoteInput}
        />
        <CTA onClick={() => handleAddNote(noteValue)}>Dodaj</CTA>
      </ModalTemplate>
      <ViewContainer>
        <ListContainer>
          <ClientProfileViewComponent
            loadingState={loadingState}
            clientData={client}
            formValue={formValue}
            openModal={openModal}
            handleDeleteClient={handleDeleteClient}
            clientID={clientID}
            handleFormChange={handleFormChange}
            companies={companies}
            handleUpdateClient={handleUpdateClient}
            chartData={chartData}
            notes={notes}
            handleDeleteNote={handleDeleteNote}
            isMouseOverIcon={isMouseOverIcon}
            setIsMouseOverIcon={setIsMouseOverIcon}
            users={users}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
            years={years}
            months={months}
            summedHours={summedHours}
            clientHourRate={currentCompany.hourRate}
            tasksLength={tasksLength}
          />
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ClientProfile;
