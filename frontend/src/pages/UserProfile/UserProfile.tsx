import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, User } from '../../services/users-service';
import styles from './UserProfile.module.css';

import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';

import BackButton from '../../components/Atoms/BackButton/BackButton';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ProfileTopBar from '../../components/Atoms/ProfileTopBar/ProfileTopBar';

function UserProfile() {
  const params = useParams();
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    getUserById(params.id)
      .then((singleUserArray: User | User[]) => {
        if (Array.isArray(singleUserArray)) {
          if (singleUserArray.length > 0) {
            setUser(singleUserArray);
          }
        } else {
          setUser([singleUserArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [params.id]);

  return (
    <ViewContainer>
      <ListContainer>
        <ProfileTopBar>
          <div className={styles.topBarContainer}>
            <BackButton path="użytkownicy" />
            <h2>{user.length > 0 && user[0].name}</h2>
          </div>
        </ProfileTopBar>
        <p>W produkcji</p>
      </ListContainer>
    </ViewContainer>
  );
}

export default UserProfile;
