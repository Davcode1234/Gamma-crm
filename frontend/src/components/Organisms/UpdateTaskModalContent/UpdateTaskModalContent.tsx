import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useEffect, useMemo, useState } from 'react';
import { pl } from 'date-fns/locale';
import DateFormatter from '../../../utils/dateFormatter';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import ModalSectionTitle from '../../Atoms/ModalSectionTitle/ModalSectionTitle';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './UpdateTaskModalContent.module.css';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import useStudioTaskUpdate from '../../../hooks/useStudioTaskUpdate';
import useSubtask from '../../../hooks/useSubtasks';
import useAuth from '../../../hooks/useAuth';
import checkIfUserAssigned from '../../../utils/checkIfUserAssigned';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import {
  getReckoningTask,
  ReckoningTaskTypes,
} from '../../../services/reckoning-view-service';

import {
  getStudioTask,
  UpdateStudioTask,
} from '../../../services/studio-tasks-service';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import handleCopy from '../../../utils/handleCopy';
import StudioTaskReckoTable from '../StudioTaskReckoTable/StudioTaskReckoTable';

function UpdateTaskModalContent({
  task,
  closeModal,
  setDeleteCaptcha,
  companyClass,
  isPlacker,
}) {
  const [assignedReckoTask, setAssignedReckoTask] = useState<
    ReckoningTaskTypes | undefined
  >();
  const [isReckoTaskLoading, setIsReckoTaskLoading] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
  });
  const [isCalendarEditOpen, setIsCalendarEditOpen] = useState({
    isOpen: false,
    position: null,
  });
  const [range, setRange] = useState<DateRange | undefined>({
    from: task.startDate,
    to: task.deadline,
  });
  const [searchIDCopied, setSearchIDCopied] = useState(false);
  const { dispatch } = useStudioTasksContext();
  const [saving, setSaving] = useState(false);
  const isRangeValid = !!(range?.from && range?.to);

  const {
    users,
    companies,
    isEditing,
    setIsEditing,
    isSelectOpen,
    setIsSelectOpen,
    isMemberChangeLoading,
    formValue,
    handleFormChange,
    handleArchiveTask,
    handleBlur,
    handleAddMember,
    handleDeleteMember,
    handleClientChange,
    handleClientPersonChange,
    isUserAssigned,
    setIsUserAssigned,
  } = useStudioTaskUpdate(task, closeModal, isPlacker);

  const {
    handleAddSubtask,
    handleDeleteSubtask,
    handleAddSubtaskInput,
    handleUpdateSubtask,
    handleEditSubtask,
    editSubtaskContent,
    addSubtaskInput,
  } = useSubtask(task);

  const { user: currentUser } = useAuth();

  const getAssignedReckoTask = async () => {
    try {
      setIsReckoTaskLoading(true);
      if (task.reckoTaskID) {
        const reckoTask = await getReckoningTask(task.reckoTaskID);
        if (reckoTask !== null) {
          setAssignedReckoTask(reckoTask);
        } else {
          setAssignedReckoTask(undefined);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsReckoTaskLoading(false);
    }
  };

  useEffect(() => {
    setIsUserAssigned(
      checkIfUserAssigned(task.participants, currentUser[0]._id)
    );
    getAssignedReckoTask();
  }, []);

  const handleFilterDropdownInputValue = (e, key) => {
    const { value } = e.target;
    setSelectFilterValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const filteredUsersForDropdown = users.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.user.toLocaleLowerCase());
  });

  const handleCalendarSave = async () => {
    if (!isRangeValid || saving) return;
    setSaving(true);
    try {
      const updated = await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          startDate: range.from,
          deadline: range.to,
        },
      });

      const res = await getStudioTask(updated._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      setIsCalendarEditOpen({ isOpen: false, position: null });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const totalHours = useMemo(() => {
    if (assignedReckoTask === undefined) return 0;
    return assignedReckoTask.participants.reduce((summ, part) => {
      return (
        summ +
        part.months.reduce((monthSumm, month) => {
          return (
            monthSumm +
            month.hours.reduce(
              (daysSumm, day) => Number(daysSumm) + Number(day.hourNum),
              0
            )
          );
        }, 0)
      );
    }, 0);
  }, [assignedReckoTask]);

  return (
    <>
      <h3 className={styles.editModalTitle}>Edytuj</h3>
      <div className={styles.modalContainer}>
        <div className={styles.infoColumn}>
          {/* <p>{task.title}</p> */}

          <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
            <input
              type="text"
              name="taskTitle"
              id="taskTitle"
              onChange={(e) => {
                handleFormChange(e, 'title');
              }}
              onBlur={handleBlur}
              onClick={() => setIsEditing(true)}
              value={formValue.title}
              className={`${styles.input} ${
                isEditing ? styles.editMode : styles.noEditMode
              }`}
            />
          </ModalSectionTitle>

          <div className={styles.secondSection}>
            <div className={styles.usersContainer}>
              <p className={styles.sectionTitle}>Członkowie</p>
              {task.participants.length > 0 ? (
                <UsersDisplay
                  data={task}
                  usersArray={task.participants}
                  isSmall={false}
                />
              ) : (
                <p className={styles.noParticipantsPar}>Brak członków</p>
              )}
            </div>
            <div>
              <p className={styles.sectionTitle}>Klient</p>
              <div className={styles.clientContainer}>
                <CompanyBatch
                  companyClass={companyClass}
                  isClientPerson={false}
                  isBigger
                >
                  {task.client}
                </CompanyBatch>

                <CompanyBatch companyClass={null} isClientPerson isBigger>
                  {task.clientPerson}
                </CompanyBatch>
              </div>
            </div>
          </div>

          <div className={styles.thirdSection}>
            {isCalendarEditOpen.isOpen &&
              ReactDOM.createPortal(
                <>
                  <div
                    className={styles.overlay}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        setIsCalendarEditOpen(() => {
                          return {
                            isOpen: false,
                            position: null,
                          };
                        });
                      }
                    }}
                    onClick={() => {
                      setIsCalendarEditOpen(() => {
                        return {
                          isOpen: false,
                          position: null,
                        };
                      });
                    }}
                  />

                  <div
                    className={styles.editDateContainer}
                    style={{
                      position: 'absolute',
                      top: isCalendarEditOpen.position?.top ?? 0,
                      left: isCalendarEditOpen.position?.left ?? 0,
                      zIndex: 1000,
                    }}
                  >
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={1}
                      // disabled={{ before: task.startDate }}
                      min={1}
                      max={180}
                      locale={pl}
                    />

                    <div className={styles.buttonsWrapper}>
                      <button
                        type="button"
                        className={`${styles.calendarBtn} ${styles.saveBtn}`}
                        onClick={handleCalendarSave}
                        disabled={!isRangeValid || saving}
                      >
                        {saving ? 'Zapisywanie…' : 'Zapisz'}
                      </button>
                      <button
                        type="button"
                        className={`${styles.calendarBtn} ${styles.abortBtn}`}
                        onClick={() => {
                          setIsCalendarEditOpen(() => {
                            return {
                              isOpen: false,
                              position: null,
                            };
                          });

                          setRange(() => {
                            return {
                              from: task.startDate,
                              to: task.deadline,
                            };
                          });
                        }}
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                </>,

                document.getElementById('calendar-root')
              )}
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  const rect = (
                    e.currentTarget as HTMLElement
                  ).getBoundingClientRect();

                  setIsCalendarEditOpen((prev) => {
                    return {
                      position: {
                        top: rect.bottom + 5 + window.scrollY,
                        left: rect.left + window.scrollX,
                      },
                      isOpen: !prev.isOpen,
                    };
                  });
                }
              }}
              className={styles.cardNumberWrapper}
              onClick={(e) => {
                const rect = (
                  e.target as HTMLButtonElement
                ).getBoundingClientRect();

                setIsCalendarEditOpen((prev) => {
                  return {
                    position: {
                      top: rect.bottom + 5 + window.scrollY,
                      left: rect.left + window.scrollX,
                    },
                    isOpen: !prev.isOpen,
                  };
                });
              }}
            >
              <p className={styles.sectionTitle}>Data</p>
              <div
                className={`${styles.modalDatesWrapper} ${
                  new Date(task.deadline) <= new Date()
                    ? styles.datePast
                    : styles.dateCurrent
                }`}
              >
                {task.deadline && task.startDate ? (
                  <>
                    <DateFormatter dateString={task.startDate} />
                    <span>&nbsp;-&nbsp;</span>
                    <DateFormatter dateString={task.deadline} />
                  </>
                ) : (
                  <p className={styles.noDates}>Brak dat</p>
                )}
              </div>
            </div>
            <div className={styles.searchIDContainer}>
              <p className={styles.sectionTitle}>Numer</p>
              {searchIDCopied ? (
                <div className={styles.copiedInfo}>
                  <span>Skopiowano</span>
                  <Icon icon="line-md:folder-check" width="20" height="20" />
                </div>
              ) : (
                <p
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      handleCopy(task.searchID, setSearchIDCopied);
                    }
                  }}
                  onClick={() => handleCopy(task.searchID, setSearchIDCopied)}
                  className={styles.cardNumber}
                >
                  #{task.searchID}
                </p>
              )}
            </div>
          </div>

          <ModalSectionTitle iconName="mdi:account-clock-outline">
            <p className={styles.descriptionTitle}>Rozliczenie</p>

            <div className={styles.taskHoursSumContainer}>
              <Icon icon="ic:baseline-access-time" width="16" height="16" />
              <p>{totalHours}h</p>
              <p>łącznie</p>
            </div>
          </ModalSectionTitle>

          <div className={`${styles.reckoTableWrapper} `}>
            <StudioTaskReckoTable
              assignedReckoTask={assignedReckoTask}
              isReckoTaskLoading={isReckoTaskLoading}
            />
          </div>

          <ModalSectionTitle iconName="fluent:text-description-ltr-24-filled">
            <p className={styles.descriptionTitle}>Opis</p>
          </ModalSectionTitle>

          <textarea
            name="taskTitle"
            id="taskTitle"
            onChange={(e) => {
              handleFormChange(e, 'description');
            }}
            onBlur={handleBlur}
            // onClick={}
            value={formValue.description}
            className={styles.descriptionInput}
            placeholder="Dodaj opis zlecenia..."
          />

          <ModalSectionTitle iconName="pajamas:task-done">
            <p className={styles.descriptionTitle}>Lista zadań</p>
          </ModalSectionTitle>
          <div className={styles.subtasksContainer}>
            {task.subtasks.map((subtask) => {
              return (
                <div key={subtask._id} className={styles.subtaskContainer}>
                  {editSubtaskContent.isLoading &&
                  editSubtaskContent.subtaskId === subtask._id ? (
                    <CheckboxLoader />
                  ) : (
                    <input
                      type="checkbox"
                      checked={subtask.done}
                      onChange={() => {
                        if (subtask.done) {
                          handleUpdateSubtask(task._id, subtask._id, {
                            done: false,
                          });
                        } else {
                          handleUpdateSubtask(task._id, subtask._id, {
                            done: true,
                          });
                        }
                      }}
                    />
                  )}

                  {editSubtaskContent.isEditing &&
                  editSubtaskContent.subtaskId === subtask._id ? (
                    <input
                      autoFocus
                      type="text"
                      name="subtask content"
                      id="subtask content"
                      className={`${styles.subtaskInput} ${styles.subtaskInputEditMode}`}
                      onChange={(e) => {
                        handleEditSubtask({
                          contentValue: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        handleUpdateSubtask(task._id, subtask._id, {
                          content: editSubtaskContent.contentValue,
                        });

                        handleEditSubtask({
                          contentValue: '',
                          isEditing: false,
                          subtaskId: '',
                        });
                      }}
                      onClick={() => {
                        handleEditSubtask({ isEditing: true });
                      }}
                      value={editSubtaskContent.contentValue}
                    />
                  ) : (
                    <p
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleEditSubtask({
                            contentValue: subtask.content,
                            isEditing: true,
                            subtaskId: subtask._id,
                          });
                        }
                      }}
                      className={styles.subtaskContent}
                      onClick={() => {
                        handleEditSubtask({
                          contentValue: subtask.content,
                          isEditing: true,
                          subtaskId: subtask._id,
                        });
                      }}
                    >
                      {subtask.content}
                    </p>
                  )}

                  <Icon
                    className={styles.trashIcon}
                    icon="solar:trash-bin-minimalistic-broken"
                    width="22"
                    height="22"
                    onClick={() => {
                      handleDeleteSubtask(task._id, subtask._id);
                    }}
                  />
                </div>
              );
            })}
            {!addSubtaskInput.isInputOpen && (
              <button
                type="button"
                className={styles.addSubtaskButton}
                onClick={() =>
                  handleAddSubtaskInput({
                    isInputOpen: !addSubtaskInput.isInputOpen,
                  })
                }
              >
                Dodaj...
              </button>
            )}
            {addSubtaskInput.isInputOpen && (
              <div className={styles.addSubtaskInputWrapper}>
                <input
                  type="text"
                  className={styles.addSubtaskInput}
                  placeholder="Tytuł zadania..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubtask();
                    }
                  }}
                  onChange={(e) => {
                    handleAddSubtaskInput({ inputValue: e.target.value });
                  }}
                  onBlur={handleAddSubtask}
                  autoFocus
                />
                {addSubtaskInput.isSubtaskLoading && <CheckboxLoader />}
              </div>
            )}
          </div>
        </div>
        <div className={styles.actionColumn}>
          <div className={styles.joinContainer}>
            {isMemberChangeLoading.isLoading &&
              isMemberChangeLoading.loadPlace === 'Join' && <CheckboxLoader />}

            <button
              disabled={isMemberChangeLoading.isLoading}
              type="button"
              className={styles.archiveTaskButton}
              onClick={() => {
                if (!isUserAssigned) {
                  handleAddMember(currentUser[0]._id, 'Join');
                  setIsUserAssigned(true);
                } else {
                  handleDeleteMember(currentUser[0]._id, 'Join');
                  setIsUserAssigned(false);
                }
              }}
            >
              {isUserAssigned ? 'Odejdź' : 'Dołącz'}
            </button>
          </div>

          <MultiselectDropdown
            isSelectOpen={isSelectOpen}
            setIsSelectOpen={setIsSelectOpen}
            label="Członkowie"
            inputKey="user"
            inputValue={selectFilterValue.user}
            handleInputValue={handleFilterDropdownInputValue}
            isBigger={false}
            isSquare={false}
          >
            {filteredUsersForDropdown.map((user) => {
              const isUserChecked = checkIfUserAssigned(
                task.participants,
                user._id
              );
              return (
                user._id !== currentUser[0]._id && (
                  <div key={user._id} className={styles.userWrapper}>
                    {isMemberChangeLoading.isLoading &&
                    user.name === isMemberChangeLoading.userName &&
                    isMemberChangeLoading.loadPlace === 'Select' ? (
                      <CheckboxLoader />
                    ) : (
                      <input
                        className={styles.checkInput}
                        type="checkbox"
                        checked={isUserChecked}
                        onChange={() => {
                          if (isUserChecked) {
                            handleDeleteMember(user._id, 'Select');
                            setIsSelectOpen(true);
                          } else {
                            handleAddMember(user._id, 'Select');
                            setIsSelectOpen(true);
                          }
                        }}
                      />
                    )}

                    <p
                      role="button"
                      tabIndex={0}
                      className={styles.userPar}
                      onClick={() => {
                        if (isUserChecked) {
                          handleDeleteMember(user._id, 'Select');
                          setIsSelectOpen(true);
                        } else {
                          handleAddMember(user._id, 'Select');
                          setIsSelectOpen(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (isUserChecked) {
                            handleDeleteMember(user._id, 'Select');
                          } else {
                            handleAddMember(user._id, 'Select');
                          }
                          setIsSelectOpen(true);
                        }
                      }}
                    >
                      {user.name}
                    </p>
                  </div>
                )
              );
            })}
          </MultiselectDropdown>

          <select
            onChange={(e) => {
              handleClientChange(e);
            }}
            className={styles.selectInput}
          >
            <option value="Firma">{formValue.client}</option>
            {companies.map((company) => {
              return (
                company.name !== formValue.client && (
                  <option key={company._id} value={company.name}>
                    {company.name}
                  </option>
                )
              );
            })}
          </select>
          <select
            onChange={(e) => {
              handleClientPersonChange(e);
            }}
            className={styles.selectInput}
          >
            <option value="Klient">{formValue.clientPerson}</option>
            {formValue.client.length > 0 &&
              companies.map((company) => {
                if (company.name === formValue.client) {
                  return company.clientPerson.map((cp) => {
                    return (
                      cp.name !== formValue.clientPerson && (
                        <option key={cp.name} value={cp.name}>
                          {cp.name}
                        </option>
                      )
                    );
                  });
                }
                return null;
              })}
          </select>

          <button
            className={styles.archiveTaskButton}
            onClick={() => handleArchiveTask(task._id)}
            type="button"
          >
            Zarchiwizuj
          </button>
          <button
            className={styles.deleteTaskButton}
            type="button"
            onClick={() => setDeleteCaptcha(true)}
          >
            Usuń
          </button>
        </div>
      </div>
    </>
  );
}

export default UpdateTaskModalContent;
