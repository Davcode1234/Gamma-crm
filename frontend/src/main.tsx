import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import UserProvider from './providers/UserProvider';
import App from './pages/App/App';
import { UsersContextProvider } from './context/UsersContext';
import TasksContextProvder from './context/TasksContext';

// If you want deploy site to static cdn, use Hashrouter instead

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <TasksContextProvder>
          <UsersContextProvider>
            <App />
          </UsersContextProvider>
        </TasksContextProvder>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
