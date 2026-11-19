import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ClientPortalRow from '../../components/Organisms/ClientPortal/ClientPortalRow/ClientPortalRow';
import ClientPortalControlBar from '../../components/Organisms/ClientPortal/ClientPortalControlBar/ClientPortalControlBar';
import { months } from '../../hooks/useCurrentDate';
import useSort from '../../hooks/useSort';
import {
  CLIENT_PORTAL_START,
  ClientReckoTask,
  getClientCompany,
  getClientReckoTasks,
} from '../../services/client-portal-service';
import summarizeCompanyProfHours from '../../utils/summarizeCompanyProfHours';
import styles from './ClientPortalView.module.css';

// Columns of the list; `sortKey` is the task field passed to useSort.
const columns = [
  { label: 'ID', sortKey: 'searchID' },
  { label: 'Klient', sortKey: 'clientPerson' },
  { label: 'Tytuł', sortKey: 'title' },
  { label: 'Graficy (godziny)', sortKey: '' },
  { label: 'Suma', sortKey: 'participants' },
  { label: 'Budżet', sortKey: '' },
  { label: 'Nr zamówienia', sortKey: '' },
  { label: 'Zafakturowanie', sortKey: '' },
  { label: 'Rozliczone', sortKey: '' },
];

const isBeforeStart = (monthIndex: number, year: number) =>
  year < CLIENT_PORTAL_START.year ||
  (year === CLIENT_PORTAL_START.year &&
    monthIndex < CLIENT_PORTAL_START.monthIndex);

// Years from the start of the portal up to the current one.
const years = Array.from(
  {
    length:
      Math.max(new Date().getFullYear() - CLIENT_PORTAL_START.year, 0) + 1,
  },
  (_, i) => CLIENT_PORTAL_START.year + i
);

// The client cannot pick months before the start of the portal.
const monthsOfYear = (year: number) =>
  year === CLIENT_PORTAL_START.year
    ? months.slice(CLIENT_PORTAL_START.monthIndex)
    : months;

// Today, or the start of the portal if today is before it.
const getInitialDate = () => {
  const today = new Date();
  return isBeforeStart(today.getMonth(), today.getFullYear())
    ? CLIENT_PORTAL_START
    : { year: today.getFullYear(), monthIndex: today.getMonth() };
};

// View for users with the 'client' role: their company's reckoning tasks with
// hours per graphic designer for the selected month. The client can only fill
// in their order number and mark a task as ready for invoicing.
function ClientPortalView() {
  const [selectedYear, setSelectedYear] = useState(getInitialDate().year);
  const [selectedMonth, setSelectedMonth] = useState(
    months[getInitialDate().monthIndex]
  );
  const currentMonthIndex = months.indexOf(selectedMonth);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Moving to an earlier year can land before the start, so jump to the
  // first visible month then.
  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    if (isBeforeStart(currentMonthIndex, year)) {
      setSelectedMonth(months[CLIENT_PORTAL_START.monthIndex]);
    }
  };

  const [companyName, setCompanyName] = useState('');
  const [tasks, setTasks] = useState<ClientReckoTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [clientPersonToFilter, setClientPersonToFilter] = useState<string[]>(
    []
  );
  const [designerToFilter, setDesignerToFilter] = useState<string[]>([]);

  useEffect(() => {
    getClientCompany()
      .then((company) => setCompanyName(company.name))
      .catch(() => setCompanyName(''));
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setIsError(false);
    getClientReckoTasks({
      monthIndex: currentMonthIndex + 1,
      yearIndex: Number(selectedYear),
    })
      .then((reckoTasks) => {
        if (isCurrent) setTasks(reckoTasks);
      })
      .catch(() => {
        if (isCurrent) setIsError(true);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [currentMonthIndex, selectedYear]);

  const hasHoursInMonth = (participant) =>
    summarizeCompanyProfHours(
      { participants: [participant] },
      currentMonthIndex,
      selectedYear
    ) > 0;

  // Options for the filters, taken from the loaded tasks.
  const clientPersons = [
    ...new Set(tasks.map((task) => task.clientPerson).filter(Boolean)),
  ];
  const designers = [
    ...new Map(
      tasks
        .flatMap((task) => task.participants.filter(hasHoursInMonth))
        .map((participant) => [participant._id, participant])
    ).values(),
  ];

  const filteredTasks = tasks
    .filter(
      (task) =>
        clientPersonToFilter.length === 0 ||
        clientPersonToFilter.includes(task.clientPerson)
    )
    .filter(
      (task) =>
        designerToFilter.length === 0 ||
        task.participants.some(
          (participant) =>
            designerToFilter.includes(participant._id) &&
            hasHoursInMonth(participant)
        )
    );

  const { sortedData, sortColumn, sortOrder, handleSortChange } = useSort(
    filteredTasks,
    currentMonthIndex,
    undefined
  );

  const totalHours = filteredTasks.reduce(
    (sum, task) =>
      sum + summarizeCompanyProfHours(task, currentMonthIndex, selectedYear),
    0
  );

  const renderTasks = () => {
    if (isError) {
      return (
        <div className={styles.stateWrapper}>
          <Icon
            icon="line-md:close-small"
            width="70"
            height="70"
            className={styles.errorIcon}
          />
          <p>Coś poszło nie tak :(</p>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className={styles.stateWrapper}>
          <Icon
            icon="line-md:loading-twotone-loop"
            width="121"
            height="121"
            className={styles.loadingIcon}
          />
        </div>
      );
    }
    if (sortedData.length === 0) {
      return (
        <div className={styles.stateWrapper}>
          <p>Brak zleceń</p>
          <Icon icon="line-md:coffee-loop" width="24" height="24" />
        </div>
      );
    }
    return sortedData.map((task: ClientReckoTask, index: number) => (
      <ClientPortalRow
        key={task._id}
        task={task}
        index={index}
        currentMonthIndex={currentMonthIndex}
        selectedYear={Number(selectedYear)}
      />
    ));
  };

  return (
    <>
      <ControlBar>
        <ClientPortalControlBar
          companyName={companyName}
          totalHours={totalHours}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          months={monthsOfYear(selectedYear)}
          years={years}
          clientPersons={clientPersons}
          designers={designers}
          clientPersonToFilter={clientPersonToFilter}
          setClientPersonToFilter={setClientPersonToFilter}
          designerToFilter={designerToFilter}
          setDesignerToFilter={setDesignerToFilter}
        />
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <div className={styles.headerRow}>
            {columns.map(({ label, sortKey }) =>
              sortKey ? (
                <div
                  key={label}
                  className={`${styles.headerTile} ${styles.sortableTile}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSortChange(sortKey)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSortChange(sortKey);
                    }
                  }}
                >
                  <p>
                    {label}{' '}
                    {sortColumn === sortKey &&
                      (sortOrder === 'asc' ? '↑' : '↓')}
                  </p>
                </div>
              ) : (
                <div key={label} className={styles.headerTile}>
                  <p>{label}</p>
                </div>
              )
            )}
          </div>
          <div className={styles.rows}>{renderTasks()}</div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ClientPortalView;
