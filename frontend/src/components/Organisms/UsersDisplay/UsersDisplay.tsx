import styles from './UsersDisplay.module.css';
import { User } from '../../../services/users-service';
import UserInitialBatch from '../../Atoms/UserInitialsBatch/UserInitialsBatch';

function UsersDisplay({ data, usersArray }) {
  return (
    <div className={styles.usersImgContainer}>
      {usersArray.length > 0 &&
        usersArray.map((user: User) => {
          return (
            // <Link
            //   className={styles.userWrapper}
            //   key={user._id}
            //   to={`/użytkownicy/${user._id}`}
            // >
            //   <img
            //     className={`${
            //       isSmall ? styles.smallerUserImg : styles.userImg
            //     }`}
            //     src={user.img}
            //     alt="user"
            //     onMouseEnter={(e) => {
            //       handleMouseEnter(user.name, data.name, e);
            //     }}
            //     onMouseLeave={() => {
            //       handleMouseLeave();
            //     }}
            //   />
            //   <div
            //     className={styles.userInitialsContainer}
            //     style={{ backgroundColor: getUserColor(String(user._id)) }}
            //     onMouseEnter={(e) => {
            //       handleMouseEnter(user.name, data.name, e);
            //     }}
            //     onMouseLeave={() => {
            //       handleMouseLeave();
            //     }}
            //   >
            //     {Array.from(user.name ?? '')[0]}
            //     {Array.from(user.lastname ?? '')[0]}
            //   </div>

            //   {labelState.isLabel &&
            //     labelState.labelValue === data.name &&
            //     labelState.labelId === user.name && (
            //       <HoverLabel
            //         position={labelState.mousePosition}
            //         root="label-root"
            //       >
            //         {user.name}
            //       </HoverLabel>
            //     )}
            // </Link>

            <UserInitialBatch
              key={user._id}
              user={user}
              data={data}
              withLabel
            />
          );
        })}
    </div>
  );
}

export default UsersDisplay;
