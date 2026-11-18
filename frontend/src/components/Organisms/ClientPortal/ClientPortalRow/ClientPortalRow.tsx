import { ClientReckoTask } from '../../../../services/client-portal-service';
import summarizeCompanyProfHours from '../../../../utils/summarizeCompanyProfHours';
import useModal from '../../../../hooks/useModal';
import ModalTemplate from '../../../Templates/ModalTemplate/ModalTemplate';
import UserInitialBatch from '../../../Atoms/UserInitialsBatch/UserInitialsBatch';
import { User } from '../../../../services/users-service';
import ClientPortalTaskDetails from '../ClientPortalTaskDetails/ClientPortalTaskDetails';
import styles from './ClientPortalRow.module.css';

type ClientPortalRowProps = {
  task: ClientReckoTask;
  index: number;
  currentMonthIndex: number;
  selectedYear: number;
};

function ClientPortalRow({
  task,
  index,
  currentMonthIndex,
  selectedYear,
}: ClientPortalRowProps) {
  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const participantsWithHours = task.participants
    .map((participant) => ({
      participant,
      hours: summarizeCompanyProfHours(
        { participants: [participant] },
        currentMonthIndex,
        selectedYear
      ),
    }))
    .filter(({ hours }) => hours > 0);

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <ClientPortalTaskDetails task={task} />
      </ModalTemplate>
      <div
        className={`${
          index % 2 === 0 ? styles.row : `${styles.row} ${styles.darkerRow}`
        } ${task.isSettled ? styles.settled : ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') openModal();
        }}
        onClick={() => openModal()}
      >
        <div className={styles.tile}>
          <p>{task.searchID}</p>
        </div>
        <div className={styles.tile}>
          <p>{task.clientPerson}</p>
        </div>
        <div className={styles.tile}>
          <p>{task.title}</p>
        </div>
        <div className={`${styles.tile} ${styles.participantsTile}`}>
          {participantsWithHours.map(({ participant, hours }) => (
            <div className={styles.participantHours} key={participant._id}>
              <UserInitialBatch
                user={participant as unknown as User}
                isSmaller
              />
              <p>
                {participant.name}: {hours}h
              </p>
            </div>
          ))}
        </div>
        <div className={styles.tile}>
          <p>
            {summarizeCompanyProfHours(task, currentMonthIndex, selectedYear)}h
          </p>
        </div>
        <div className={styles.tile}>
          <p>{task.isSettled ? 'Tak' : 'Nie'}</p>
        </div>
      </div>
    </>
  );
}

export default ClientPortalRow;
