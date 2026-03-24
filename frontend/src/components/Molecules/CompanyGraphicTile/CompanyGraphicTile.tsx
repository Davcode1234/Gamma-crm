import styles from './CompanyGraphicTile.module.css';

function CompanyGraphicTile({ member, handleDeleteMember }) {
  return (
    <div className={styles.memberTile}>
      <div
        className={styles.deleteMemberContainer}
        onClick={() => handleDeleteMember(member._id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDeleteMember(member._id);
          }
        }}
      >
        <div className={styles.deleteMember} />
      </div>
      <img src={member.img} alt="user" className={styles.userImg} />
      <p>{member.name}</p>
    </div>
  );
}

export default CompanyGraphicTile;
