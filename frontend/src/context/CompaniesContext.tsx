import { createContext, ReactNode, useMemo, useReducer } from 'react';
import { CompaniesType } from '../services/companies-service';

type CompaniesStateType = {
  companies: CompaniesType[];
};

type CompaniesContextType = CompaniesStateType & {
  dispatch: React.Dispatch<any>;
};

export const CompaniesContext = createContext<CompaniesContextType | undefined>(
  undefined
);

export const companiesReducer = (state: CompaniesStateType, action: any) => {
  switch (action.type) {
    case 'SET_COMPANIES':
      return { companies: action.payload };
    case 'CREATE_COMPANY':
      return { companies: [action.payload, ...state.companies] };
    case 'UPDATE_CLIENTPERSON':
      return {
        companies: state.companies.map((company) =>
          company._id === action.payload._id
            ? {
                ...company,
                clientPerson: [
                  ...company.clientPerson,
                  { label: action.test.name, value: action.test.name },
                ],
              }
            : company
        ),
      };
    case 'DELETE_COMPANY':
      return {
        companies: state.companies.filter(
          (company) => company._id !== action.payload.id
        ),
      };

    default:
      return state;
  }
};

export function CompaniesContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(companiesReducer, {
    companies: [],
  });
  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <CompaniesContext.Provider value={contextValue}>
      {children}
    </CompaniesContext.Provider>
  );
}
