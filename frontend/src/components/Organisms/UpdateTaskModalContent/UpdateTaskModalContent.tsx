import { Icon } from '@iconify/react';
import 'react-day-picker/style.css';
import { useEffect, useMemo, useState } from 'react';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import ModalSectionTitle from '../../Atoms/ModalSectionTitle/ModalSectionTitle';
import styles from './UpdateTaskModalContent.module.css';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import useStudioTaskUpdate from '../../../hooks/useStudioTaskUpdate';
import useSubtask from '../../../hooks/useSubtasks';
import useAuth from '../../../hooks/useAuth';
import checkIfUserAssigned from '../../../utils/checkIfUserAssigned';
import {
  getReckoningTask,
  ReckoningTaskTypes,
} from '../../../services/reckoning-view-service';
import handleCopy from '../../../utils/handleCopy';
import StudioTaskReckoTable from '../StudioTaskReckoTable/StudioTaskReckoTable';
import HoursSummaryBadge from '../../Atoms/HoursSummaryBadge/HoursSummaryBadge';
import SearchIdCopyBadge from '../../Molecules/SearchIdCopyBadge/SearchIdCopyBadge';
import useCalendar from '../../../hooks/useCalendar';
import TaskDateRangeEditor from '../../Molecules/TaskRange/TaskDateRangeEditor/TaskDateRangeEditor';
import TaskRangeTrigger from '../../Molecules/TaskRange/TaskRangeTrigger/TaskRangeTrigger';
import ModalMetaInfoSection from '../../Molecules/ModalMetaInfoSection/ModalMetaInfoSection';
import { StudioTaskTypes } from '../../../services/studio-tasks-service';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

type UpdateTaskModalContentProps = {
  task: StudioTaskTypes;
  closeModal: () => void;
  setDeleteCaptcha: React.Dispatch<React.SetStateAction<boolean>>;
  companyClass: string;
  isPlacker: boolean;
};

function UpdateTaskModalContent({
  task,
  closeModal,
  setDeleteCaptcha,
  companyClass,
  isPlacker,
}: UpdateTaskModalContentProps) {
  const [assignedReckoTask, setAssignedReckoTask] = useState<
    ReckoningTaskTypes | undefined
  >();
  const [isReckoTaskLoading, setIsReckoTaskLoading] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
  });

  console.log(task, closeModal, setDeleteCaptcha, companyClass, isPlacker);

  const [searchIDCopied, setSearchIDCopied] = useState(false);

  const { isCalendarEditOpen, setIsCalendarEditOpen } = useCalendar(task);

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
    handleDescriptionChange,
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

          <div className={styles.metaInfoWrapper}>
            <ModalMetaInfoSection task={task} companyClass={companyClass} />
          </div>

          <div className={styles.thirdSection}>
            <TaskDateRangeEditor
              task={task}
              isCalendarEditOpen={isCalendarEditOpen}
              setIsCalendarEditOpen={setIsCalendarEditOpen}
            />
            <TaskRangeTrigger
              task={task}
              setIsCalendarEditOpen={setIsCalendarEditOpen}
            />
            <SearchIdCopyBadge
              searchIDCopied={searchIDCopied}
              setSearchIDCopied={setSearchIDCopied}
              handleCopy={handleCopy}
              id={task.searchID}
            />
          </div>

          <ModalSectionTitle iconName="mdi:account-clock-outline">
            <p className={styles.descriptionTitle}>Rozliczenie</p>

            <HoursSummaryBadge totalHours={totalHours} />
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

          {/* <textarea
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
          /> */}

          <div className={styles.richTextContainer}>
            <RichTextEditor
              value={formValue.description}
              placeholder="Opis"
              hasError={false}
              onChange={handleDescriptionChange}
              onBlur={handleBlur}
            />
          </div>

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
