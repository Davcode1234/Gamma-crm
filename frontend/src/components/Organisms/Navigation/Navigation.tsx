import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import styles from './Navigation.module.css';
import UserInitialBatch from '../../Atoms/UserInitialsBatch/UserInitialsBatch';

function Navigation() {
  const { signOut, user } = useAuth();
  const loggedUser = user[0];

  return (
    <div className={styles.navWrapper}>
      <Link
        to={`/użytkownicy/${loggedUser._id}`}
        className={styles.workerWrapper}
      >
        {/* <img src={loggedUser.img} alt="Worker" className={styles.workerImg} /> */}
        <UserInitialBatch user={loggedUser} withLabel={false} />

        <div className={styles.dataTextWrapper}>
          <h2 className={styles.name}>{loggedUser.name}</h2>
          <p className={styles.job}>{loggedUser.job}</p>
        </div>
      </Link>

      <button type="button" className={styles.signOutBtn} onClick={signOut}>
        Wyloguj
      </button>
    </div>
  );
}

export default Navigation;
