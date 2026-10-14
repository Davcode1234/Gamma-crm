// import useShowLabel from '../../../hooks/useShowLabel';
// import { getUserColor } from '../../../utils/getUserColor';
// import styles from './UserInitialsBatch.module.css';

// function UserInitialBatch({ user }) {
//   const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

//   return (
//     <div
//       className={styles.userInitialsContainer}
//       style={{ backgroundColor: getUserColor(String(user._id)) }}
//       onMouseEnter={(e) => {
//         handleMouseEnter(user.name, data.name, e);
//       }}
//       onMouseLeave={() => {
//         handleMouseLeave();
//       }}
//     >
//       {Array.from(user.name ?? '')[0]}
//       {Array.from(user.lastname ?? '')[0]}
//     </div>
//   );
// }

// export default UserInitialBatch;
