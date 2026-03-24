import { useState } from 'react';

const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [exitAnim, setExitAnim] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setExitAnim(true);

    setTimeout(() => {
      setShowModal(false);
      setExitAnim(false);
    }, 300);
  };

  return { showModal, exitAnim, openModal, closeModal };
};

export default useModal;
