import { useState } from 'react';
import { Icon } from '@iconify/react';
import BackButton from '../../../Atoms/BackButton/BackButton';
import styles from './CompanyProfileControlBar.module.css';
import CTA from '../../../Atoms/CTA/CTA';
import Select from '../../../Atoms/Select/Select';
import summarizeCompanyProfHours from '../../../../utils/summarizeCompanyProfHours';
import FilterDropdownContainer from '../../../Atoms/FilterDropdownContainer/FilterDropdownContainer';
import Overlay from '../../../Atoms/Overlay/Overlay';
import DropdownHeader from '../../../Atoms/DropdownHeader/DropdownHeader';
import MultiselectDropdown from '../../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../../Molecules/FilterCheckbox/FilterCheckbox';
import FiltersClearButton from '../../../Atoms/FiltersClearButton/FiltersClearButton';

function CompanyProfileControlBar({
  company,
  openModal,
  tasks,
  selectedMonth,
  selectedYear,
  handleMonthChange,
  handleYearChange,
  months,
  years,
  currentMonthIndex,
  clientPersonToFilter,
  setClientPersonToFilter,
  searchInputValue,
  setSearchInputValue,
  settleStateFilter,
  setSettleStateFilter,
  exportToExcel,
}) {
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSecondSelectOpen, setIsSecondSelectOpen] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    client: '',
    settled: '',
  });

  const total =
    tasks.length > 0
      ? tasks.reduce((tasksTotalHours, task) => {
          return (
            tasksTotalHours + summarizeCompanyProfHours(task, currentMonthIndex)
          );
        }, 0)
      : 0;

  const settleDropdownData = [
    {
      id: 2,
      value: 'Rozliczone',
    },
    {
      id: 3,
      value: 'Nierozliczone',
    },
  ];

  const toggleClientPerson = (clientPerson) => {
    if (clientPersonToFilter.includes(clientPerson.name)) {
      setClientPersonToFilter(
        clientPersonToFilter.filter((part) => part !== clientPerson.name)
      );
    } else {
      setClientPersonToFilter((prev) => {
        return [...prev, clientPerson.name];
      });
    }
  };

  const toggleSettleValue = (settleValue) => {
    if (settleStateFilter) {
      setSettleStateFilter('');
    } else {
      setSettleStateFilter(settleValue.value);
    }
  };

  const viewData = ['Główne', 'Dodatkowe'];

  const handleFilterDropdownInputValue = (e, key) => {
    const { value } = e.target;
    setSelectFilterValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const filteredClientsForDropdown =
    company &&
    company.clientPerson.filter((u) => {
      return u.name
        .toLocaleLowerCase()
        .includes(selectFilterValue.client.toLocaleLowerCase());
    });

  const filteredSettledForDropdown = settleDropdownData.filter((s) => {
    return s.value
      .toLocaleLowerCase()
      .includes(selectFilterValue.settled.toLocaleLowerCase());
  });

  // const dataForExcel = () => {
  //   return tasks.map((task) => {
  //     return {
  //       zlecenie_stworzył: task.author.name,
  //       numer_karty: task.searchID,
  //       firma: task.client,
  //       klient: task.clientPerson,
  //       tytuł: task.title,
  //       opis: task.description,
  //       rozliczone: task.isSettled,
  //       suma_godzin: summarizeCompanyProfHours(task, currentMonthIndex),
  //     };
  //   });
  // };

  const dataForExcel = () => {
    const arr = tasks.flatMap((task) =>
      task.participants.flatMap((participant) => {
        const author = {
          _id: participant._id,
          name: participant.name,
          img: participant.img,
        };

        const currentMonth = participant.months.find((month) => {
          const date = new Date(month.createdAt);
          return date.getUTCMonth() === currentMonthIndex;
        });

        if (!currentMonth) return [];

        return currentMonth.hours
          .filter((hour) => hour.hourNum > 0)
          .map((hour) => {
            const day = String(hour.dayIndex).padStart(2, '0');
            const month = String(currentMonthIndex + 1).padStart(2, '0');

            return {
              Data: `${day}.${month}`,
              Klient: task.clientPerson,
              Tytuł: task.title,
              Numer_karty: task.searchID,
              Autor: author.name,
              Firma: task.client,
              Godziny: hour.hourNum,
              Opis: task.description,
              Komentarz: task.comment,
              Rozliczone: task.isSettled,
            };
          });
      })
    );

    return arr.sort((a, b) => {
      const [dayA, monthA] = a.Data.split('.').map(Number);
      const [dayB, monthB] = b.Data.split('.').map(Number);

      const dateA = new Date(selectedYear, monthA - 1, dayA);
      const dateB = new Date(selectedYear, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });
  };

  const secondDataForExcel = () => {
    const arr = tasks.flatMap((task) => {
      return {
        Data: task.startDate,
        Klient: task.clientPerson,
        Tytuł: task.title,
        Numer_karty: task.searchID,
        Autor: task.author.name,
        Firma: task.client,
        Godziny: summarizeCompanyProfHours(task, currentMonthIndex),
        Opis: task.description,
        Komentarz: task.comment,
        Rozliczone: task.isSettled,
      };
    });
    return arr;
  };

  return (
    <div className={styles.companyProfileControlBarWrapper}>
      <div className={styles.leftSide}>
        <BackButton path="firmy" />
        {company ? (
          <div
            className={styles.editCompanyWrapper}
            role="button"
            tabIndex={0}
            onClick={() => openModal()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openModal();
              }
            }}
          >
            <button type="button" className={styles.editCompanyButton}>
              <h2>{company.name}</h2>
            </button>

            <Icon icon="lucide:edit" width="24" height="24" color="#f68c1e" />
          </div>
        ) : (
          <div className={styles.companyNameLoader} />
        )}

        <Select
          value={selectedMonth}
          handleValueChange={handleMonthChange}
          optionData={viewData}
        />

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
      <div className={styles.center}>
        {/* <SearchInput
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
        /> */}

        <input
          id="search"
          type="text"
          placeholder="Szukaj"
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
          className={styles.filterInput}
          name="search"
        />

        <button
          type="button"
          onClick={() => {
            setDownloadDropdown((prev) => !prev);
          }}
          className={styles.exportButton}
        >
          <Icon
            icon="line-md:downloading-loop"
            width="36"
            height="36"
            className={styles.exportIcon}
          />
        </button>

        {/* <button
          type="button"
          onClick={() => {
            exportToExcel(secondDataForExcel());
          }}
          className={styles.exportButton}
        >
          tetete
        </button> */}

        {downloadDropdown && (
          <div>
            <button
              type="button"
              className={`${styles.downloadButton} ${styles.listBtn}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                exportToExcel(dataForExcel());
              }}
            >
              Lista
            </button>
            <button
              type="button"
              className={`${styles.downloadButton} ${styles.sumBtn}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                exportToExcel(secondDataForExcel());
              }}
            >
              Suma
            </button>
          </div>
        )}
      </div>

      <div className={styles.summaryContainer}>
        <p className={styles.summTitle}>Suma:</p>
        <div className={styles.hoursTile}>
          <p>{total}h</p>
        </div>
        <div className={styles.revTile}>
          <p className={styles.summText}>
            {company && total * Number(company.hourRate)}zł
          </p>
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
              {filteredClientsForDropdown.map((cp) => {
                return (
                  <FilterCheckbox
                    key={cp._id}
                    name={cp.name}
                    isSelected={clientPersonToFilter.includes(cp.name)}
                    toggleCompany={toggleClientPerson}
                    filterVariable={cp}
                  />
                );
              })}
            </MultiselectDropdown>
            <div className={styles.spacer} />
            <MultiselectDropdown
              label="Rozliczone"
              isSelectOpen={isSecondSelectOpen}
              setIsSelectOpen={setIsSecondSelectOpen}
              inputKey="settled"
              inputValue={selectFilterValue.settled}
              handleInputValue={handleFilterDropdownInputValue}
              isBigger={false}
              isSquare={false}
            >
              {filteredSettledForDropdown.map((sdd) => {
                return (
                  <FilterCheckbox
                    key={sdd.id}
                    name={sdd.value}
                    isSelected={settleStateFilter === sdd.value}
                    toggleCompany={toggleSettleValue}
                    filterVariable={sdd}
                  />
                );
              })}
            </MultiselectDropdown>

            <FiltersClearButton
              handleClear={() => {
                setClientPersonToFilter([]);
                setSettleStateFilter('');
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

export default CompanyProfileControlBar;
