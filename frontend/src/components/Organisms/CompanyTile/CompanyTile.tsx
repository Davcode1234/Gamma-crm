import styles from './CompanyTile.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import UsersDisplay from '../UsersDisplay/UsersDisplay';

function CompanyTile({ company, index, user, hasRole }) {
  return hasRole(user, ['admin']) ? (
    <TileWrapper key={company._id} linkPath={company._id} index={index}>
      <div className={styles.companyTileContainer}>
        <div className={styles.tileElement}>
          <p>{company.name}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.nip}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.address}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.website}</p>
        </div>

        <UsersDisplay data={company} usersArray={company.teamMembers} />
      </div>
    </TileWrapper>
  ) : (
    <TileWrapper key={company._id} linkPath="" index={index}>
      <div className={styles.companyTileContainer}>
        <div className={styles.tileElement}>
          <p>{company.name}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.nip}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.address}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.website}</p>
        </div>

        <UsersDisplay data={company} usersArray={company.teamMembers} />
      </div>
    </TileWrapper>
  );
}

export default CompanyTile;
