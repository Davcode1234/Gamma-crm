import { useEffect, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {
  getAllCompanies,
  SearchCompany,
} from '../../services/companies-service';
import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import CTA from '../../components/Atoms/CTA/CTA';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import useSelectUser from '../../hooks/useSelectUser';
import AddCompanyForm from '../../components/Organisms/AddCompanyForm/AddCompanyForm';
import CompanyTile from '../../components/Organisms/CompanyTile/CompanyTile';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import Select from '../../components/Atoms/Select/Select';
import useAuth from '../../hooks/useAuth';
import hasRole from '../../utils/hasRole';

const initialCompanyObject = {
  name: '',
  nip: '',
  address: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
};

function CompaniesView() {
  const [clientState, setClientState] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [matchingCompanies, setMatchingCompanies] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { companies, dispatch } = useCompaniesContext();
  const { setFormValue } = useSelectUser({
    initialValue: initialCompanyObject,
    objectKey: 'teamMembers',
  });
  const latestInputValue = useRef('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const getMatchingCompanies = debounce(async ({ inputValue }) => {
    if (inputValue !== latestInputValue.current) return;

    try {
      const matchedCompanies = await SearchCompany(inputValue);
      if (inputValue === latestInputValue.current) {
        setMatchingCompanies(matchedCompanies);
      }
    } catch (error) {
      console.error('Error fetching matching companies:', error.message);
    }
    if (!inputValue) setMatchingCompanies([]);
  }, 200);

  const clientStateSelectValues = ['Aktywni', 'Potencjalni', 'Archiwum'];

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: matchingCompanies,
    onInputValueChange: ({ inputValue }) => {
      latestInputValue.current = inputValue;
      getMatchingCompanies({ inputValue });
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        navigate(`/firmy/${selectedItem._id}`);
      }
    },
    itemToString: (item) => (item ? item.name : ''),
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const allCompanies = await getAllCompanies();
        dispatch({ type: 'SET_COMPANIES', payload: allCompanies });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [dispatch, successMessage]);

  const clearValues = () => {
    setSuccessMessage('');
    setFormValue((prevState) => ({
      ...prevState,
      teamMembers: [],
    }));
  };

  const handleClientStateChange = (e) => {
    e.preventDefault();
    setClientState(e.target.value);
  };

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          clearValues();
        }}
        exitAnim={exitAnim}
      >
        <h2>Dodaj firme</h2>
        <AddCompanyForm
          companies={companies}
          successMessage={successMessage}
          handleSuccesMessage={setSuccessMessage}
        />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Firmy</ControlBarTitle>

        <Select
          value={clientState}
          handleValueChange={handleClientStateChange}
          optionData={clientStateSelectValues}
        />

        {/* <SearchInput
          // onChange={(e) => {
          //   handleSearchQuery(e);
          // }}
          name="Search"
          id="Search"
          placeholder="Szukaj"
          {...getInputProps()}
        /> */}

        <div className={styles.searchContainer}>
          <SearchInput
            type="text"
            name="Search"
            id="Search"
            placeholder="Szukaj"
            className={styles.input}
            {...getInputProps()}
          />
          <div
            {...getMenuProps()}
            className={
              isOpen && matchingCompanies.length > 0
                ? styles.searchResultContainer
                : styles.hidden
            }
            aria-label="results"
          >
            {isOpen &&
              matchingCompanies.map((item, index) => (
                <Link
                  to={`/firmy/${item._id}`}
                  key={item._id}
                  className={styles.searchedCompanyItem}
                  onClick={(e) => e.stopPropagation()}
                >
                  {highlightedIndex === index ? (
                    <p
                      {...getItemProps({ item, index })}
                      className={styles.highlightedCompanyItem}
                    >
                      {item.name}
                    </p>
                  ) : (
                    <p
                      {...getItemProps({ item, index })}
                      className={styles.companyItem}
                    >
                      {item.name}
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          {hasRole(user, ['admin']) && (
            <CTA
              onClick={() => {
                openModal();
              }}
            >
              Dodaj Firme
            </CTA>
          )}

          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div className={styles.companyInfoBarContainer}>
              <div className={styles.tileElementInfoBar}>
                <p>Firma</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>NIP</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Adres</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Strona</p>
              </div>

              <div className={styles.usersImgContainer}>
                <p>Zespół</p>
              </div>
            </div>
          </InfoBar>
          {companies?.length ? (
            <>
              {companies.map((company, index) => {
                return (
                  <CompanyTile
                    key={company._id}
                    company={company}
                    index={index}
                    user={user}
                    hasRole={hasRole}
                  />
                );
              })}
            </>
          ) : (
            <SkeletonUsersLoading />
          )}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default CompaniesView;
