import { useEffect, useState } from 'react';
import useUsersContext from './Context/useUsersContext';
import { getAllUsers } from '../services/users-service';

type UseSelectUserProps<T> = {
  initialValue: T;
  objectKey: keyof T;
};

const useSelectUser = <T>({
  initialValue,
  objectKey,
}: UseSelectUserProps<T>) => {
  const [keyWordInputValue, setKeyWordInputValue] = useState('');
  const { users, dispatch } = useUsersContext();
  const [formValue, setFormValue] = useState<T>(initialValue);

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        try {
          const allUsers = await getAllUsers();
          dispatch({ type: 'SET_USERS', payload: allUsers });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [dispatch, users]);

  const handleAddMember = (userId: string) => {
    const userToAdd = users.find((user) => user._id === userId);

    if (!userToAdd) return;

    setFormValue((prev) => {
      const participants = (prev[objectKey] as any[]) || [];
      const isAlreadyAdded = participants.some(
        (participant) => participant._id === userId
      );

      if (isAlreadyAdded) return prev;

      return {
        ...prev,
        [objectKey]: [...participants, userToAdd],
      };
    });
  };

  const handleDeleteMember = (userId: string) => {
    setFormValue((prev) => {
      const participants = (prev[objectKey] as any[]) || [];
      return {
        ...prev,
        [objectKey]: participants.filter(
          (participant) => participant._id !== userId
        ),
      };
    });
  };

  return {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
    keyWordInputValue,
    setKeyWordInputValue,
  };
};

export default useSelectUser;
