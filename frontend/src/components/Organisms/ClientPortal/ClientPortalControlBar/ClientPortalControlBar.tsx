import { useState } from 'react';
import styles from './ClientPortalControlBar.module.css';
import CTA from '../../../Atoms/CTA/CTA';
import Select from '../../../Atoms/Select/Select';
import Overlay from '../../../Atoms/Overlay/Overlay';
import FilterDropdownContainer from '../../../Atoms/FilterDropdownContainer/FilterDropdownContainer';
import DropdownHeader from '../../../Atoms/DropdownHeader/DropdownHeader';
import FiltersClearButton from '../../../Atoms/FiltersClearButton/FiltersClearButton';
import MultiselectDropdown from '../../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../../Molecules/FilterCheckbox/FilterCheckbox';

type Designer = {
  _id: string;
  name: string;
  lastname: string;
};

function ClientPortalControlBar({
  companyName,
  totalHours,
  selectedMonth,
  selectedYear,
  handleMonthChange,
  handleYearChange,
  months,
  years,
  clientPersons,
  designers,
  clientPersonToFilter,
  setClientPersonToFilter,
  designerToFilter,
  setDesignerToFilter,
}) {
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSecondSelectOpen, setIsSecondSelectOpen] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    client: '',
    designer: '',
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

  const toggleClientPerson = (clientPerson: string) => {
    if (clientPersonToFilter.includes(clientPerson)) {
      setClientPersonToFilter(
        clientPersonToFilter.filter((cp) => cp !== clientPerson)
      );
    } else {
      setClientPersonToFilter((prev) => [...prev, clientPerson]);
    }
  };

  const toggleDesigner = (designer: Designer) => {
    if (designerToFilter.includes(designer._id)) {
      setDesignerToFilter(designerToFilter.filter((id) => id !== designer._id));
    } else {
      setDesignerToFilter((prev) => [...prev, designer._id]);
    }
  };

  const filteredClientsForDropdown = clientPersons.filter((cp: string) =>
    cp.toLocaleLowerCase().includes(selectFilterValue.client.toLowerCase())
  );

  const filteredDesignersForDropdown = designers.filter((d: Designer) =>
    `${d.name} ${d.lastname}`
      .toLocaleLowerCase()
      .includes(selectFilterValue.designer.toLocaleLowerCase())
  );

  return (
    <div className={styles.controlBarWrapper}>
      <div className={styles.leftSide}>
        <h2 className={styles.companyName}>{companyName}</h2>
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

      <div className={styles.summaryContainer}>
        <p className={styles.summTitle}>Suma:</p>
        <div className={styles.hoursTile}>
          <p>{totalHours}h</p>
        </div>
      </div>

      {filterDropdown && (
        <>
          <Overlay closeFunction={setFilterDropdown} />
          <FilterDropdownContainer>
            <DropdownHeader>Filtr</DropdownHeader>
            <br />
            <MultiselectDropdown
              label="Klienci"
              isSelectOpen={isSelectOpen}
              setIsSelectOpen={setIsSelectOpen}
              inputKey="client"
              inputValue={selectFilterValue.client}
              handleInputValue={handleFilterDropdownInputValue}
              isBigger={false}
              isSquare={false}
            >
              {filteredClientsForDropdown.map((cp: string) => {
                return (
                  <FilterCheckbox
                    key={cp}
                    name={cp}
                    isSelected={clientPersonToFilter.includes(cp)}
                    toggleCompany={toggleClientPerson}
                    filterVariable={cp}
                  />
                );
              })}
            </MultiselectDropdown>
            <div className={styles.spacer} />
            <MultiselectDropdown
              label="Graficy"
              isSelectOpen={isSecondSelectOpen}
              setIsSelectOpen={setIsSecondSelectOpen}
              inputKey="designer"
              inputValue={selectFilterValue.designer}
              handleInputValue={handleFilterDropdownInputValue}
              isBigger={false}
              isSquare={false}
            >
              {filteredDesignersForDropdown.map((d: Designer) => {
                return (
                  <FilterCheckbox
                    key={d._id}
                    name={`${d.name} ${d.lastname}`}
                    isSelected={designerToFilter.includes(d._id)}
                    toggleCompany={toggleDesigner}
                    filterVariable={d}
                  />
                );
              })}
            </MultiselectDropdown>

            <FiltersClearButton
              handleClear={() => {
                setClientPersonToFilter([]);
                setDesignerToFilter([]);
              }}
            />
          </FilterDropdownContainer>
        </>
      )}
      <div className={styles.controlBarBtnsWrapper}>
        <CTA
          type="button"
          onClick={() => {
            setFilterDropdown((prev) => !prev);
          }}
        >
          Filtry
        </CTA>
      </div>
    </div>
  );
}

export default ClientPortalControlBar;
