import { useState } from 'react';
import {
  ReckoningTaskTypes,
  updateReckoningTask,
} from '../../../../services/reckoning-view-service';
import summarizeCompanyProfHours from '../../../../utils/summarizeCompanyProfHours';
import UsersDisplay from '../../UsersDisplay/UsersDisplay';
import styles from './CompanyProfileRow.module.css';
import useModal from '../../../../hooks/useModal';
import ModalTemplate from '../../../Templates/ModalTemplate/ModalTemplate';
import CompanyProfileModalTaskDetails from '../CompanyProfileModalTaskDetails/CompanyProfileModalTaskDetails';

const tileClass = (tileIndex) => {
  return tileIndex % 2 === 0
    ? styles.reckoningTaskListElement
    : styles.darkerReckoningTaskListElement;
};

const tileHeight = (participantsLength) => {
  return participantsLength >= 5 ? styles.bigTile : styles.smallTile;
};

type CompanyProfileRowProps = {
  task: ReckoningTaskTypes;
  index: number;
  currentMonthIndex: number;
  companyHourRate: string;
};

function CompanyProfileRow({
  task,
  index,
  currentMonthIndex,
  companyHourRate,
}: CompanyProfileRowProps) {
  const [isChecked, setIsChecked] = useState({
    checkedID: task._id,
    checkedValue: task.isSettled,
  });

  const {
    showModal: taskShowModal,
    exitAnim: taskExitAnim,
    openModal: taskOpenModal,
    closeModal: taskCloseModal,
  } = useModal();

  const companyClass = task.client.split(' ').join('');

  const handleCheckboxChange = async (e, taskId) => {
    try {
      const res = await updateReckoningTask({
        taskId,
        value: {
          isSettled: e.target.checked,
        },
      });

      if (res) {
        setIsChecked(() => {
          return {
            checkedID: taskId,
            checkedValue: !e.target.checked,
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <ModalTemplate
        isOpen={taskShowModal}
        onClose={() => {
          taskCloseModal();
        }}
        exitAnim={taskExitAnim}
      >
        <CompanyProfileModalTaskDetails
          task={task}
          companyClass={companyClass}
        />
      </ModalTemplate>
      <div
        key={task._id}
        className={`${tileClass(index)}  ${
          isChecked.checkedValue && isChecked.checkedID === task._id
            ? styles.checked
            : null
        } ${tileHeight(task.participants.length)}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            taskOpenModal();
          }
        }}
        onClick={() => taskOpenModal()}
      >
        <div className={styles.reckoningTaskListElementTile}>
          <input
            type="checkbox"
            className={styles.cprtCheckbox}
            checked={isChecked.checkedValue}
            onChange={(e) => {
              handleCheckboxChange(e, task._id);
            }}
          />
          <p>{task.searchID}</p>
        </div>

        <div className={`${styles.reckoningTaskListElementTile}`}>
          <p>{task.client}</p>
        </div>
        <div className={styles.reckoningTaskListElementTile}>
          <p>{task.clientPerson}</p>
        </div>

        <div className={styles.reckoningTaskListElementTile}>
          <UsersDisplay
            data={task}
            usersArray={task.participants}
            isSmall={false}
          />
        </div>
        <div className={styles.reckoningTaskListElementTile}>
          <p>{task.title}</p>
        </div>

        <div className={styles.reckoningTaskListElementTile}>
          <p>{task.comment}</p>
        </div>
        <div className={styles.reckoningTaskListElementTile}>
          <p>{summarizeCompanyProfHours(task, currentMonthIndex)}</p>
        </div>

        <div className={styles.reckoningTaskListElementTile}>
          <p>
            {summarizeCompanyProfHours(task, currentMonthIndex) *
              Number(companyHourRate)}{' '}
            zł
          </p>
        </div>
        <div className={styles.reckoningTaskListElementTile}>
          <p>{task.printWhere}</p>
        </div>
      </div>
    </>
  );
}

export default CompanyProfileRow;
