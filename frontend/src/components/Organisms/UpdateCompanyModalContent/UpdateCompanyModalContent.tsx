import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getAllCompanies,
  UpdateCompany,
} from '../../../services/companies-service';
import styles from './UpdateCompanyModalContent.module.css';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';
import useUsersContext from '../../../hooks/Context/useUsersContext';
import { getAllUsers } from '../../../services/users-service';
import {
  addManyClients,
  deleteManyClients,
} from '../../../services/clients-service';
import ClientSelect from '../../Molecules/ClientSelect/ClientSelect';
import DeleteButton from '../../Atoms/DeleteButton/DeleteButton';
import SaveButton from '../../Atoms/SaveButton/SaveButton';
import AddNewClientTopBar from '../../Atoms/AddNewClientTopBar/AddNewClientTopBar';
import AddNewClientButton from '../../Atoms/AddNewClientButton/AddNewClientButton';
import ClientTile from '../../Atoms/ClientTile/ClientTile';
import NoClientsTitle from '../../Atoms/NoClientsTitle/NoClientsTitle';
import ClientTilesWrapper from '../../Atoms/ClientTilesWrapper/ClientTilesWrapper';
import Input from '../../Atoms/Input/Input';
import useClientsData from '../../../hooks/useClientsData';

const initialCompanyObject = {
  name: '',
  nip: '',
  address: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
  hourRate: '',
  keyWords: [],
};

