import { useEffect, useState } from 'react';
import { pl } from 'date-fns/locale';
import { DayPicker, DateRange } from 'react-day-picker';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './AddStudioTaskModalContent.module.css';
import useAuth from '../../../hooks/useAuth';
import {
  addStudioTask,
  getHighestSearchID,
  StudioTaskTypes,
} from '../../../services/studio-tasks-service';
import generateSearchID from '../../../utils/generateSearchId';
import Form from '../../Atoms/Form/Form';
import Input from '../../Atoms/Input/Input';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import SubmitButton from '../../Atoms/SubmitBtn/SubmitBtn';
import socket from '../../../socket';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';

type StatusType =
  | 'do_wzięcia'
  | 'na_później'
  | 'do_zrobienia'
  | 'w_trakcie'
  | 'wysłane';

type StudioTaskFormValues = {
  title: string;
  client: string;
  clientPerson: string;
  status: StatusType;
  taskType: string;
  description: string;
  deadline: string;
};

const createStudioTaskSchema: Yup.ObjectSchema<StudioTaskFormValues> =
  Yup.object({
    title: Yup.string().required('Uzupełnij tytuł!'),
    client: Yup.string().required('Uzupełnij firme!'),
    clientPerson: Yup.string().required('Uzupełnij klienta!'),
    status: Yup.mixed<StatusType>()
      .oneOf([
        'do_wzięcia',
        'na_później',
        'do_zrobienia',
        'w_trakcie',
        'wysłane',
      ])
      .required('Uzupełnij status!'),
    taskType: Yup.string(),
    description: Yup.string(),
    deadline: Yup.string(),
  });

