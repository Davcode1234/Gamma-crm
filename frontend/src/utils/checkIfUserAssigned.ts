const checkIfUserAssigned = (participantsUsers, userId) => {
  return participantsUsers.some((participant) => participant._id === userId);
};

export default checkIfUserAssigned;
