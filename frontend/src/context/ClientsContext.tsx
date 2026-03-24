import { createContext, ReactNode, useMemo, useReducer } from 'react';
import { ClientsType } from '../services/clients-service';

type ClientsStateType = {
  clients: ClientsType[];
};

type ClientsContextType = ClientsStateType & {
  dispatch: React.Dispatch<any>;
};

export const ClientsContext = createContext<ClientsContextType | undefined>(
  undefined
);

export const clientsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { clients: action.payload };
    case 'CREATE_CLIENT':
      return { clients: [action.payload, ...state.clients] };
    case 'DELETE_CLIENT':
      return {
        clients: state.clients.filter(
          (client) => client._id !== action.payload.id
        ),
      };

    default:
      return state;
  }
};

export function ClientsContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(clientsReducer, {
    clients: [],
  });
  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <ClientsContext.Provider value={contextValue}>
      {children}
    </ClientsContext.Provider>
  );
}
