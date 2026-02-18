import { ReckoningTaskTypes } from '../../../../services/reckoning-view-service';
import ModalSectionTitle from '../../../Atoms/ModalSectionTitle/ModalSectionTitle';
import StudioTaskReckoTable from '../../StudioTaskReckoTable/StudioTaskReckoTable';
import styles from './CompanyProfileModalTaskDetails.module.css';

type CompanyProfileModalTaskDetailsProp = {
  task: ReckoningTaskTypes;
};

function CompanyProfileModalTaskDetails({
  task,
}: CompanyProfileModalTaskDetailsProp) {
  return (
    <>
      <h3 className={styles.editModalTitle}>Szczegóły zlecenia</h3>

      <div className={styles.modalContainer}>
        <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
          <p className={styles.title}>{task.title}</p>
        </ModalSectionTitle>
        <ModalSectionTitle iconName="pajamas:task-done">
          <p className={styles.title}>Rozliczenie</p>
        </ModalSectionTitle>
        <StudioTaskReckoTable
          assignedReckoTask={task}
          isReckoTaskLoading={false}
        />
      </div>
    </>
  );
}

export default CompanyProfileModalTaskDetails;
