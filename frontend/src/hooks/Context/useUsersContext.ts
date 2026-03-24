import { useContext } from 'react';
import { UsersContext } from '../../context/UsersContext';

const useUsersContext = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw Error('useUsersContext must be used inside UsersContextProvider');
  }

  return context;
};

export default useUsersContext;
