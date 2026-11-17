import DOMPurify from 'dompurify';
import { ReckoningTaskTypes } from '../../../../services/reckoning-view-service';
import ModalSectionTitle from '../../../Atoms/ModalSectionTitle/ModalSectionTitle';
import ModalMetaInfoSection from '../../../Molecules/ModalMetaInfoSection/ModalMetaInfoSection';
import StudioTaskReckoTable from '../../StudioTaskReckoTable/StudioTaskReckoTable';
import styles from './CompanyProfileModalTaskDetails.module.css';
import useStudioTaskUpdate from '../../../../hooks/useStudioTaskUpdate';

type CompanyProfileModalTaskDetailsProp = {
  task: ReckoningTaskTypes;
  companyClass: string;
  closeModal: () => void;
};

function CompanyProfileModalTaskDetails({
  task,
  companyClass,
  closeModal,
}: CompanyProfileModalTaskDetailsProp) {
  const sanitizedDescription = task.description
    ? DOMPurify.sanitize(task.description)
    : '';

  const { isEditing, formValue, setIsEditing, handleFormChange, handleBlur } =
    useStudioTaskUpdate(task, closeModal, false);

  return (
    <>
      <h3 className={styles.editModalTitle}>Szczegóły zlecenia</h3>

      <div className={styles.modalContainer}>
        <div className={styles.infoColumn}>
          <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
            {/* <p className={styles.title}>{task.title}</p> */}
            <input
              type="text"
              name="taskTitle"
              id="taskTitle"
              onChange={(e) => {
                handleFormChange(e, 'title');
              }}
              onBlur={handleBlur}
              onClick={() => setIsEditing(true)}
              value={formValue.title}
              className={`${styles.input} ${
                isEditing ? styles.editMode : styles.noEditMode
              }`}
            />
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
