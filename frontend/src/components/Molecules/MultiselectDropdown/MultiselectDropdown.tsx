import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import styles from './MultiselectDropdown.module.css';
import Overlay from '../../Atoms/Overlay/Overlay';

function MultiselectDropdown({
  children,
  isSelectOpen,
  setIsSelectOpen,
  label,
  inputKey,
  inputValue,
  handleInputValue,
  isBigger,
  isSquare,
}) {
  const selectInputRef = useRef(null);

  useEffect(() => {
    if (isSelectOpen && selectInputRef.current) {
      selectInputRef.current.focus();
    }
  }, [isSelectOpen]);

  return (
    <button
      type="button"
      className={`${isSquare ? styles.squareButton : styles.openSelectButton}`}
      // onClick={() => {
      //   setIsSelectOpen(true);
      // }}
    >
      <div
        className={styles.labelWrapper}
        role="button"
        onClick={() => {
          setIsSelectOpen(true);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsSelectOpen((prev) => !prev);
          }
        }}
      >
        {isSelectOpen ? (
          <input
            type="text"
            ref={selectInputRef}
            className={`${
              isBigger
                ? styles.biggerSelectFilterInput
                : styles.selectFilterInput
            }`}
            value={inputValue}
            onChange={(e) => handleInputValue(e, inputKey)}
            onClick={() => setIsSelectOpen(true)}
          />
        ) : (
          <p className={styles.buttonLabel}>{label}</p>
        )}

        <Icon
          icon="material-symbols:keyboard-arrow-down-rounded"
          width="17"
          height="17"
          className={`${isSelectOpen ? styles.upArrow : styles.downArrow}`}
        />
      </div>

      {isSelectOpen && (
        <>
          <Overlay closeFunction={setIsSelectOpen} />
          <div
            className={`${
              isBigger ? styles.biggerSelectContainer : styles.selectContainer
            }`}
          >
            {children}
          </div>
        </>
      )}
    </button>
  );
}

export default MultiselectDropdown;
