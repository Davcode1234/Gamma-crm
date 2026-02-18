import { ReckoningTaskTypes } from '../../../services/reckoning-view-service';
import { StudioTaskTypes } from '../../../services/studio-tasks-service';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import UsersDisplay from '../../Organisms/UsersDisplay/UsersDisplay';
import styles from './ModalMetaInfoSection.module.css';

type ModalMetaInfoSectionProps = {
  task: ReckoningTaskTypes | StudioTaskTypes;
  companyClass: string;
};

function ModalMetaInfoSection({
  task,
  companyClass,
}: ModalMetaInfoSectionProps) {
  return (
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
  );
}

export default ModalMetaInfoSection;
