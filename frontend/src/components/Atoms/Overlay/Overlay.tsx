import styles from './Overlay.module.css';

function Overlay({ closeFunction }) {
  return (
    <div
      className={styles.overlay}
      onClick={() => closeFunction(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          closeFunction(false);
        }
      }}
    />
  );
}

export default Overlay;
