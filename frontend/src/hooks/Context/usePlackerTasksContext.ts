import { useContext } from 'react';
import { PlackerTasksContext } from '../../context/PlackerContext';

const usePlackerTasksContext = () => {
  const context = useContext(PlackerTasksContext);

  if (!context) {
    throw new Error('Placker task context not available');
  }

  return context;
};

export default usePlackerTasksContext;
