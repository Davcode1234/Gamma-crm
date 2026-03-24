import { useContext } from 'react';
import { ReckoTasksContext } from '../../context/ReckoTasksContext';

const useReckoTasksContext = () => {
  const context = useContext(ReckoTasksContext);
  if (!context) {
    throw new Error('Reckoning task context not available');
  }
  return context;
};

export default useReckoTasksContext;
