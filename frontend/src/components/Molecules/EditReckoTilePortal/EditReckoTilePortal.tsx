import { Icon } from '@iconify/react';
import Overlay from '../../Atoms/Overlay/Overlay';
import styles from './EditReckoTilePortal.module.css';

function EditReckoTilePortal({
  reckTask,
  style,
  setIsEditOpen,
  setFormValue,
  handleDeleteReckoTask,
  handleHoursClear,
  handleBlur,
  isAssignedToKanban,
}) {
  return (
    <>
      <Overlay closeFunction={setIsEditOpen} />
      <div className={styles.editModal} style={style}>
        <div
          className={styles.deleteWrapper}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDeleteReckoTask(reckTask._id);
            }
          }}
          onClick={() => {
            handleDeleteReckoTask(reckTask._id);
          }}
        >
          <Icon
            className={styles.trashIcon}
            icon="line-md:document-delete"
            width="20"
            height="20"
          />
          <p>Usuń zlecenie</p>
        </div>
        <div
          className={styles.deleteWrapper}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDeleteReckoTask(reckTask._id);
            }
          }}
          onClick={() => {
            handleHoursClear();
          }}
        >
          <Icon
            className={styles.trashIcon}
            icon="mdi:clock-minus-outline"
            width="20"
            height="20"
          />
          <p>Wyczyść godziny</p>
        </div>
        {!isAssignedToKanban && (
          <div
            className={styles.deleteWrapper}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleDeleteReckoTask(reckTask._id);
              }
            }}
            onClick={() => {
              handleBlur(reckTask._id, {
                client: 'Wybierz firme',
                clientPerson: 'Wybierz klienta',
                title: '',
                description: '',
                printWhat: '',
                printWhere: '',
              });
              setFormValue((prev) => {
                return {
                  ...prev,
                  client: 'Wybierz firme',
                  clientPerson: 'Wybierz klienta',
                  title: '',
                  description: '',
                  printWhat: '',
                  printWhere: '',
                };
              });
              handleHoursClear();
            }}
          >
            <Icon
              className={styles.trashIcon}
              icon="line-md:file-document-off"
              width="20"
              height="20"
            />
            <p>Wyczyść zlecenie</p>
          </div>
        )}
      </div>
    </>
  );
}

export default EditReckoTilePortal;
