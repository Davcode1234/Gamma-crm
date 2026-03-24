import styles from './CompanyBatch.module.css';

function CompanyBatch({ children, companyClass, isClientPerson, isBigger }) {
  const clientElClass = isBigger
    ? styles.biggerClientPerson
    : styles.clientPerson;

  const companyElClass = isBigger ? styles.biggerClientName : styles.clientName;
  return isClientPerson ? (
    <p className={`${clientElClass}`}>{children}</p>
  ) : (
    <p className={`${companyElClass} ${[`${companyClass}`]}`}>{children}</p>
  );
}

export default CompanyBatch;
