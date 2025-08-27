import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users-service';
import styles from './UsersView.module.css';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import Form from '../../components/Atoms/Form/Form';
import useAuth from '../../hooks/useAuth';
import FormControl from '../../components/Atoms/FormControl/FormControl';
import Input from '../../components/Atoms/Input/Input';
import inputStyle from '../../components/Atoms/Input/Input.module.css';
import SubmitButton from '../../components/Atoms/SubmitBtn/SubmitBtn';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import TilesColumnContainer from '../../components/Atoms/ListContainer/ListContainer';
import useUsersContext from '../../hooks/Context/useUsersContext';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
import MultiselectDropdown from '../../components/Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../components/Molecules/FilterCheckbox/FilterCheckbox';

const createUserSchema = Yup.object({
  name: Yup.string().required('Imie jest wymagane'),
  lastname: Yup.string().required('Nazwisko jest wymagane'),
  email: Yup.string()
    .email('Nieprawidłowy adres email')
    .required('Email jest wymagany'),
  phone: Yup.number().required('Numer jest wymagany'),
  password: Yup.string().required('Hasło jest wymagane'),
  job: Yup.string().required('Stanowisko jest wymagane'),
  img: Yup.string(),
});

function UsersView() {
  const [assignedRoles, setAssignedRoles] = useState(['grafik']);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState('');
  const { signUp } = useAuth();

  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      phone: 0,
      password: '',
      job: '',
      img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1701779173/Windows_10_Default_Profile_Picture.svg_o9zszg.png',
      roles: [],
    },
    validationSchema: createUserSchema,
    onSubmit: (values) => {
      const { name } = values;
      const { lastname } = values;
      const { email } = values;
      const { phone } = values;
      const { password } = values;
      const { job } = values;
      const { img } = values;

      formik.setStatus(null);
      return signUp({
        name,
        lastname,
        email,
        phone,
        password,
        job,
        img,
        roles: assignedRoles,
      }).catch(() => {
        formik.setStatus('error');
      });
    },
  });

  // @ts-ignore
  const { users, dispatch } = useUsersContext();

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      dispatch({ type: 'SET_USERS', payload: allUsers });
    });
  }, [dispatch]);

  const handleFilterDropdownInputValue = (e) => {
    const { value } = e.target;
    setSelectFilterValue(value);
  };

  const roles = ['admin', 'grafik'];

  const filteredRolesForDropdown = roles.filter((r) => {
    return r
      .toLocaleLowerCase()
      .includes(selectFilterValue.toLocaleLowerCase());
  });

  const handleRoleAssign = (role) => {
    if (assignedRoles.some((roleToCheck) => roleToCheck === role)) {
      setAssignedRoles(assignedRoles.filter((part) => part !== role));

      setIsSelectOpen(true);
    } else {
      setAssignedRoles((prev) => {
        return [...prev, role];
      });
      setIsSelectOpen(true);
    }
  };

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <h2>Dodaj użytkownika</h2>
        <Form onSubmit={formik.handleSubmit} isSignInView={false}>
          {formik.status === 'error' && (
            <div className={styles.error}>Tworzenie nie powiodło się</div>
          )}

          <FormControl>
            <Input
              id="name"
              type="name"
              name="name"
              className={
                formik.touched.name && formik.errors.name
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Imię"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className={styles.error}>{formik.errors.name}</p>
            ) : null}
          </FormControl>
          <FormControl>
            <Input
              id="lastname"
              type="lastname"
              name="lastname"
              className={
                formik.touched.lastname && formik.errors.lastname
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Nazwisko"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastname}
            />
            {formik.touched.lastname && formik.errors.lastname ? (
              <p className={styles.error}>{formik.errors.lastname}</p>
            ) : null}
          </FormControl>
          <FormControl>
            <Input
              id="email"
              type="email"
              name="email"
              className={
                formik.touched.email && formik.errors.email
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className={styles.error}>{formik.errors.email}</p>
            ) : null}
          </FormControl>
          <FormControl>
            <Input
              id="password"
              type="password"
              name="password"
              className={
                formik.touched.password && formik.errors.password
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className={styles.error}>{formik.errors.password}</p>
            ) : null}
          </FormControl>
          <MultiselectDropdown
            isSelectOpen={isSelectOpen}
            setIsSelectOpen={setIsSelectOpen}
            label="Rola"
            inputKey="role"
            inputValue={selectFilterValue}
            handleInputValue={handleFilterDropdownInputValue}
            isBigger
            isSquare
          >
            {filteredRolesForDropdown.map((role) => {
              return (
                <FilterCheckbox
                  key={role}
                  name={role}
                  isSelected={assignedRoles.includes(role)}
                  toggleCompany={handleRoleAssign}
                  filterVariable={role}
                />
              );
            })}
          </MultiselectDropdown>
          <FormControl>
            <Input
              id="phone"
              type="phone"
              name="phone"
              className={
                formik.touched.phone && formik.errors.phone
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Telefon"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p className={styles.error}>{formik.errors.phone}</p>
            ) : null}
          </FormControl>

          <FormControl>
            <Input
              id="job"
              type="job"
              name="job"
              className={
                formik.touched.job && formik.errors.job
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Stanowisko"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.job}
            />
            {formik.touched.job && formik.errors.job ? (
              <p className={styles.error}>{formik.errors.job}</p>
            ) : null}
          </FormControl>
          <FormControl>
            <Input
              id="img"
              type="img"
              name="img"
              className={
                formik.touched.img && formik.errors.img
                  ? `${styles.errorBorder}`
                  : `${inputStyle.input}`
              }
              placeholder="Zdjęcie"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.img}
            />
            {formik.touched.img && formik.errors.img ? (
              <p className={styles.error}>{formik.errors.img}</p>
            ) : null}
          </FormControl>

          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            isSignInView={false}
          />
        </Form>
      </ModalTemplate>

      <ControlBar>
        <ControlBarTitle>Firmy</ControlBarTitle>

        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
            }}
          >
            Dodaj Użytkownika
          </CTA>
        </div>
      </ControlBar>
      <ViewContainer>
        <TilesColumnContainer>
          <InfoBar>
            <div className={styles.taskAuthorCreatorWrapperLabel}>
              <p className={styles.InfoBarElement}>Autor</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Utworzono</p>
            </div>

            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Klient</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Tytuł</p>
            </div>
          </InfoBar>

          <div className={styles.usersContainer}>
            {users.length === 0 ? (
              <SkeletonUsersLoading />
            ) : (
              users.map((user, index) => {
                return (
                  <TileWrapper
                    key={user._id}
                    linkPath={`/użytkownicy/${user._id}`}
                    index={index}
                  >
                    <div className={styles.taskAuthorCreatorWrapper}>
                      <img
                        src={user.img}
                        alt="user"
                        className={styles.userImg}
                      />
                      <p>{user.name}</p>
                      <p>{user.lastname}</p>
                    </div>
                    <div className={styles.tileContentWrapper}>
                      <p>{user.job}</p>
                    </div>
                    <div className={styles.tileContentWrapper}>
                      <p>{user.email}</p>
                    </div>
                    <div className={styles.tileContentWrapper}>
                      <p>{user.phone}</p>
                    </div>
                  </TileWrapper>
                );
              })
            )}
          </div>
        </TilesColumnContainer>
      </ViewContainer>
    </>
  );
}

export default UsersView;
