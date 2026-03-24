import React from 'react';
import { UserContext, UserContextValue } from '../providers/UserProvider';

function useAuth(): UserContextValue {
  return React.useContext(UserContext);
}

export default useAuth;
