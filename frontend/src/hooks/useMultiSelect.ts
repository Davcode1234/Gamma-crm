import { useEffect, useMemo, useState } from 'react';
import { UpdateUser } from '../services/users-service';

const useMultiSelect = (user) => {
  // derive a safe roles array from `user`
  const incomingRoles = useMemo(() => {
    const roles = user?.[0]?.roles;
    return Array.isArray(roles) ? roles : ['grafik'];
  }, [user]);

  const [assignedRoles, setAssignedRoles] = useState(() => [...incomingRoles]);

  // keep local state in sync when `user` changes
  useEffect(() => {
    setAssignedRoles([...incomingRoles]);
  }, [incomingRoles]);

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState('');

  const handleFilterDropdownInputValue = (e) => {
    setSelectFilterValue(e.target.value);
  };

  const roles = ['admin', 'grafik'];

  const filteredRolesForDropdown = roles.filter((r) =>
    r.toLowerCase().includes(selectFilterValue.toLowerCase())
  );

  const handleRoleAssign = async (role) => {
    // compute next value without relying on state having updated yet
    const nextRoles = assignedRoles.includes(role)
      ? assignedRoles.filter((r) => r !== role)
      : [...assignedRoles, role];

    // update local state
    setAssignedRoles(nextRoles);

    // send exactly what you just computed
    if (user?.[0]?._id) {
      await UpdateUser({ id: user[0]._id, userData: { roles: nextRoles } });
      console.log(nextRoles, 'sent');
    }

    setIsSelectOpen(true);
  };

  return {
    isSelectOpen,
    setIsSelectOpen,
    selectFilterValue,
    handleFilterDropdownInputValue,
    assignedRoles,
    filteredRolesForDropdown,
    handleRoleAssign,
  };
};

export default useMultiSelect;
