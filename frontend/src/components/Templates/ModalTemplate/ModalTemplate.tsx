import ReactModal from 'react-modal';
import styles from './ModalTemplate.module.css';

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

type ModalTypes = {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  children: string | JSX.Element | JSX.Element[];
  exitAnim: boolean;
};

function ModalTemplate({ isOpen, onClose, children, exitAnim }: ModalTypes) {
  return !exitAnim ? (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modalOpenContainer}
    >
      {children}
      {/* <button type="button" className={styles.closeBtn} onClick={onClose}>
        &times;
      </button> */}
    </ReactModal>
  ) : (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.exitOverlay}
      className={styles.modalExitContainer}
    >
      {children}
      {/* <button type="button" className={styles.closeBtn} onClick={onClose}>
        &times;
      </button> */}
    </ReactModal>
  );
}

export default ModalTemplate;
