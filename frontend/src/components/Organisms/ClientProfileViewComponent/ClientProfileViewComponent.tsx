import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Icon } from '@iconify/react';
import styles from './ClientProfileViewComponent.module.css';
import BackButton from '../../Atoms/BackButton/BackButton';
import DateFormatter from '../../../utils/dateFormatter';
import DeleteButton from '../../Atoms/DeleteButton/DeleteButton';
import SaveButton from '../../Atoms/SaveButton/SaveButton';
import Select from '../../Atoms/Select/Select';
import ProfileTopBar from '../../Atoms/ProfileTopBar/ProfileTopBar';

function ClientProfileViewComponent({
  loadingState,
  clientData,
  formValue,
  openModal,
  handleDeleteClient,
  clientID,
  handleFormChange,
  companies,
  handleUpdateClient,
  chartData,
  notes,
  handleDeleteNote,
  isMouseOverIcon,
  setIsMouseOverIcon,
  users,
  selectedMonth,
  selectedYear,
  handleYearChange,
  handleMonthChange,
  years,
  months,
  summedHours,
  tasksLength,
  clientHourRate,
}) {
  if (loadingState.isError) {
    return (
      <div className={styles.iconWrapper}>
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

  if (!loadingState.isError && loadingState.isLoading) {
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

  if (!loadingState.isError && !loadingState.isLoading && clientData) {
    return (
      <div className={styles.container}>
        <ProfileTopBar>
          <div className={styles.clientNameWrapper}>
            <BackButton path="klienci" />
            <h2>{clientData.name}</h2>

            <div className={styles.buttonsWrapper}>
              <SaveButton callbackFunc={() => handleUpdateClient()}>
                Zapisz
              </SaveButton>
              <DeleteButton callbackFunc={() => handleDeleteClient(clientID)}>
                Usuń
              </DeleteButton>
            </div>
          </div>
        </ProfileTopBar>

        <div className={styles.columnsWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.infoInputsWrapper}>
              <h3>Informacje</h3>
              <div className={styles.inputWrapper}>
                <label htmlFor="clientName">Imie i nazwisko</label>
                <input
                  type="text"
                  name="clientName"
                  id="clientName"
                  maxLength={30}
                  value={formValue.name}
                  onChange={(e) => {
                    handleFormChange(e, 'name');
                  }}
                  className={styles.editInput}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="clientMail">E-mail</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    name="clientMail"
                    id="clientMail"
                    maxLength={40}
                    value={formValue.email}
                    onChange={(e) => {
                      handleFormChange(e, 'email');
                    }}
                    className={styles.editInput}
                  />
                  {formValue.email && (
                    <a href={`mailto: ${formValue.email}`}>
                      <Icon
                        icon="line-md:email-arrow-right"
                        width="32"
                        height="32"
                      />
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="clientPhone">Telefon</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    name="clientPhone"
                    id="clientPhone"
                    maxLength={15}
                    value={formValue.phone}
                    onChange={(e) => {
                      handleFormChange(e, 'phone');
                    }}
                    className={styles.editInput}
                  />
                  {formValue.phone && (
                    <a href={`tel: ${formValue.phone}`}>
                      <Icon
                        icon="line-md:phone-outgoing"
                        width="32"
                        height="32"
                      />
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="companyNIP">Firma</label>
                <select
                  name="companyNIP"
                  id="companyNIP"
                  className={styles.editInput}
                  onChange={(e) => {
                    handleFormChange(e, 'company');
                  }}
                >
                  <option value={formValue.company}>
                    {clientData.company}
                  </option>
                  {companies.map((com) => {
                    return (
                      com.name !== clientData.company && (
                        <option value={com.name} key={com._id}>
                          {com.name}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
            </div>
            <div className={styles.notesContainer}>
              <h3>Notatki</h3>
              <div className={styles.notesWrapper}>
                {notes.length > 0 ? (
                  notes.map((note) => {
                    const author = users.find((u) => u._id === note.author);
                    <p className={styles.authorName}>
                      {author?.name || 'Nieznany autor'}
                    </p>;
                    return (
                      <div className={styles.noteTile} key={note._id}>
                        {isMouseOverIcon.isOver &&
                        isMouseOverIcon.noteID === note._id ? (
                          <Icon
                            className={styles.trashIcon}
                            icon="line-md:trash"
                            width="30"
                            height="30"
                            onMouseLeave={() =>
                              setIsMouseOverIcon(() => {
                                return {
                                  isOver: false,
                                  noteID: '',
                                };
                              })
                            }
                            onClick={() => handleDeleteNote(clientID, note._id)}
                          />
                        ) : (
                          <Icon
                            className={styles.noteIcon}
                            icon="line-md:document-list"
                            width="30"
                            height="30"
                            onMouseEnter={() =>
                              setIsMouseOverIcon(() => {
                                return {
                                  isOver: true,
                                  noteID: note._id,
                                };
                              })
                            }
                          />
                        )}

                        <div className={styles.noteContentWrapper}>
                          <p className={styles.authorName}>
                            {users.length > 0 &&
                              users.find((user) => user._id === note.author)
                                .name}
                          </p>
                          <div className={styles.noteRow}>
                            <p className={styles.noteText}>{note.text}</p>
                          </div>
                          <div className={styles.dateWrapper}>
                            <DateFormatter dateString={note.date} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Brak notatek</p>
                )}
              </div>
              <div className={styles.ctaWrapper}>
                <button
                  type="button"
                  onClick={openModal}
                  className={styles.openModalBtn}
                >
                  <Icon
                    icon="line-md:plus-circle-filled"
                    width="24"
                    height="24"
                  />
                  Dodaj notatke
                </button>
              </div>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.rightColumnTopBar}>
              <h3>Podsumowanie</h3>
              <div className={styles.selectsWrapper}>
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
            </div>

            <p className={styles.chartTitle}>
              {`[h] Podsumowanie grafików - ${selectedMonth}`}{' '}
            </p>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="70%">
                <BarChart
                  width={500}
                  height={300}
                  data={chartData[0].participants}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="hours"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="#f68c1e" stroke="#f68c1e" />}
                    animationBegin={0}
                    animationDuration={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noTasksContainer}>
                <p>Brak danych</p>
                <Icon icon="line-md:coffee-loop" width="24" height="24" />
              </div>
            )}
            <div className={styles.statsWrapper}>
              <p>{`Suma godzin: ${summedHours}h`}</p>
              <p>{`Przychód: ${
                Number(summedHours) * Number(clientHourRate)
              }zł`}</p>
              <p>{`Ilość zleceń: ${tasksLength}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.noTasksContainer}>
      <p>Brak zleceń</p>
      <Icon icon="line-md:coffee-loop" width="24" height="24" />
    </div>
  );
}

export default ClientProfileViewComponent;
