import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Icon } from '@iconify/react';
import styles from './DraggableCard.module.css';
import UsersDisplay from '../../Organisms/UsersDisplay/UsersDisplay';
import DateFormatter from '../../../utils/dateFormatter';
import ModalTemplate from '../../Templates/ModalTemplate/ModalTemplate';
import useModal from '../../../hooks/useModal';
import Captcha from '../Captcha/Captcha';
import useAuth from '../../../hooks/useAuth';
import useStudioTaskUpdate from '../../../hooks/useStudioTaskUpdate';
import checkIfUserAssigned from '../../../utils/checkIfUserAssigned';
import UpdateTaskModalContent from '../../Organisms/UpdateTaskModalContent/UpdateTaskModalContent';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import handleCopy from '../../../utils/handleCopy';

function DraggableCard({ task, index, doneSubtasks = 0, isDragAllowed }) {
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [searchIDCopied, setSearchIDCopied] = useState(false);

  const [deleteCaptcha, setDeleteCaptcha] = useState(false);
  const { user: currentUser } = useAuth();

  const { handleDeleteTask, setIsUserAssigned } = useStudioTaskUpdate(
    task,
    closeModal
  );

  const taskClass =
    task.participants.length > 4 ? styles.taskHigher : styles.task;

  const dragDisabledClass = isDragAllowed ? '' : styles.dragDisabled;

  const companyClass = task.client.split(' ').join('');

  const subtasksLength = task.subtasks.length;

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        {deleteCaptcha ? (
          <Captcha
            handleDeleteCompany={handleDeleteTask}
            setDeleteCaptcha={setDeleteCaptcha}
            id={task._id}
          />
        ) : (
          // task={task} users={users} companies={companies} isEditing={isEditing} setIsEditing={setIsEditing} isSelectOpen={isSelectOpen}  setIsSelectOpen={setIsSelectOpen} isMemberChangeLoading={isMemberChangeLoading} formValue={formValue} handleFormChange={handleFormChange} handleArchiveTask={handleArchiveTask} handleBlur={handleBlur} handleAddMember={handleAddMember} handleDeleteMember={handleDeleteMember} handleClientChange={handle}
          <UpdateTaskModalContent
            task={task}
            closeModal={closeModal}
            setDeleteCaptcha={setDeleteCaptcha}
            companyClass={companyClass}
          />
        )}
      </ModalTemplate>
      <Draggable
        draggableId={String(task._id)}
        index={index}
        isDragDisabled={!isDragAllowed}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={dragDisabledClass}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setIsUserAssigned(
                  checkIfUserAssigned(task.participants, currentUser[0]._id)
                );

                openModal();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openModal();
                }
              }}
              style={{
                opacity: snapshot.isDragging ? 0.9 : 1,
                transform: snapshot.isDragging ? 'scale(0.95)' : '',
              }}
              className={taskClass}
            >
              <div className={styles.clientInfoWrapper}>
                <CompanyBatch
                  companyClass={companyClass}
                  isClientPerson={false}
                  isBigger={false}
                >
                  {task.client}
                </CompanyBatch>

                <CompanyBatch
                  companyClass={null}
                  isClientPerson
                  isBigger={false}
                >
                  {task.clientPerson}
                </CompanyBatch>
              </div>

              <span
                className={styles.searchID}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    e.stopPropagation();
                    e.preventDefault();
                    handleCopy(task.searchID, setSearchIDCopied);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCopy(task.searchID, setSearchIDCopied);
                }}
              >
                #{task.searchID}
                {searchIDCopied && (
                  <Icon
                    icon="line-md:folder-check"
                    width="20"
                    height="20"
                    className={styles.copiedIcon}
                  />
                )}
              </span>
              {/* <span>{`${task.reckoTaskID}`}</span> */}
              <p className={styles.taskTitle}>{task.title}</p>
              <div className={styles.userDisplayWrapper}>
                <UsersDisplay data={task} usersArray={task.participants} />
              </div>
              <div className={styles.datesWrapper}>
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
              <div className={styles.subtasksCountWrapper}>
                {doneSubtasks === subtasksLength ? (
                  <Icon
                    icon="material-symbols:task-alt"
                    width="12"
                    height="12"
                    className={styles.greenDoneSubtasksIcon}
                  />
                ) : (
                  <Icon
                    icon="material-symbols:task-alt"
                    width="12"
                    height="12"
                  />
                )}
                <div>
                  <span>{doneSubtasks}/</span>
                  <span>{subtasksLength}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}

export default DraggableCard;
