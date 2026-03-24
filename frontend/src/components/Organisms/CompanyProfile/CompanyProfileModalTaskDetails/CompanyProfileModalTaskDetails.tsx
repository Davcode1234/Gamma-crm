import { ReckoningTaskTypes } from '../../../../services/reckoning-view-service';
import ModalSectionTitle from '../../../Atoms/ModalSectionTitle/ModalSectionTitle';
import ModalMetaInfoSection from '../../../Molecules/ModalMetaInfoSection/ModalMetaInfoSection';
import StudioTaskReckoTable from '../../StudioTaskReckoTable/StudioTaskReckoTable';
import styles from './CompanyProfileModalTaskDetails.module.css';

type CompanyProfileModalTaskDetailsProp = {
  task: ReckoningTaskTypes;
  companyClass: string;
};

function CompanyProfileModalTaskDetails({
  task,
  companyClass,
}: CompanyProfileModalTaskDetailsProp) {
  return (
    <>
      <h3 className={styles.editModalTitle}>Szczegóły zlecenia</h3>

      <div className={styles.modalContainer}>
        <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
          <p className={styles.title}>{task.title}</p>
        </ModalSectionTitle>
        <div className={styles.sectionContainer}>
          <ModalMetaInfoSection task={task} companyClass={companyClass} />
        </div>
        <ModalSectionTitle iconName="pajamas:task-done">
          <p className={styles.title}>Rozliczenie</p>
        </ModalSectionTitle>
        <div className={styles.sectionContainer}>
          <StudioTaskReckoTable
            assignedReckoTask={task}
            isReckoTaskLoading={false}
          />
        </div>
        <ModalSectionTitle iconName="fluent:text-description-ltr-24-filled">
          <p className={styles.title}>Opis</p>
        </ModalSectionTitle>
        <div className={styles.sectionContainer}>
          {task.description ? <p>{task.description}</p> : <p>Brak opisu</p>}
        </div>
      </div>
    </>
  );
}

export default CompanyProfileModalTaskDetails;
