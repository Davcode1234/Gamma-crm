import styles from './ControlBardTitle.module.css';

function ControlBarTitle({ children }) {
  return <h3 className={styles.controlBarTitle}>{children}</h3>;
}

export default ControlBarTitle;
