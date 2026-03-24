import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';
import FormContainer from '../../Atoms/FormContainer/FormContainer';
import Form from '../../Atoms/Form/Form';
import Input from '../../Atoms/Input/Input';
import styles from './SignIn.module.css';
import FormControl from '../../Atoms/FormControl/FormControl';
import Label from '../../Atoms/Label/Label';
import useAuth from '../../../hooks/useAuth';
import inputStyle from '../../Atoms/Input/Input.module.css';
import SubmitButton from '../../Atoms/SubmitBtn/SubmitBtn';

const signInSchema = Yup.object({
  password: Yup.string().required('Hasło jest wymagane'),
  email: Yup.string()
    .email('Nieprawidłowy adres email')
    .required('Email jest wymagany'),
});

function SignIn() {
  const { user, signIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: (values) => {
      const { email } = values;
      const { password } = values;
      formik.setStatus(null);
      return signIn({ email, password }).catch(() => {
        formik.setStatus('error');
      });
    },
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <img src="./orange.png" alt="logo gamma" className={styles.logo} />
      <FormContainer>
        <Form onSubmit={formik.handleSubmit} isSignInView>
          <h1 className={styles.testHeader}>Zaloguj się</h1>
          {formik.status === 'error' && (
            <div className={styles.error}>Logowanie nie powiodło się</div>
          )}

          <FormControl>
            <Label htmlFor="email" labelContent="Email" />
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
            <Label htmlFor="password" labelContent="Password" />
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

          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Logowanie' : 'Zaloguj'}
            isSignInView
          />
        </Form>
      </FormContainer>
    </>
  );
}

export default SignIn;