function UpdateCompanyModalContent({
  currentCompany,
  closeModal,
  openCaptcha,
  refreshCompanyData,
}) {
  const params = useParams();
  const { users, dispatch } = useUsersContext();
  const { dispatch: CompaniesDispatch } = useCompaniesContext();
  const [formValue, setFormValue] = useState(initialCompanyObject);
  const [isHourRateInputActive, setIsHourRateInputActive] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [keyWordInputValue, setKeyWordInputValue] = useState('');
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
    client: '',
  });

  const {
    clients,
    setClients,
    clientIdsToDelete,
    setClientIdsToDelete,
    clientsToAdd,
    setClientsToAdd,
    newClient,
    setNewClient,
    isAddNewClientError,
    setIsAddNewClientError,
    handleAddNewClientFormChange,
    isAddNewClientView,
    setIsAddNewClientView,
  } = useClientsData(currentCompany);

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        try {
          const allUsers = await getAllUsers();
          dispatch({ type: 'SET_USERS', payload: allUsers });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [dispatch, users]);

  useEffect(() => {
    setFormValue({
      name: currentCompany.name || '',
      nip: currentCompany.nip || '',
      address: currentCompany.address || '',
      teamMembers: currentCompany.teamMembers || [],
      clientPerson: currentCompany.clientPerson || [],
      hourRate: currentCompany.hourRate || '',
      website: currentCompany.website || '',
      keyWords: currentCompany.keyWords || [],
    });
  }, [currentCompany]);

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const hourRateLabelStyle = () => {
    if (formValue.hourRate.length <= 2) {
      return styles.two;
    }
    if (formValue.hourRate.length === 3) {
      return styles.three;
    }

    if (formValue.hourRate.length > 3) {
      return styles.four;
    }

    return styles.one;
  };

  const handleFilterDropdownInputValue = (e, key) => {
    const { value } = e.target;
    setSelectFilterValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleUserAssign = (user) => {
    if (
      formValue.teamMembers.some((userToCheck) => userToCheck._id === user._id)
    ) {
      // setTeamMembers(teamMembers.filter((part) => part._id !== user._id));
      setFormValue((prev) => {
        return {
          ...prev,
          teamMembers: formValue.teamMembers.filter(
            (part) => part._id !== user._id
          ),
        };
      });

      setIsSelectOpen(true);
    } else {
      setFormValue((prev) => {
        return {
          ...prev,
          teamMembers: [...prev.teamMembers, user],
        };
      });
      setIsSelectOpen(true);
    }
  };

  const filteredUsersForDropdown = users.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.user.toLocaleLowerCase());
  });

  const handlhandleAddNewClientSubmit = (nc) => {
    if (nc.name) {
      setClients((prev) => {
        return [...prev, { ...nc, company: formValue.name }];
      });
      setFormValue((prev) => {
        return {
          ...prev,
          clientPerson: [
            ...formValue.clientPerson,
            { ...nc, company: formValue.name },
          ],
        };
      });
      setClientsToAdd((prev) => {
        return [...prev, { ...nc, company: formValue.name }];
      });
      setNewClient({
        name: '',
        company: '',
        email: '',
        phone: '',
      });
      setIsAddNewClientView(false);
      setIsAddNewClientError(false);
      return;
    }
    setIsAddNewClientError(true);
  };

  const handleDeleteClient = (id, name) => {
    const filteredClients = clients.filter((cl) => {
      return cl._id ? cl._id !== id : cl.name !== name;
    });
    setClients(filteredClients);

    setFormValue((prev) => {
      return {
        ...prev,
        clientPerson: filteredClients,
      };
    });

    setClientIdsToDelete((prev) => {
      return [...prev, id];
    });
  };

  const handleUpdateCompany = async () => {
    const response = await UpdateCompany({
      id: params.id,
      companyData: formValue,
    });

    if (clientIdsToDelete.length > 0) {
      await deleteManyClients(clientIdsToDelete);
    }

    if (clientsToAdd.length > 0) {
      await addManyClients(clientsToAdd);
    }

    if (response !== null) {
      closeModal();
      refreshCompanyData();
      const companies = await getAllCompanies();
      CompaniesDispatch({ type: 'SET_COMPANIES', payload: companies });
    }
  };

  return (
    <div>
      <div>
        <h2 className={styles.editCompanyModalTitle}>Edytuj</h2>
        <div className={styles.modalWrapper}>
          <div className={styles.inputsWrapper}>
            {/* {!isAddNewClientView && (
              <h2 className={styles.editCompanyModalTitle}>Edytuj</h2>
            )} */}

            <div className={styles.nameInput}>
              <label htmlFor="companyName">
                <strong>Nazwa:</strong>
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                maxLength={20}
                value={formValue.name}
                onChange={(e) => {
                  handleFormChange(e, 'name');
                }}
                className={styles.companyInput}
              />
            </div>
            <div className={styles.selectsRow}>
              <div className={styles.selectsRowLeft}>
                <label htmlFor="graphics">
                  <strong>Graficy:</strong>
                </label>
                <MultiselectDropdown
                  isSelectOpen={isSelectOpen}
                  setIsSelectOpen={setIsSelectOpen}
                  label="Graficy"
                  inputKey="user"
                  inputValue={selectFilterValue.user}
                  handleInputValue={handleFilterDropdownInputValue}
                  isBigger={false}
                  isSquare
                >
                  {filteredUsersForDropdown.map((u) => {
                    return (
                      <FilterCheckbox
                        key={u._id}
                        name={u.name}
                        isSelected={formValue.teamMembers.some(
                          (tm) => tm._id === u._id
                        )}
                        toggleCompany={handleUserAssign}
                        filterVariable={u}
                      />
                    );
                  })}
                </MultiselectDropdown>
              </div>

              <div className={styles.selectsRowRight}>
                <label
                  htmlFor="companyNumber"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsAddNewClientView(true);
                    }
                  }}
                  className={styles.clientsLabel}
                >
                  <strong>Strona:</strong>
                </label>
                <input
                  type="text"
                  name="companyNIP"
                  id="companyNIP"
                  maxLength={15}
                  value={formValue.website}
                  onChange={(e) => {
                    handleFormChange(e, 'website');
                  }}
                  className={styles.companyInput}
                />
              </div>
            </div>
            <div className={styles.nameInput}>
              <label htmlFor="companyMail">
                <strong>Adres:</strong>
              </label>
              <input
                type="text"
                name="companyAddress"
                id="companyAddress"
                maxLength={40}
                value={formValue.address}
                onChange={(e) => {
                  handleFormChange(e, 'address');
                }}
                className={styles.companyInput}
              />
            </div>
            <div className={styles.firstRow}>
              <div>
                <label htmlFor="companyNIP">
                  <strong>NIP:</strong>
                </label>
                <input
                  type="text"
                  name="companyNIP"
                  id="companyNIP"
                  maxLength={15}
                  value={formValue.nip}
                  onChange={(e) => {
                    handleFormChange(e, 'nip');
                  }}
                  className={styles.companyInput}
                />
              </div>

              <div className={styles.hourRateContainer}>
                <label htmlFor="hourRate">
                  <strong>Stawka:</strong>
                </label>

                <span className={styles.hourRateInputWrapper}>
                  <input
                    type="text"
                    name="hourRate"
                    id="hourRate"
                    maxLength={4}
                    value={formValue.hourRate}
                    onClick={() => setIsHourRateInputActive(true)}
                    onBlur={() => setIsHourRateInputActive(false)}
                    onChange={(e) => {
                      handleFormChange(e, 'hourRate');
                      setIsHourRateInputActive(true);
                    }}
                    className={styles.hourRateInput}
                  />
                  {!isHourRateInputActive && (
                    <span
                      className={`${styles.rateLabel} ${hourRateLabelStyle()}`}
                    >
                      zł
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className={styles.nameInput}>
              <label htmlFor="companyNIP">
                <strong>Słowa kluczowe:</strong>
              </label>
              <ClientSelect
                value={formValue.keyWords}
                setValue={setFormValue}
                inputValue={keyWordInputValue}
                setInputValue={setKeyWordInputValue}
              />
            </div>
          </div>
          <div className={styles.clientsContainer}>
            {isAddNewClientView ? (
              <>
                <AddNewClientTopBar
                  callbackFn={() => {
                    setIsAddNewClientView(false);
                    // setIsAddNewClientError(false);
                  }}
                />

                <div className={styles.clientInputsWrapper}>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder={`${
                      isAddNewClientError
                        ? 'Imie i nazwisko wymagane!'
                        : 'Imie i nazwisko'
                    }`}
                    className={`${
                      isAddNewClientError ? styles.errorBorder : styles.input
                    }`}
                    onChange={(e) => handleAddNewClientFormChange(e, 'name')}
                    onBlur={() => {}}
                    value={newClient.name}
                    maxLength={30}
                  />
                  <Input
                    id="mail"
                    type="text"
                    name="mail"
                    placeholder="Email"
                    className={styles.input}
                    onChange={(e) => handleAddNewClientFormChange(e, 'email')}
                    onBlur={() => {}}
                    value={newClient.email}
                    maxLength={40}
                  />
                  <Input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="Telefon"
                    className={styles.input}
                    onChange={(e) => handleAddNewClientFormChange(e, 'phone')}
                    onBlur={() => {}}
                    value={newClient.phone}
                    maxLength={15}
                  />
                </div>
                <button
                  type="button"
                  className={styles.addNewClientButton}
                  onClick={() => handlhandleAddNewClientSubmit(newClient)}
                >
                  Dodaj
                </button>
              </>
            ) : (
              <>
                <p className={styles.clientSecTitle}>Klienci</p>
                <ClientTilesWrapper>
                  {clients.length > 0 ? (
                    clients.map((cl) => {
                      return (
                        <Link key={cl.name} to={`/klienci/${cl._id}`}>
                          <ClientTile
                            deleteCallback={() =>
                              handleDeleteClient(cl._id, cl.name)
                            }
                          >
                            {cl.name}
                          </ClientTile>
                        </Link>
                      );
                    })
                  ) : (
                    <NoClientsTitle />
                  )}
                </ClientTilesWrapper>
                <br />
                <AddNewClientButton
                  callbackFn={() => setIsAddNewClientView(true)}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.optionButtonsWrapper}>
          <DeleteButton callbackFunc={() => openCaptcha(true)}>
            Usuń firmę
          </DeleteButton>

          <SaveButton callbackFunc={() => handleUpdateCompany()}>
            Zapisz
          </SaveButton>
        </div>
      </div>
    </div>
  );
}

export default UpdateCompanyModalContent;
