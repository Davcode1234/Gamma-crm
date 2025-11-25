import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { statusNames } from '../../../statuses';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import styles from './PlackerCard.module.css';
import DateFormatter from '../../../utils/dateFormatter';
import UsersDisplay from '../../Organisms/UsersDisplay/UsersDisplay';
import ModalTemplate from '../../Templates/ModalTemplate/ModalTemplate';
import UpdateTaskModalContent from '../../Organisms/UpdateTaskModalContent/UpdateTaskModalContent';
import Captcha from '../Captcha/Captcha';
import useModal from '../../../hooks/useModal';
import useStudioTaskUpdate from '../../../hooks/useStudioTaskUpdate';
import checkIfUserAssigned from '../../../utils/checkIfUserAssigned';
import useAuth from '../../../hooks/useAuth';

function PlackerCard({ task, index, isDragAllowed, userId }) {
  const companyClass = task.client.split(' ').join('');
  const dragDisabledClass = isDragAllowed ? '' : styles.dragDisabled;
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [deleteCaptcha, setDeleteCaptcha] = useState(false);
  const { user: currentUser } = useAuth();

  const { handleDeleteTask, setIsUserAssigned } = useStudioTaskUpdate(
    task,
    closeModal,
    true
  );

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
            isPlacker
          />
        )}
      </ModalTemplate>
      <Draggable
        draggableId={`${userId}_${task._id}`}
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
              className={styles.card}
              style={{
                opacity: snapshot.isDragging ? 0.9 : 1,
                transform: snapshot.isDragging ? 'scale(0.95)' : '',
              }}
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
              <p className={styles.title}>{task.title}</p>
              <p className={styles.statusName}>{statusNames[task.status]}</p>
              <div className={styles.userDisplayWrapper}>
                <UsersDisplay
                  data={task}
                  usersArray={task.participants}
                  isSmall
                />
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
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}

export default PlackerCard;
