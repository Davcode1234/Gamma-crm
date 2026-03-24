import { useEffect, useState } from 'react';

const useSideNavHide = () => {
  const [isSideNavHidden, setIsSideNavHidden] = useState(() => {
    const storedState = localStorage.getItem('isSideNavHidden');
    return storedState ? JSON.parse(storedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('isSideNavHidden', JSON.stringify(isSideNavHidden));
  }, [isSideNavHidden]);

  return { isSideNavHidden, setIsSideNavHidden };
};

export default useSideNavHide;
