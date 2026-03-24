import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import Form from '../../Atoms/Form/Form';
import FormControl from '../../Atoms/FormControl/FormControl';
import Input from '../../Atoms/Input/Input';
import styles from './AddClientForm.module.css';
import { addClient } from '../../../services/clients-service';
import useClientsContext from '../../../hooks/Context/useClientsContext';
import SubmitButton from '../../Atoms/SubmitBtn/SubmitBtn';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import {
  getAllCompanies,
  UpdateCompany,
  // UpdateCompany,
} from '../../../services/companies-service';

const createClientSchema = Yup.object({
  name: Yup.string().required('Podaj nazwe'),
  company: Yup.string().required('Podaj firmę'),
  email: Yup.string(),
  phone: Yup.string(),
});

function AddClientForm({ companyName }) {
  const { dispatch } = useClientsContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const formik = useFormik({
    initialValues: {
      name: '',
      company: companyName || '',
      email: '',
      phone: '',
      notes: [],
    },
    validationSchema: createClientSchema,
    onSubmit: async (values) => {
      try {
        const { name, company, email, phone, notes } = values;

        const newClient = await addClient({
          name,
          company,
          email,
          phone,
          notes,
        });

        if (newClient !== null) {
          const filteredCompany = companies.find(
            (com) => com.name === newClient.company
          );

          if (!filteredCompany) {
            console.warn(`Company "${newClient.company}" not found.`);
            return;
          }

          const updatedClientPersons = [
            ...filteredCompany.clientPerson.filter(
              (person) => person.name !== newClient.name
            ),
            newClient,
          ];

          await UpdateCompany({
            id: filteredCompany._id,
            companyData: { clientPerson: updatedClientPersons },
          });

          const AllCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: AllCompanies });

          dispatch({ type: 'CREATE_CLIENT', payload: newClient });
          formik.setStatus('success');
          return;
        }

        formik.setStatus('error');
      } catch {
        formik.setStatus('error');
      }
    },
  });
  const formInputs = [
    {
      id: 'name',
      type: 'text',
      placeholder: `${
        formik.errors.name && formik.touched.name ? 'Uzupełnij nazwe!' : 'Nazwa'
      }`,
      inValue: formik.values.name,
      touchedProp: formik.touched.name,
      errorProp: formik.errors.name,
    },
    {
      id: 'phone',
      type: 'text',
      placeholder: `${
        formik.errors.phone && formik.touched.phone
          ? 'Uzupełnij telefon!'
          : 'Telefon'
      }`,
      inValue: formik.values.phone,
      touchedProp: formik.touched.phone,
      errorProp: formik.errors.phone,
    },
    {
      id: 'email',
      type: 'email',
      placeholder: `${
        formik.errors.email && formik.touched.email
          ? 'Uzupełnij email!'
          : 'Email'
      }`,
      inValue: formik.values.email,
      touchedProp: formik.touched.email,
      errorProp: formik.errors.email,
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, [companiesDispatch, companies]);

  const displayModalTitle = () => {
    if (
      (formik.errors.name && formik.touched.name) ||
      (formik.errors.company && formik.touched.company) ||
      (formik.errors.email && formik.touched.email) ||
      (formik.errors.phone && formik.touched.phone)
    ) {
      return (
        <h2 className={styles.addClientModalTitle}>Coś poszło nie tak :(</h2>
      );
    } else if (formik.status === 'success') {
      return (
        <div className={styles.modalWrapper}>
          <Icon
            icon="line-md:circle-to-confirm-circle-transition"
            width="24"
            height="24"
            className={styles.successIcon}
          />
          <h2 className={styles.addClientModalTitle}>Klient utworzony!</h2>
        </div>
      );
    }

    return <h2 className={styles.addClientModalTitle}>Dodaj klienta</h2>;
  };
  return (
    <>
      {displayModalTitle()}
      <Form onSubmit={formik.handleSubmit} isSignInView={false}>
        <>
          {formInputs
            .filter(({ id }) => id !== 'company')
            .map(
              ({ id, type, placeholder, inValue, touchedProp, errorProp }) => (
                <FormControl key={id}>
                  <Input
                    id={id}
                    type={type}
                    name={id}
                    placeholder={placeholder}
                    className={
                      touchedProp && errorProp
                        ? `${styles.errorBorder}`
                        : `${styles.input}`
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={inValue}
                  />
                </FormControl>
              )
            )}

          <FormControl>
            <select
              id="company"
              name="company"
              className={
                formik.touched.company && formik.errors.company
                  ? `${styles.errorBorder} ${styles.selectInput}`
                  : `${styles.selectInput}`
              }
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Wybierz firmę</option>
              {companies.map((company) => (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
            {formik.touched.company &&
              typeof formik.errors.company === 'string' && (
                <div className={styles.errorMessage}>
                  {formik.errors.company}
                </div>
              )}
          </FormControl>
        </>

        <div className={styles.buttonWrapper}>
          {formik.isSubmitting && <CheckboxLoader />}
          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            isSignInView={false}
          />
        </div>
      </Form>
    </>
  );
}

export default AddClientForm;
