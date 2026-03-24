import { useContext } from 'react';
import { ClientsContext } from '../../context/ClientsContext';

const useClientsContext = () => {
  const context = useContext(ClientsContext);

  if (!context) {
    throw Error('useClientsContext must be used inside UsersContextProvider');
  }

  return context;
};

export default useClientsContext;
