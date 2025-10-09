import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './SideNavigation.module.css';
import useSideNavHide from '../../../hooks/useSideNavHide';
import hasRole from '../../../utils/hasRole';
import useAuth from '../../../hooks/useAuth';

const sideNavButtons = [
  {
    name: 'pulpit',
    icon: 'ic:outline-space-dashboard',
    roles: ['admin'],
  },
  {
    name: 'użytkownicy',
    icon: 'uil:users-alt',
    roles: ['admin'],
  },
  {
    name: 'zlecenia',
    icon: 'fluent:tasks-app-24-regular',
    roles: ['admin', 'grafik'],
  },
  {
    name: 'rozliczenie',
    icon: 'icon-park-solid:excel',
    roles: ['admin', 'grafik'],
  },
  {
    name: 'firmy',
    icon: 'clarity:building-line',
    roles: ['admin', 'grafik'],
  },
  {
    name: 'klienci',
    icon: 'lucide:contact',
    roles: ['admin', 'grafik'],
  },
  // {
  //   name: 'zadania',
  //   icon: 'ic:outline-add-task',
  // },
  // {
  //   name: 'ankiety',
  //   icon: 'fluent:poll-24-regular',
  // },
  {
    name: 'magazyn',
    icon: 'material-symbols:warehouse-outline-rounded',
    roles: ['admin'],
  },
];

function SideNavigation() {
  const { isSideNavHidden, setIsSideNavHidden } = useSideNavHide();
  const [animationClass, setAnimationClass] = useState({
    sideNavContainer: {},
    text: {},
  });
  const { user } = useAuth();

  return (
    <div
      className={`${
        isSideNavHidden
          ? styles.hiddenSideNavContainer
          : styles.sideNavContainer
      } ${animationClass.sideNavContainer} ${
        isSideNavHidden && styles.setMinWidth
      }`}
    >
      <Link to="/" className={styles.logoContainer}>
        {isSideNavHidden ? (
          <img
            src="https://res.cloudinary.com/dpktrptfr/image/upload/v1739274992/Gletter_ro2xia.svg"
            alt="Gamma logo"
            className={styles.smallLogo}
          />
        ) : (
          <img
            src="https://res.cloudinary.com/dpktrptfr/image/upload/v1679038488/HomePage/orange.png"
            alt="Gamma logo"
            className={styles.logo}
          />
        )}
      </Link>

      <div className={styles.buttonsContainer}>
        <div className={styles.btnsWrapper}>
          {sideNavButtons.map((btn) => {
            return (
              hasRole(user, btn.roles) && (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.active}` : `${styles.inactive}`
                  }
                  key={btn.name}
                  to={`${btn.name}`}
                >
                  <Icon
                    icon={btn.icon}
                    width="28"
                    height="28"
                    className={styles.icon}
                  />
                  <button
                    type="button"
                    className={`${`${
                      isSideNavHidden
                        ? styles.hiddenSideNavBtn
                        : styles.sideNavBtn
                    }`} ${animationClass.text}`}
                  >
                    {btn.name[0].toUpperCase() + btn.name.slice(1)}
                  </button>
                </NavLink>
              )
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className={styles.hideSideNavButton}
        onClick={() => {
          if (isSideNavHidden) {
            setAnimationClass(() => {
              return {
                text: styles.showText,
                sideNavContainer: styles.showSideNav,
              };
            });
          } else {
            setAnimationClass(() => {
              return {
                text: styles.hideText,
                sideNavContainer: styles.hideSideNav,
              };
            });
          }
          setIsSideNavHidden((prev) => !prev);
        }}
      >
        <Icon
          className={`${
            isSideNavHidden ? styles.showIcon : styles.hideSideNavIcon
          }`}
          icon="clarity:eye-hide-line"
          width="20"
          height="20"
        />
        <span
          className={`${
            isSideNavHidden ? styles.hideButtonText : styles.showButtonText
          }`}
        >
          Zwiń menu
        </span>
      </button>
    </div>
  );
}

export default SideNavigation;
