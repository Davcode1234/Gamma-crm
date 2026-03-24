import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import UserProvider from './providers/UserProvider';
import App from './pages/App/App';
import { UsersContextProvider } from './context/UsersContext';
import TasksContextProvder from './context/TasksContext';
import { CompaniesContextProvider } from './context/CompaniesContext';
import { StudioTasksContextProvider } from './context/StudioTasksContext';
import { ReckoTasksContextProvider } from './context/ReckoTasksContext';
import { ClientsContextProvider } from './context/ClientsContext';
import EasterEgg from './components/Templates/EasterEgg/EasterEgg';
import { PlackerTasksContextProvider } from './context/PlackerContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <PlackerTasksContextProvider>
            <ClientsContextProvider>
              <ReckoTasksContextProvider>
                <StudioTasksContextProvider>
                  <CompaniesContextProvider>
                    <TasksContextProvder>
                      <UsersContextProvider>
                        <EasterEgg />
                        <App />
                      </UsersContextProvider>
                    </TasksContextProvder>
                  </CompaniesContextProvider>
                </StudioTasksContextProvider>
              </ReckoTasksContextProvider>
            </ClientsContextProvider>
          </PlackerTasksContextProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
