import styles from './SelectUser.module.css';

function SelectUser({ users, handleAddMember }) {
  return (
    <div className={styles.addUserWrapper}>
      <select
        id="user-select"
        onChange={(e) => {
          handleAddMember(e.target.value);
        }}
        className={styles.selectInput}
      >
        <option value="">Przypisz grafika</option>
        {users.map((user) => {
          return (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default SelectUser;
