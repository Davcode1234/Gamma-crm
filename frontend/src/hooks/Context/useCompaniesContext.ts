import { useContext } from 'react';
import { CompaniesContext } from '../../context/CompaniesContext';

const useCompaniesContext = () => {
  const context = useContext(CompaniesContext);

  if (!context) {
    throw Error('useCompaniesContext must be used inside UsersContextProvider');
  }

  return context;
};

export default useCompaniesContext;
