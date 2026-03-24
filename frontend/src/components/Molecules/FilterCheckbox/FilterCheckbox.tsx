import React, { HTMLAttributes } from 'react';

import styles from './FilterCheckbox.module.css';

interface FilterCheckboxProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  isSelected: boolean;
  toggleCompany: (filterVariable: string | object) => void;
  filterVariable: string | object;
}

function FilterCheckbox({
  name,
  toggleCompany,
  isSelected,
  filterVariable,
  ...props
}: FilterCheckboxProps) {
  const handleInteraction = () => {
    toggleCompany(filterVariable);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === '') {
      e.preventDefault();
      toggleCompany(filterVariable);
    }
  };

  return (
    <div
      className={styles.userWrapper}
      role="button"
      tabIndex={0}
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <input
        className={styles.checkInput}
        type="checkbox"
        checked={isSelected}
        onChange={handleInteraction}
      />
      <p>{name}</p>
    </div>
  );
}

export default FilterCheckbox;
