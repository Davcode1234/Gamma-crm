import { Navigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import hasRole from '../../../utils/hasRole';

function UserProfileGuard({ children }) {
  const { id } = useParams();
  const { user } = useAuth();
  const userID = user[0]?._id;

  console.log(user);

  const isAdmin = hasRole(user, ['admin']);
  const isOwner = id === 'me' || id === userID;

  console.log(isOwner, 'params id', id, 'user id', userID);

  if (isAdmin || isOwner) {
    return children;
  }
  return <Navigate to="/403" replace />;
}

export default UserProfileGuard;
