import { Icon } from '@iconify/react';
import styles from './AddNewClientButton.module.css';

function AddNewClientButton({ callbackFn }) {
  return (
    <button
      type="button"
      className={styles.addClientButton}
      onClick={callbackFn}
    >
      Dodaj klienta
      <Icon icon="line-md:plus-circle" width="20" height="20" />
    </button>
  );
}

export default AddNewClientButton;
