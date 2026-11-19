import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  ClientReckoTask,
  updateClientReckoTask,
} from '../../../../services/client-portal-service';
import summarizeCompanyProfHours from '../../../../utils/summarizeCompanyProfHours';
import UserInitialBatch from '../../../Atoms/UserInitialsBatch/UserInitialsBatch';
import { User } from '../../../../services/users-service';
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
  const [isReadyForInvoice, setIsReadyForInvoice] = useState(
    Boolean(task.isReadyForInvoice)
  );
  const [orderId, setOrderId] = useState(task.clientOrderId ?? '');
  const [savedOrderId, setSavedOrderId] = useState(task.clientOrderId ?? '');

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

  // Green when the client marked it ready for invoicing, blue when it is
  // settled. Same colors as the company profile.
  const rowColorClass = () => {
    if (task.isSettled) return styles.settled;
    if (isReadyForInvoice) return styles.readyForInvoice;
    return '';
  };

  // Share of the agreed hours already used, e.g. 6 of 12h = 50%.
  const budgetPercent = task.agreedHours
    ? Math.round((task.usedHours / task.agreedHours) * 100)
    : null;

  const handleReadyChange = async (e) => {
    const { checked } = e.target;
    setIsReadyForInvoice(checked);
    try {
      await updateClientReckoTask({
        taskId: task._id,
        value: { isReadyForInvoice: checked },
      });
    } catch (error) {
      console.error(error);
      setIsReadyForInvoice(!checked);
    }
  };

  const handleOrderIdBlur = async () => {
    const trimmedOrderId = orderId.trim();
    if (trimmedOrderId === savedOrderId) {
      setOrderId(savedOrderId);
      return;
    }
    try {
      await updateClientReckoTask({
        taskId: task._id,
        value: { clientOrderId: trimmedOrderId },
      });
      setOrderId(trimmedOrderId);
      setSavedOrderId(trimmedOrderId);
    } catch (error) {
      console.error(error);
      setOrderId(savedOrderId);
    }
  };

  return (
    <div
      className={`${
        index % 2 === 0 ? styles.row : `${styles.row} ${styles.darkerRow}`
      } ${rowColorClass()}`}
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
        {participantsWithHours.map(({ participant }) => (
          <div className={styles.participantHours} key={participant._id}>
            <UserInitialBatch user={participant as unknown as User} isSmaller />
          </div>
        ))}
      </div>
      <div className={styles.tile}>
        <p>{task.usedHours}h</p>
      </div>
      <div className={`${styles.tile} ${styles.budgetTile}`}>
        {budgetPercent === null ? (
          <p>—</p>
        ) : (
          <>
            <Icon icon="mdi:timer-sand" className={styles.budgetIcon} />
            <div className={styles.budgetBar}>
              <div
                className={styles.budgetBarFill}
                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
              />
            </div>
            <p className={styles.budgetPercent}>{budgetPercent}%</p>
            <span className={styles.budgetTooltip}>
              Wykorzystano {Math.round(task.usedHours * 10) / 10} z{' '}
              {task.agreedHours}h
            </span>
          </>
        )}
      </div>
      <div className={styles.tile}>
        <input
          type="text"
          className={styles.orderIdInput}
          placeholder="Wpisz numer"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onBlur={handleOrderIdBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
        />
      </div>
      <div className={styles.tile}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isReadyForInvoice}
          disabled={task.isSettled}
          onChange={handleReadyChange}
          title={
            task.isSettled
              ? 'Zlecenie jest już rozliczone'
              : 'Oznacz jako gotowe do faktury'
          }
        />
      </div>
      <div className={styles.tile}>
        <p>{task.isSettled ? 'Tak' : 'Nie'}</p>
      </div>
    </div>
  );
}

export default ClientPortalRow;
