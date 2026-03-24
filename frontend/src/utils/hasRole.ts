const hasRole = (user, rolesToCheck) => {
  if (!user || !Array.isArray(user[0].roles)) return false;
  return rolesToCheck.some((r) => user[0].roles.includes(r));
};

export default hasRole;
