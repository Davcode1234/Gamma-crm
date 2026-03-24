import { useEffect, useState } from 'react';
import { ClientsType, getClientsByCompany } from '../services/clients-service';

function useClientsData(currentCompany) {
  const [clients, setClients] = useState<ClientsType[]>([]);
  const [clientIdsToDelete, setClientIdsToDelete] = useState<string[]>([]);
  const [clientsToAdd, setClientsToAdd] = useState<ClientsType[]>([]);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });
  const [isAddNewClientError, setIsAddNewClientError] = useState(false);
  const [isAddNewClientView, setIsAddNewClientView] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClientsByCompany(
        currentCompany.name.toLowerCase()
      );
      setClients(fetchedClients);
    };

    fetchClients();
  }, []);

  const handleAddNewClientFormChange = (e, key) => {
    setNewClient((prev) => {
      return {
        ...prev,
        [key]: e.target.value,
      };
    });
  };

  return {
    clients,
    setClients,
    clientIdsToDelete,
    setClientIdsToDelete,
    clientsToAdd,
    setClientsToAdd,
    newClient,
    setNewClient,
    isAddNewClientError,
    setIsAddNewClientError,
    handleAddNewClientFormChange,
    isAddNewClientView,
    setIsAddNewClientView,
  };
}

export default useClientsData;
