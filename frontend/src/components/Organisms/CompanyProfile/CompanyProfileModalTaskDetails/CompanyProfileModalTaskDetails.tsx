import { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  ReckoningTaskTypes,
  updateReckoningTask,
} from '../../../../services/reckoning-view-service';
import {
  getStudioTask,
  UpdateStudioTask,
} from '../../../../services/studio-tasks-service';
import {
  getArchivedStudioTask,
  updateArchivedStudioTask,
} from '../../../../services/archived-studio-tasks-service';
import socket from '../../../../socket';
import useStudioTasksContext from '../../../../hooks/Context/useStudioTasksContext';
import ModalSectionTitle from '../../../Atoms/ModalSectionTitle/ModalSectionTitle';
import ModalMetaInfoSection from '../../../Molecules/ModalMetaInfoSection/ModalMetaInfoSection';
import StudioTaskReckoTable from '../../StudioTaskReckoTable/StudioTaskReckoTable';
import styles from './CompanyProfileModalTaskDetails.module.css';

type CompanyProfileModalTaskDetailsProp = {
  task: ReckoningTaskTypes;
  companyClass: string;
  onTaskChange?: (changes: Partial<ReckoningTaskTypes>) => void;
};

function CompanyProfileModalTaskDetails({
  task,
  companyClass,
  onTaskChange,
}: CompanyProfileModalTaskDetailsProp) {
  const sanitizedDescription = task.description
    ? DOMPurify.sanitize(task.description)
    : '';

  const { dispatch: studioTasksDispatch } = useStudioTasksContext();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [savedTitle, setSavedTitle] = useState(task.title);
  const [clientFields, setClientFields] = useState({
    agreedHours: task.agreedHours?.toString() ?? '',
    clientOrderId: task.clientOrderId ?? '',
  });

  const updateRelatedStudioTask = async (newTitle: string) => {
    const studioTaskId = task.idOfAssignedStudioTask;
    if (!studioTaskId) return;

    const studioTask = await getStudioTask(studioTaskId);
    if (studioTask) {
      const updatedStudioTask = await UpdateStudioTask({
        id: studioTaskId,
        studioTaskData: { ...studioTask, title: newTitle },
      });
      if (updatedStudioTask) {
        const freshStudioTask = await getStudioTask(studioTaskId);
        if (freshStudioTask) {
          studioTasksDispatch({
            type: 'UPDATE_STUDIOTASK',
            payload: freshStudioTask,
          });
          socket.emit('tasksUpdated', freshStudioTask);
        }
      }
      return;
    }

    const archivedStudioTask = await getArchivedStudioTask(studioTaskId);
    if (archivedStudioTask) {
      await updateArchivedStudioTask({
        id: studioTaskId,
        value: { title: newTitle },
      });
    }
  };

  const handleTitleBlur = async () => {
    setIsEditing(false);
    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle === savedTitle) {
      setTitle(savedTitle);
      return;
    }

    try {
      const updatedReckoTask = await updateReckoningTask({
        taskId: task._id,
        value: { title: trimmedTitle },
      });
      if (!updatedReckoTask) {
        setTitle(savedTitle);
        return;
      }
      setTitle(trimmedTitle);
      setSavedTitle(trimmedTitle);
      onTaskChange?.({ title: trimmedTitle });

      await updateRelatedStudioTask(trimmedTitle);
    } catch (error) {
      console.error('Error updating task title:', error);
    }
  };

  // Saves "Ustalone godziny" and "Nr zamówienia klienta" when the input
  // loses focus. An empty hours input clears the value.
  const handleClientFieldBlur = async (
    field: 'agreedHours' | 'clientOrderId'
  ) => {
    const inputValue = clientFields[field].trim();
    const savedValue = task[field]?.toString() ?? '';

    const isInvalidHours =
      field === 'agreedHours' && Number.isNaN(Number(inputValue));

    if (inputValue === savedValue || isInvalidHours) {
      setClientFields((prev) => ({ ...prev, [field]: savedValue }));
      return;
    }

    let value: string | number | null = inputValue;
    if (field === 'agreedHours') {
      value = inputValue === '' ? null : Number(inputValue);
    }

    try {
      const updatedReckoTask = await updateReckoningTask({
        taskId: task._id,
        value: { [field]: value },
      });
      if (updatedReckoTask) {
        onTaskChange?.({ [field]: value ?? undefined });
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  return (
    <>
      <h3 className={styles.editModalTitle}>Szczegóły zlecenia</h3>

      <div className={styles.modalContainer}>
        <div className={styles.infoColumn}>
          <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
            <input
              type="text"
              name="taskTitle"
              id="taskTitle"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onFocus={() => setIsEditing(true)}
              value={title}
              className={isEditing ? styles.editMode : styles.noEditMode}
            />
          </ModalSectionTitle>
          <div className={styles.sectionContainer}>
            <ModalMetaInfoSection task={task} companyClass={companyClass} />
          </div>
          <ModalSectionTitle iconName="mdi:account-tie-outline">
            <p className={styles.title}>Dane klienta</p>
          </ModalSectionTitle>
          <div className={`${styles.sectionContainer} ${styles.clientFields}`}>
            <label htmlFor="agreedHours" className={styles.clientField}>
              Ustalone godziny
              <input
                type="number"
                min="0"
                step="0.5"
                id="agreedHours"
                value={clientFields.agreedHours}
                onChange={(e) =>
                  setClientFields((prev) => ({
                    ...prev,
                    agreedHours: e.target.value,
                  }))
                }
                onBlur={() => handleClientFieldBlur('agreedHours')}
              />
            </label>
            <label htmlFor="clientOrderId" className={styles.clientField}>
              Nr zamówienia klienta
              <input
                type="text"
                id="clientOrderId"
                value={clientFields.clientOrderId}
                onChange={(e) =>
                  setClientFields((prev) => ({
                    ...prev,
                    clientOrderId: e.target.value,
                  }))
                }
                onBlur={() => handleClientFieldBlur('clientOrderId')}
              />
            </label>
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
            {sanitizedDescription ? (
              <div
                className={styles.description}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizedDescription,
                }}
              />
            ) : (
              <p className={styles.emptyDescription}>Brak opisu</p>
            )}
          </div>
          <ModalSectionTitle iconName="bx:comment-detail">
            <p className={styles.title}>Komentarz</p>
          </ModalSectionTitle>

          <div className={styles.sectionContainer}>
            {task.comment ? (
              <p>{task.comment}</p>
            ) : (
              <p className={styles.emptyDescription}>Brak komentarza</p>
            )}
          </div>
          <ModalSectionTitle iconName="bytesize:print">
            <p className={styles.title}>Druk</p>
          </ModalSectionTitle>
          <div className={styles.sectionContainer}>
            {task.printWhat || task.printWhere ? (
              <div>
                {task.printWhat && (
                  <p>
                    <strong>CO: </strong>
                    {task.printWhat}
                  </p>
                )}
                {task.printWhere && (
                  <p>
                    <strong>GDZIE:</strong> {task.printWhere}
                  </p>
                )}
              </div>
            ) : (
              <p className={styles.emptyDescription}>Brak danych</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyProfileModalTaskDetails;
