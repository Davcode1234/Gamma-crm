import { Link } from 'react-router-dom';
import useShowLabel from '../../../hooks/useShowLabel';
import { getUserColor } from '../../../utils/getUserColor';
import styles from './UserInitialsBatch.module.css';
import HoverLabel from '../HoverLabel/HoverLabel';
import { User } from '../../../services/users-service';
import useUsersContext from '../../../hooks/Context/useUsersContext';

type Props =
  | {
      user: User;
      withLabel: true;
      data: { name: string };
      isSmaller?: boolean;
    }
  | {
      user: User;
      withLabel?: false;
      data?: never;
      isSmaller?: boolean;
    };

function UserInitialBatch({
  user,
  data,
  withLabel = false,
  isSmaller = false,
}: Props) {
  const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();
  const { colorById } = useUsersContext();

  const backgroundColor = getUserColor({
    _id: String(user._id),
    color: colorById[String(user._id)] ?? user.color,
  });

  return withLabel ? (
    <Link
      className={styles.userWrapper}
      key={user._id}
      to={`/użytkownicy/${user._id}`}
    >
      <div
        className={styles.userInitialsContainer}
        style={{ backgroundColor }}
        onMouseEnter={(e) => {
          handleMouseEnter(user.name, data?.name, e);
        }}
        onMouseLeave={() => {
          handleMouseLeave();
        }}
      >
        {String(user.name ?? '')
          .charAt(0)
          .toUpperCase()}
        {String(user.lastname ?? '')
          .charAt(0)
          .toUpperCase()}
      </div>
      {labelState.isLabel &&
        labelState.labelValue === data?.name &&
        labelState.labelId === user.name && (
          <HoverLabel position={labelState.mousePosition} root="label-root">
            {user.name}
          </HoverLabel>
        )}
    </Link>
  ) : (
    <div
      className={`${isSmaller ? styles.smaller : styles.userInitialsContainer}`}
      style={{ backgroundColor }}
    >
      {String(user.name ?? '')
        .charAt(0)
        .toUpperCase()}
      {String(user.lastname ?? '')
        .charAt(0)
        .toUpperCase()}
    </div>
  );
}

export default UserInitialBatch;
