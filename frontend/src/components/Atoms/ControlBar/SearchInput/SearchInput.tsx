import { forwardRef } from 'react';
import styles from './SearchInput.module.css';

const SearchInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={styles.navInput}
      placeholder="Szukaj"
      type="text"
      {...props}
    />
  );
});
SearchInput.displayName = 'SearchInput';

export default SearchInput;
