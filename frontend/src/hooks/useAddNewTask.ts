import { useRef, useState } from 'react';
import { addTask } from '../services/tasks-service';
// import useTasksContext from './useTasksContext';

const useAddNewTask = () => {
  const defaultImgSrc = './add-image-icon.svg';
  const imgIconRef = useRef(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [path, setPath] = useState('Z:');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('200');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState('');
  const [imgLabel, setImgLabel] = useState('Dodaj zdjęcie');
  const [image, setImage] = useState(null);
  const [finalMessage, setFinalMessage] = useState('');
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearValues = () => {
    setIsLoading(false);
    setShowFinalMessage(false);
    setImage(null);
    setTitle('');
    setClient('');
    setPath('Z:');
    setDescription('');
    setStatus('');
    setDeadline('');
    setImgLabel('Dodaj zdjęcie');
  };

  const imgSrc = image ? URL.createObjectURL(image) : defaultImgSrc;

  const handleIconClick = () => {
    imgIconRef.current.click();
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleClientChange = (event) => {
    setClient(event.target.value);
  };

  const handlePathChange = (event) => {
    setPath(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDeadlineChange = (date) => {
    setDeadline(date);
  };

  const handleFileChange = (event) => {
    const [file] = event.target.files;
    if (file) {
      setImage(file);
      setImgLabel('Zmień zdjęcie');
    }
  };

  // const { dispatch } = useTasksContext();

  const createTaskHandler = async () => {
    try {
      setIsLoading(true);
      const response = await addTask({
        title,
        client,
        path,
        description,
        image,
        priority,
        status,
        deadline,
      });

      if (response !== null) {
        setFinalMessage('Zlecenie utworzone!');
      } else {
        setFinalMessage('Coś poszło nie tak :(');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setShowFinalMessage(true);
      // dispatch({
      //   type: 'ADD_TASK',
      //   payload: {
      //     title,
      //     client,
      //     path,
      //     description,
      //     image,
      //     priority,
      //     status,
      //     deadline,
      //   },
      // });
    }
  };

  return {
    imgLabel,
    imgSrc,
    isLoading,
    finalMessage,
    showFinalMessage,
    title,
    client,
    path,
    description,
    image,
    deadline,
    handleIconClick,
    imgIconRef,
    handleFileChange,
    handleTitleChange,
    handleClientChange,
    handlePathChange,
    handleDescriptionChange,
    handlePriorityChange,
    handleStatusChange,
    handleDeadlineChange,
    createTaskHandler,
    clearValues,
  };
};

export default useAddNewTask;
