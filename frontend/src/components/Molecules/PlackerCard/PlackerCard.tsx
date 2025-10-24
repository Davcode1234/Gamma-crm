import { statusNames } from '../../../statuses';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import styles from './PlackerCard.module.css';

function PlackerCard({ task }) {
  const companyClass = task.client.split(' ').join('');

  return (
    <div className={styles.card}>
      <div className={styles.clientInfoWrapper}>
        <CompanyBatch
          companyClass={companyClass}
          isClientPerson={false}
          isBigger={false}
        >
          {task.client}
        </CompanyBatch>

        <CompanyBatch companyClass={null} isClientPerson isBigger={false}>
          {task.clientPerson}
        </CompanyBatch>
      </div>
      <p className={styles.title}>{task.title}</p>
      <p className={styles.statusName}>{statusNames[task.status]}</p>
    </div>
  );
}

export default PlackerCard;
