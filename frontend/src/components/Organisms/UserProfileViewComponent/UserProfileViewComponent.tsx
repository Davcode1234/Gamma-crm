import { Icon } from '@iconify/react';
import {
  Cell,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
} from 'recharts';

import styles from './UserProfileViewComponent.module.css';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import hasRole from '../../../utils/hasRole';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';
import useAuth from '../../../hooks/useAuth';
import useMultiSelect from '../../../hooks/useMultiSelect';
import MonthPerDaySummaryChart from '../Charts/MonthPerDaySummaryChart/MonthPerDaySummaryChart';
import ClientsPerMonthsChart from '../Charts/ClientsPerMontsChart/ClientsPerMonthsChart';
import SummaryTile from '../Charts/SummaryTile/SummaryTile';

const RADIAN = Math.PI / 180;
const COLORS = ['#22C55E', '#06B6D4'];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

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
  clientsMonthSummary,
  clientsMonthSummaryByRevenue,
  pieChartsData,
  summedHours,
  summedRevenue,
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
                disabled={!hasRole(loggedUser, ['admin'])}
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
                disabled={!hasRole(loggedUser, ['admin'])}
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
                disabled={!hasRole(loggedUser, ['admin'])}
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
                disabled={!hasRole(loggedUser, ['admin'])}
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
                disabled={!hasRole(loggedUser, ['admin'])}
              />
            </div>
            {hasRole(loggedUser, ['admin']) && (
              <div className={styles.inputWrapper}>
                <label htmlFor="userJob">Rola</label>

                {user.length > 0 && viewVariable === 'Profil' && (
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
            )}
          </div>
          <div className={styles.leftColumnStatsContainer}>
            <div className={styles.pieChartContainer}>
              <p>Zlecenia</p>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartsData}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive
                    >
                      {pieChartsData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.status}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.pieChartLegendContainer}>
                  <div className={styles.legendItemWrapper}>
                    <div className={styles.legendInnerIcon} />
                    <p>Wewnętrzne</p>
                  </div>
                  <div className={styles.legendItemWrapper}>
                    <div className={styles.legendOuterIcon} />
                    <p>Zewnętrzne</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.summaryTilesWrapper}>
              <SummaryTile
                title="Suma godzin"
                iconValue="ic:baseline-access-time"
                isUserProfile
              >
                {`${summedHours} h`}
              </SummaryTile>
              {hasRole(loggedUser, ['admin']) && (
                <SummaryTile
                  title="Suma przychodów "
                  iconValue="ic:outline-monetization-on"
                  isUserProfile
                >
                  {`${summedRevenue} zł`}
                </SummaryTile>
              )}
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.monthPerDayContainer}>
            <MonthPerDaySummaryChart
              selectedMonth={selectedMonth}
              monthDaysSummary={monthDaysSummary}
              dataReady={dataReady}
              isYearly={chartViewVariable === 'Roczne'}
              year={selectedYear}
              isLoading={isChartLoading}
            />
          </div>

          <ClientsPerMonthsChart
            dataReady={dataReady}
            clientsMonthSummary={clientsMonthSummary}
            selectedMonth={selectedMonth}
            clientsMonthSummaryByRevenue={clientsMonthSummaryByRevenue}
            isYearly={viewVariable === 'Roczne'}
            year={selectedYear}
            isLoading={isChartLoading}
            displayRevenue={hasRole(loggedUser, ['admin'])}
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
