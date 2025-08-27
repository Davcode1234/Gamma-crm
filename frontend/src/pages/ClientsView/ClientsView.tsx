import { useEffect, useState } from 'react';
import styles from './ClientsView.module.css';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import { getAllClients } from '../../services/clients-service';
import useClientsContext from '../../hooks/Context/useClientsContext';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import CTA from '../../components/Atoms/CTA/CTA';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import AddClientForm from '../../components/Organisms/AddClientForm/AddClientForm';
import Overlay from '../../components/Atoms/Overlay/Overlay';
import FilterDropdownContainer from '../../components/Atoms/FilterDropdownContainer/FilterDropdownContainer';
import DropdownHeader from '../../components/Atoms/DropdownHeader/DropdownHeader';
import MultiselectDropdown from '../../components/Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../components/Molecules/FilterCheckbox/FilterCheckbox';
import FiltersClearButton from '../../components/Atoms/FiltersClearButton/FiltersClearButton';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import useAuth from '../../hooks/useAuth';
import hasRole from '../../utils/hasRole';

function ClientsView() {
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    client: '',
  });
  const [companyToFilter, setCompanyToFilter] = useState<string[]>([]);

  const { dispatch, clients } = useClientsContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();

  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const { user } = useAuth();

  // EXTRACT FILTER DROPDOWN LOGIC TO CUSTOM HOOK

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const allClients = await getAllClients();
        dispatch({ type: 'SET_CLIENTS', payload: allClients });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchClients();
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, [companiesDispatch, companies]);

  const toggleClientPerson = (clientPerson) => {
    if (companyToFilter.includes(clientPerson.name)) {
      setCompanyToFilter(
        companyToFilter.filter((part) => part !== clientPerson.name)
      );
    } else {
      setCompanyToFilter((prev) => {
        return [...prev, clientPerson.name];
      });
    }
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

  const filteredBySelectDropdown =
    companyToFilter.length > 0
      ? clients.filter((c) => {
          return companyToFilter.includes(c.company);
        })
      : clients;

  const filteredBySearch = filteredBySelectDropdown.filter((c) => {
    return searchInputValue
      ? c.company.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          c.name.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          c.phone.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          c.email.toLowerCase().includes(searchInputValue.toLowerCase())
      : clients;
  });

  // const filteredClientsForDropdown =
  //   company &&
  //   company.clientPerson.filter((u) => {
  //     return u.value
  //       .toLocaleLowerCase()
  //       .includes(selectFilterValue.client.toLocaleLowerCase());
  //   });

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        <AddClientForm companyName="" />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Klienci</ControlBarTitle>
        <SearchInput
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
        />

        {filterDropdown && (
          <>
            <Overlay closeFunction={setFilterDropdown} />
            <FilterDropdownContainer>
              <DropdownHeader>Filtr</DropdownHeader>
              <br />
              <MultiselectDropdown
                label="Firmy"
                isSelectOpen={isSelectOpen}
                setIsSelectOpen={setIsSelectOpen}
                inputKey="client"
                inputValue={selectFilterValue.client}
                handleInputValue={handleFilterDropdownInputValue}
                isBigger={false}
                isSquare={false}
              >
                {companies.map((cp) => {
                  return (
                    <FilterCheckbox
                      key={cp._id}
                      name={cp.name}
                      isSelected={companyToFilter.includes(cp.name)}
                      toggleCompany={toggleClientPerson}
                      filterVariable={cp}
                    />
                  );
                })}
                <p>test</p>
              </MultiselectDropdown>
              <FiltersClearButton
                handleClear={() => {
                  setCompanyToFilter([]);
                }}
              />
            </FilterDropdownContainer>
          </>
        )}
        <div className={styles.buttonsWrapper}>
          {hasRole(user, ['admin']) && (
            <CTA
              onClick={() => {
                openModal();
              }}
            >
              Dodaj klienta
            </CTA>
          )}

          <CTA
            onClick={() => {
              setFilterDropdown((prev) => !prev);
            }}
          >
            Filtry
          </CTA>
        </div>
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div className={styles.clientInfoBarContainer}>
              <div className={styles.tileElementInfoBar}>
                <p>Nazwa</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Firma</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Mail</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Numer</p>
              </div>
            </div>
          </InfoBar>
          <>
            {filteredBySearch.map((cl, index) => {
              return hasRole(user, ['admin']) ? (
                <TileWrapper key={cl._id} index={index} linkPath={cl._id}>
                  <div className={styles.clientTileWrapper}>
                    <p
                      className={`${styles.clientTileWrapperElement} ${styles.bolded}`}
                    >
                      {cl.name}
                    </p>
                    <p
                      className={`${styles.clientTileWrapperElement} ${styles.bolded}`}
                    >
                      {cl.company}
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      <a
                        href={`mailto:${cl.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cl.email}
                      </a>
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      <a
                        href={`tel:${cl.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cl.phone}
                      </a>
                    </p>
                  </div>
                </TileWrapper>
              ) : (
                <TileWrapper key={cl._id} index={index} linkPath="">
                  <div className={styles.clientTileWrapper}>
                    <p
                      className={`${styles.clientTileWrapperElement} ${styles.bolded}`}
                    >
                      {cl.name}
                    </p>
                    <p
                      className={`${styles.clientTileWrapperElement} ${styles.bolded}`}
                    >
                      {cl.company}
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      <a
                        href={`mailto:${cl.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cl.email}
                      </a>
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      <a
                        href={`tel:${cl.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cl.phone}
                      </a>
                    </p>
                  </div>
                </TileWrapper>
              );
            })}
          </>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ClientsView;
