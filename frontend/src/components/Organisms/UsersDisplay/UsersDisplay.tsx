import { Link } from 'react-router-dom';
import styles from './UsersDisplay.module.css';
import useShowLabel from '../../../hooks/useShowLabel';
import HoverLabel from '../../Atoms/HoverLabel/HoverLabel';
import { User } from '../../../services/users-service';
import { getUserColor } from '../../../utils/getUserColor';

function UsersDisplay({ data, usersArray }) {
  const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

  return (
    <div className={styles.usersImgContainer}>
      {usersArray.length > 0 &&
        usersArray.map((user: User) => {
          return (
            <Link
              className={styles.userWrapper}
              key={user._id}
              to={`/użytkownicy/${user._id}`}
            >
              {/* <img
                className={`${
                  isSmall ? styles.smallerUserImg : styles.userImg
                }`}
                src={user.img}
                alt="user"
                onMouseEnter={(e) => {
                  handleMouseEnter(user.name, data.name, e);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
              /> */}
              <div
                className={styles.userInitialsContainer}
                style={{ backgroundColor: getUserColor(String(user._id)) }}
                onMouseEnter={(e) => {
                  handleMouseEnter(user.name, data.name, e);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
              >
                {Array.from(user.name ?? '')[0]}
                {Array.from(user.lastname ?? '')[0]}
              </div>

              {labelState.isLabel &&
                labelState.labelValue === data.name &&
                labelState.labelId === user.name && (
                  <HoverLabel
                    position={labelState.mousePosition}
                    root="label-root"
                  >
                    {user.name}
                  </HoverLabel>
                )}
            </Link>
          );
        })}
    </div>
  );
}

export default UsersDisplay;
