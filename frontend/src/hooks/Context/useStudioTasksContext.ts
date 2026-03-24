import { useContext } from 'react';
import { StudioTasksContext } from '../../context/StudioTasksContext';

const useStudioTasksContext = () => {
  const context = useContext(StudioTasksContext);

  if (!context) {
    throw new Error('Studio task context not available');
  }

  return context;
};

export default useStudioTasksContext;
