import { useState } from 'react';

const useShowLabel = () => {
  const [labelState, setLabelState] = useState({
    isLabel: false,
    labelId: '',
    labelValue: '',
    mousePosition: null,
  });

  const handleMouseEnter = (id, value, e) => {
    const rect = e.target.getBoundingClientRect();
    setLabelState({
      isLabel: true,
      labelId: id,
      labelValue: value,
      mousePosition: {
        top: rect.bottom + 5 + window.scrollY,
        left: rect.left + window.scrollX,
      },
    });
  };

  const handleMouseLeave = () => {
    setLabelState({
      isLabel: false,
      labelId: '',
      labelValue: '',
      mousePosition: null,
    });
  };
  return {
    labelState,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useShowLabel;
