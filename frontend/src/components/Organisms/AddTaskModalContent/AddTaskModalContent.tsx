import Calendar from 'react-calendar';
import Loader from '../../Molecules/Loader/Loader';
import styles from './AddTaskModalContent.module.css';

function AddTaskModalContent({
  isLoading,
  showFinalMessage,
  finalMessage,
  createTaskHandler,
  imgIconRef,
  title,
  imgSrc,
  handleFileChange,
  handleIconClick,
  imgLabel,
  handleTitleChange,
  client,
  handleClientChange,
  description,
  handleDescriptionChange,
  path,
  handlePathChange,
  handlePriorityChange,
  handleStatusChange,
  handleDeadlineChange,
  deadline,
}) {
  return (
    <div>
      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <div>
          {showFinalMessage ? (
            <div className={styles.loaderWrapper}>
              <p>{finalMessage}</p>
            </div>
          ) : (
            <>
              <div className={styles.topBarContainer}>
                <h2>Stwórz zlecenie</h2>
                <button
                  type="button"
                  onClick={createTaskHandler}
                  className={styles.addTaskBtn}
                >
                  Dodaj
                </button>
              </div>
              <div className={styles.mainContainer}>
                <div>
                  <input
                    ref={imgIconRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.inputRef}
                  />
                  <button
                    type="button"
                    onClick={handleIconClick}
                    className={styles.addImgField}
                  >
                    <div className={styles.addImgFieldContainer}>
                      <span className={styles.imgLabel}>{imgLabel}</span>
                      <img
                        alt="your"
                        src={imgSrc}
                        className={styles.addImage}
                      />
                    </div>
                  </button>
                </div>
                <div className={styles.inputsContainer}>
                  <div className={styles.rowContainer}>
                    <div className={styles.leftRow}>
                      <input
                        type="text"
                        placeholder="Tytuł"
                        value={title}
                        onChange={handleTitleChange}
                        className={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Klient"
                        value={client}
                        onChange={handleClientChange}
                        className={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Opis"
                        value={description}
                        onChange={handleDescriptionChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.rightRow}>
                      <input
                        type="text"
                        placeholder="Ścieżka plików"
                        value={path}
                        onChange={handlePathChange}
                        className={styles.input}
                      />

                      <select
                        className={styles.selectInput}
                        onChange={handlePriorityChange}
                      >
                        <option value="">Priorytet</option>
                        <option value="200">200</option>
                        <option value="400">400</option>
                        <option value="600">600</option>
                        <option value="800">800</option>
                        <option value="1000">1000</option>
                      </select>
                      <select
                        className={styles.selectInput}
                        onChange={handleStatusChange}
                      >
                        <option value="">Status zlecenia</option>
                        <option value="Studio">Studio</option>
                        <option value="Druk">Druk</option>
                        <option value="Kalander">Kalander</option>
                        <option value="Szwalnia">Szwalnia</option>
                        <option value="Pakowanie">Pakowanie</option>
                        <option value="Wysyłka">Wysyłka</option>
                      </select>
                    </div>
                  </div>

                  <p
                    className={styles.buttonInput}
                    // onClick={() => setIsCalendarVisible((val) => !val)}
                  >
                    <p>Deadline</p>
                  </p>
                  <Calendar onChange={handleDeadlineChange} value={deadline} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AddTaskModalContent;
