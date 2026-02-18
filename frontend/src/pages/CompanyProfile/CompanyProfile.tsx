import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import styles from './CompanyProfile.module.css';
import {
  CompaniesType,
  deleteCompany,
  getAssignedReckoTasks,
  getCurrentCompany,
} from '../../services/companies-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import usePagination from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';
import UpdateCompanyModalContent from '../../components/Organisms/UpdateCompanyModalContent/UpdateCompanyModalContent';
import Captcha from '../../components/Molecules/Captcha/Captcha';
import CompanyProfileControlBar from '../../components/Organisms/CompanyProfile/CompanyProfileControlBar/CompanyProfileControlBar';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import useCurrentDate from '../../hooks/useCurrentDate';
import useViewportHeight from '../../hooks/useViewportHeight';
import CompanyProfileViewComponent from '../../components/Organisms/CompanyProfile/CompanyProfileViewComponent/CompanyProfileViewComponent';
import CompanyInfoBar from '../../components/Molecules/CompanyInfoBar/CompanyInfoBar';

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType>();
  const [clientPersonToFilter, setClientPersonToFilter] = useState<string[]>(
    []
  );
  const [settleStateFilter, setSettleStateFilter] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [reckoningTasks, setReckoningTasks] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const [deleteCaptcha, setDeleteCaptcha] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });

  const { dispatch } = useCompaniesContext();

  const navigate = useNavigate();

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const currentMonthIndex = months.indexOf(selectedMonth);

  const filteredTasks =
    clientPersonToFilter.length > 0
      ? reckoningTasks.filter((ct) => {
          return clientPersonToFilter.includes(ct.clientPerson);
        })
      : reckoningTasks;

  const filteredBySettleValTasks = () => {
    if (settleStateFilter.length > 0 && clientPersonToFilter.length > 0) {
      return filteredTasks.filter((cp) => {
        if (settleStateFilter === 'Rozliczone') return cp.isSettled;
        if (settleStateFilter === 'Nierozliczone') return !cp.isSettled;

        return true;
      });
    }

    return settleStateFilter.length > 0
      ? reckoningTasks.filter((cp) => {
          if (settleStateFilter === 'Rozliczone') return cp.isSettled;
          if (settleStateFilter === 'Nierozliczone') return !cp.isSettled;

          return true;
        })
      : filteredTasks;
  };

  const matchedTasksFromSearchInput = searchInputValue
    ? reckoningTasks.filter((cts) => {
        return (
          cts.title.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          cts.description
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          cts.comment.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          cts.clientPerson
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          cts.searchID.toString().includes(searchInputValue) ||
          cts.participants.some((member) =>
            member.name.toLowerCase().includes(searchInputValue.toLowerCase())
          )
        );
      })
    : filteredBySettleValTasks();

  const { sortedData, sortColumn, sortOrder, handleSortChange } = useSort(
    matchedTasksFromSearchInput,
    currentMonthIndex,
    company && company.hourRate
  );

  const viewportHeight = useViewportHeight();

  const {
    currentPage,
    totalPages,
    setItemsPerPage,
    currentTasks,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(sortedData, 14);

  const params = useParams();
  const companyID = params.id;

  useEffect(() => {
    const tileHeight = 35;
    const headerHeight = 300;
    const availableHeight = viewportHeight - headerHeight;

    const itemsPerPage = Math.floor(availableHeight / tileHeight);
    setItemsPerPage(itemsPerPage > 0 ? itemsPerPage : 1);
  }, [viewportHeight]);

  const fetchCompany = async () => {
    let errorHappened = false;

    const currentCompany = await getCurrentCompany(companyID);

    if (currentCompany) {
      setCompany(currentCompany);

      try {
        setLoadingState(() => ({
          isLoading: true,
          isError: false,
        }));

        const reckoTasks = await getAssignedReckoTasks({
          company: currentCompany.name,
          monthIndex: currentMonthIndex + 1,
          yearIndex: selectedYear,
        });

        setReckoningTasks(reckoTasks.reckoTasks);
      } catch (error) {
        errorHappened = true;
        setLoadingState(() => ({
          isLoading: false,
          isError: true,
        }));
      } finally {
        setLoadingState((prevState) => ({
          ...prevState,
          isLoading: false,
          isError: errorHappened ? true : prevState.isError,
        }));
      }
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [currentMonthIndex, selectedYear]);

  const handleDeleteCompany = async (id) => {
    await deleteCompany(id);
    dispatch({ type: 'DELETE_COMPANY', payload: company });
    closeModal();
    navigate('/firmy');
  };

  const dataToSummarize = () => {
    if (clientPersonToFilter.length > 0) {
      return filteredTasks;
    }
    if (searchInputValue.length > 0) {
      return matchedTasksFromSearchInput;
    }

    return reckoningTasks;
  };

  const exportToExcel = (
    rows: Array<{
      Data: string;
      Klient: string;
      Tytuł: string;
      Numer_karty: number | string;
      Autor: string;
      Firma: string;
      Godziny: number;
      Opis: string;
      Komentarz: string;
      Rozliczone: boolean;
    }>
  ) => {
    if (!rows || rows.length === 0) return;

    const rate = Number(company?.hourRate ?? 0);
    const title = `${company?.name ?? ''} — ${selectedMonth} ${selectedYear}`;

    const header = [
      'Data',
      'Klient',
      'Tytuł',
      'Numer_karty',
      'Autor',
      'Firma',
      'Sum',
      'Przychód',
      'Opis',
      'Komentarz',
      'Rozliczone',
    ];

    const aoa: any[][] = [];
    aoa.push([title]);
    aoa.push([]);
    aoa.push(header);

    // Data rows start at row 4
    rows.forEach((r, i) => {
      const excelRowIndex = 4 + i; // 1-based index in Excel
      aoa.push([
        r.Data,
        r.Klient,
        r.Tytuł,
        r.Numer_karty,
        r.Autor,
        r.Firma,
        r.Godziny,
        { f: `G${excelRowIndex}*${rate}` },
        r.Opis,
        r.Komentarz,
        r.Rozliczone ? 'TAK' : 'NIE',
      ]);
    });

    const firstDataRow = 4;
    const lastDataRow = firstDataRow + rows.length - 1;

    // SUM row
    aoa.push([]);
    aoa.push([
      '',
      '',
      '',
      '',
      '',
      'SUMA:',
      { f: `SUM(G${firstDataRow}:G${lastDataRow})` }, // sum Godziny
      { f: `SUM(H${firstDataRow}:H${lastDataRow})` }, // sum Przychód
      '',
      '',
      '',
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Merge the title across all columns (A1:K1)
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } }];

    // Column widths
    ws['!cols'] = [
      { wch: 8 }, // Data
      { wch: 18 }, // Klient
      { wch: 35 }, // Tytuł
      { wch: 11 }, // Numer_karty
      { wch: 18 }, // Autor
      { wch: 18 }, // Firma
      { wch: 5 }, // Godziny
      { wch: 12 }, // Przychód
      { wch: 35 }, // Opis
      { wch: 24 }, // Komentarz
      { wch: 10 }, // Rozliczone
    ];

    // AutoFilter over the header+data rows (A3:K[lastDataRow])
    ws['!autofilter'] = { ref: `A3:K${lastDataRow}` };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, company?.name ?? 'Dane');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const now = new Date();
    saveAs(
      blob,
      `${company?.name ?? 'firma'}_${now.getDate()}_${
        now.getMonth() + 1
      }_${now.getFullYear()}_zlecenia.xlsx`
    );
  };

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          setDeleteCaptcha(false);
        }}
        exitAnim={exitAnim}
      >
        {deleteCaptcha ? (
          <Captcha
            handleDelete={handleDeleteCompany}
            closeFunction={setDeleteCaptcha}
            isUserProfile={false}
            id={companyID}
          />
        ) : (
          <UpdateCompanyModalContent
            currentCompany={company}
            closeModal={closeModal}
            openCaptcha={setDeleteCaptcha}
            refreshCompanyData={fetchCompany}
          />
        )}
      </ModalTemplate>

      <ControlBar>
        <CompanyProfileControlBar
          company={company}
          openModal={openModal}
          tasks={dataToSummarize()}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          months={months}
          years={years}
          currentMonthIndex={currentMonthIndex}
          setClientPersonToFilter={setClientPersonToFilter}
          clientPersonToFilter={clientPersonToFilter}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          settleStateFilter={settleStateFilter}
          setSettleStateFilter={setSettleStateFilter}
          exportToExcel={exportToExcel}
        />
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <CompanyInfoBar
            handleSortChange={handleSortChange}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
          />

          <CompanyProfileViewComponent
            loadingState={loadingState}
            currentTasks={currentTasks}
            currentMonthIndex={currentMonthIndex}
            companyHourRate={company && company.hourRate}
          />

          <div className={styles.paginationControls}>
            <button
              onClick={handlePreviousPage}
              type="button"
              disabled={currentPage === 1}
              className={`${styles.paginationButton} ${styles.prevPaginationButton}`}
            >
              <Icon
                icon="ion:arrow-back-outline"
                color="#f68c1e"
                width="25"
                height="25"
              />
            </button>
            <span className={styles.paginationInfo}>
              {currentPage} z {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              type="button"
              disabled={currentPage === totalPages}
              className={`${styles.paginationButton} ${styles.nextPaginationButton}`}
            >
              <Icon
                icon="ion:arrow-back-outline"
                color="#f68c1e"
                width="25"
                height="25"
              />
            </button>
          </div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default CompanyProfile;
