import { ClientReckoTask } from '../../../../services/client-portal-service';
import ModalSectionTitle from '../../../Atoms/ModalSectionTitle/ModalSectionTitle';
import StudioTaskReckoTable from '../../StudioTaskReckoTable/StudioTaskReckoTable';
import styles from './ClientPortalTaskDetails.module.css';

type ClientPortalTaskDetailsProps = {
  task: ClientReckoTask;
};

function ClientPortalTaskDetails({ task }: ClientPortalTaskDetailsProps) {
  return (
    <>
      <h3 className={styles.modalTitle}>Szczegóły zlecenia</h3>

      <div className={styles.modalContainer}>
        <div className={styles.infoColumn}>
          <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
            <p className={styles.title}>{task.title}</p>
          </ModalSectionTitle>
          <div className={styles.sectionContainer}>
            <dl className={styles.metaList}>
              <dt>Numer</dt>
              <dd>{task.searchID}</dd>
              <dt>Firma</dt>
              <dd>{task.client}</dd>
              <dt>Klient</dt>
              <dd>{task.clientPerson || '—'}</dd>
              {task.taskType && (
                <>
                  <dt>Typ</dt>
                  <dd>{task.taskType}</dd>
                </>
              )}
              <dt>Rozliczone</dt>
              <dd>{task.isSettled ? 'Tak' : 'Nie'}</dd>
            </dl>
          </div>
          <ModalSectionTitle iconName="pajamas:task-done">
            <p className={styles.title}>Godziny</p>
          </ModalSectionTitle>
          <div className={styles.sectionContainer}>
            <StudioTaskReckoTable
              assignedReckoTask={task}
              isReckoTaskLoading={false}
              disableUserLinks
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientPortalTaskDetails;
