import { Icon } from '@iconify/react';
import styles from './UserProfileViewComponent.module.css';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import hasRole from '../../../utils/hasRole';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';
import useAuth from '../../../hooks/useAuth';
import useMultiSelect from '../../../hooks/useMultiSelect';
import MonthPerDaySummaryChart from '../Charts/MonthPerDaySummaryChart/MonthPerDaySummaryChart';

function UserProfileViewComponent({
  isLoading,
  profileData,
  handleFormChange,
  user,
  viewVariable,
  selectedMonth,
  selectedYear,
  dataReady,
  monthDaysSummary,
  chartViewVariable,
  isChartLoading,
}) {
  const { user: loggedUser } = useAuth();
  const {
    isSelectOpen,
    setIsSelectOpen,
    selectFilterValue,
    handleFilterDropdownInputValue,
    assignedRoles,
    filteredRolesForDropdown,
    handleRoleAssign,
  } = useMultiSelect(user);

  if (isLoading) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  if (profileData) {
    return (
      <div className={styles.columnsWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.infoInputsWrapper}>
            <div className={styles.inputWrapper}>
              <label htmlFor="userName">Imie </label>
              <input
                type="text"
                name="userName"
                id="userName"
                maxLength={30}
                value={profileData.name}
                onChange={(e) => {
                  handleFormChange(e, 'name');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userLastname">Nazwisko</label>
              <input
                type="text"
                name="userLastname"
                id="userLastname"
                maxLength={40}
                value={profileData.lastname}
                onChange={(e) => {
                  handleFormChange(e, 'lastname');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userEmail">Email</label>
              <input
                type="text"
                name="userEmail"
                id="userEmail"
                maxLength={100}
                value={profileData.email}
                onChange={(e) => {
                  handleFormChange(e, 'email');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userPhone">Numer</label>
              <input
                type="text"
                name="userPhone"
                id="userPhone"
                maxLength={15}
                value={profileData.phone}
                onChange={(e) => {
                  handleFormChange(e, 'phone');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userJob">Stanowisko</label>
              <input
                type="text"
                name="userJob"
                id="userJob"
                maxLength={20}
                value={profileData.job}
                onChange={(e) => {
                  handleFormChange(e, 'job');
                }}
                className={styles.editInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="userJob">Rola</label>

              {user.length > 0 &&
                hasRole(loggedUser, ['admin']) &&
                viewVariable === 'Profil' && (
                  <MultiselectDropdown
                    isSelectOpen={isSelectOpen}
                    setIsSelectOpen={setIsSelectOpen}
                    label="Rola"
                    inputKey="role"
                    inputValue={selectFilterValue}
                    handleInputValue={handleFilterDropdownInputValue}
                    isBigger
                    isSquare
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
                )}
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <MonthPerDaySummaryChart
            selectedMonth={selectedMonth}
            monthDaysSummary={monthDaysSummary}
            dataReady={dataReady}
            isYearly={chartViewVariable === 'Roczne'}
            year={selectedYear}
            isLoading={isChartLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.noTasksContainer}>
      <div>
        <p>Brak danych</p>
        <Icon icon="line-md:coffee-loop" width="24" height="24" />
      </div>
    </div>
  );
}

export default UserProfileViewComponent;
