import { Navigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

type Props = {
  roles: string[];
  children: JSX.Element;
};

function RouteProtection({ roles, children }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/signin" replace />;

  const userRoles: string[] = user[0].roles;
  const allowed = roles.some((r) => userRoles.includes(r));
  if (!allowed) return <Navigate to="/403" replace />;
  return children;
}

export default RouteProtection;