function AddStudioTaskModalContent({
  tasksByStatus,
  companies,
  statuses,
  statusNames,
  filteredUsersForDropdown,
  handleFilterDropdownInputValue,
  selectFilterValue,
}) {
  const [participantsToAdd, setParticipantsToAdd] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [newSearchID, setNewSearchID] = useState<number>(0);
  const { dispatch } = useStudioTasksContext();
  const { user } = useAuth();

  useEffect(() => {
    const getNewSearchID = async () => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const response = await getHighestSearchID(year, month);
      if (response) {
        setNewSearchID(response);
      }
    };

    getNewSearchID();
  }, []);

  const formik = useFormik<StudioTaskFormValues>({
    initialValues: {
      title: '',
      client: '',
      clientPerson: '',
      status: 'do_wzięcia',
      taskType: '',
      description: '',
      deadline: '',
    },
    validationSchema: createStudioTaskSchema,
    onSubmit: async (values) => {
      const { title } = values;
      const { client } = values;
      const { clientPerson } = values;
      const { status } = values;
      const { taskType } = values;
      const { description } = values;
      // const { deadline } = values;

      const currentDate = new Date();
      const isRangeValid = !!(range?.from && range?.to);
      const searchID = generateSearchID(newSearchID);
      const statusValue: StudioTaskTypes['status'] =
        status as StudioTaskTypes['status'];

      let indexOfNewTask;
      if (tasksByStatus[statusValue].length > 0) {
        indexOfNewTask =
          tasksByStatus[statusValue][tasksByStatus[statusValue].length - 1]
            .index + 1;
      }
      if (tasksByStatus[statusValue].length === 0) {
        indexOfNewTask = tasksByStatus[statusValue].length + 1;
      }

      formik.setStatus(null);

      try {
        const response = await addStudioTask({
          searchID,
          reckoTaskID: '',
          title,
          client,
          clientPerson,
          status,
          index: indexOfNewTask,
          author: user[0],
          taskType,
          participants: participantsToAdd,
          description,
          subtasks: [],
          deadline: isRangeValid ? String(range.to) : null,
          startDate: isRangeValid ? range.from : currentDate,
          createdAt: currentDate,
        });

        if (response !== null) {
          socket.emit('taskAdded', response);
          dispatch({ type: 'CREATE_STUDIOTASK', payload: response });
          formik.setStatus('success');
        }
      } catch (error) {
        formik.setStatus('error');
      }
    },
  });

  const handleUserAssign = (userOnDrop) => {
    if (
      participantsToAdd.some(
        (userToCheck) => userToCheck._id === userOnDrop._id
      )
    ) {
      setParticipantsToAdd(
        participantsToAdd.filter((part) => part._id !== userOnDrop._id)
      );

      setIsSelectOpen(true);
    } else {
      setParticipantsToAdd((prev) => {
        return [...prev, userOnDrop];
      });
      setIsSelectOpen(true);
    }
  };

  return (
    <div className={styles.addTaskModalContainer}>
      <h2 className={styles.modalTitle}>
        {formik.status === 'success' ? (
          <div className={styles.successMessageWrapper}>
            <Icon
              icon="line-md:circle-to-confirm-circle-transition"
              width="24"
              height="24"
              className={styles.successIcon}
            />
            <p className={styles.successMessage}>Zlecenie utworzone!</p>
          </div>
        ) : (
          'Utwórz zlecenie'
        )}
      </h2>

      <Form onSubmit={formik.handleSubmit} isSignInView={false}>
        {formik.status === 'error' && <p>Coś poszło nie tak :(</p>}
        <div className={styles.modalFlexWrapper}>
          <div className={styles.inputsContainer}>
            <Input
              id="title"
              type="title"
              name="title"
              className={
                formik.touched.title && formik.errors.title
                  ? `${styles.errorTitleInput}`
                  : `${styles.titleInput}`
              }
              placeholder={
                formik.touched.title && formik.errors.title
                  ? formik.errors.title
                  : 'Tytuł'
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {/* {formik.touched.title && formik.errors.title ? (
            <p className={styles.error}>{formik.errors.title}</p>
          ) : null} */}

            <div className={styles.selectsWrapper}>
              <select
                id="client"
                name="client"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.client}
                className={
                  formik.touched.client && formik.errors.client
                    ? `${styles.errorInput}`
                    : `${styles.selectInput}`
                }
              >
                <option value="">
                  {formik.touched.client && formik.errors.client ? (
                    <p className={styles.error}>{formik.errors.client}</p>
                  ) : (
                    'Firma'
                  )}
                </option>
                {companies.map((company) => {
                  return (
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  );
                })}
              </select>

              <select
                id="clientPerson"
                name="clientPerson"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clientPerson}
                className={
                  formik.touched.clientPerson && formik.errors.clientPerson
                    ? `${styles.errorInput}`
                    : `${styles.selectInput}`
                }
              >
                <option value="">
                  {formik.touched.clientPerson && formik.errors.clientPerson ? (
                    <p className={styles.error}>{formik.errors.clientPerson}</p>
                  ) : (
                    'Klient'
                  )}
                </option>
                {formik.values.client.length > 0 &&
                  companies.map((company) => {
                    if (company.name === formik.values.client) {
                      return company.clientPerson.map((cp) => {
                        return (
                          <option key={cp.name} value={cp.name}>
                            {cp.name}
                          </option>
                        );
                      });
                    }
                    return null;
                  })}
              </select>
            </div>

            <div className={styles.selectsWrapper}>
              {/* <button
                type="button"
                className={styles.usersMultiselectOpenButton}
                onClick={() => setIsSelectOpen(true)}
              >
                <Icon
                  icon="material-symbols:keyboard-arrow-down-rounded"
                  width="17"
                  height="17"
                  className={`${
                    isSelectOpen ? styles.upArrow : styles.downArrow
                  }`}
                />
              </button>

              {isSelectOpen && <div></div>} */}

              <MultiselectDropdown
                isSelectOpen={isSelectOpen}
                setIsSelectOpen={setIsSelectOpen}
                label="Członkowie"
                inputKey="user"
                inputValue={selectFilterValue.user}
                handleInputValue={handleFilterDropdownInputValue}
                isBigger={false}
                isSquare
              >
                {filteredUsersForDropdown.map((userOnDrop) => {
                  return (
                    user._id !== user[0]._id && (
                      <FilterCheckbox
                        key={userOnDrop._id}
                        name={userOnDrop.name}
                        isSelected={participantsToAdd.includes(userOnDrop)}
                        toggleCompany={handleUserAssign}
                        filterVariable={userOnDrop}
                      />
                    )
                  );
                })}
              </MultiselectDropdown>

              <select
                id="taskType"
                name="taskType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.taskType}
                className={
                  formik.touched.taskType && formik.errors.taskType
                    ? `${styles.errorInput}`
                    : `${styles.selectInput}`
                }
              >
                <option value="">
                  {formik.touched.taskType && formik.errors.taskType ? (
                    <p className={styles.error}>{formik.errors.taskType}</p>
                  ) : (
                    'Rodzaj'
                  )}
                </option>
                <option value="Kreacja">Kreacja</option>
                <option value="Druk">Druk</option>
                <option value="Multimedia">Multimedia</option>
                <option value="Gadżety">Gadżety</option>
                <option value="Szwalnia">Szwalnia</option>
              </select>
            </div>

            <Input
              id="description"
              type="description"
              name="description"
              className={
                formik.touched.description && formik.errors.description
                  ? `${styles.errorDescriptionInput}`
                  : `${styles.descriptionInput}`
              }
              placeholder="Opis"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />

            <select
              id="status"
              name="status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              className={
                formik.touched.status && formik.errors.status
                  ? `${styles.errorInput}`
                  : `${styles.selectInput}`
              }
            >
              <option value="">
                {formik.touched.status && formik.errors.status ? (
                  <p className={styles.error}>{formik.errors.status}</p>
                ) : (
                  'Status'
                )}
              </option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusNames[status]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.calendarContainer}>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              // disabled={{ before: task.startDate }}
              min={1}
              max={180}
              locale={pl}
            />
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          {formik.isSubmitting && <CheckboxLoader />}
          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            isSignInView={false}
          />
        </div>
      </Form>
    </div>
  );
}

export default AddStudioTaskModalContent;
