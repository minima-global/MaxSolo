import React, { useRef, useState } from 'react';
import { ClickOutside } from '../../utils';
import { FaShareAlt } from 'react-icons/fa';

const DropDown = ({ getMaximaContact }) => {

  const showMenu = useRef(null)
  let [open, setOpen] = useState(false);

	const toggleIsOpen = () => {
    const content = showMenu.current;
    content.classList.remove('show');
    setOpen(false);
	};

  ClickOutside(showMenu, () => {
    setOpen(false);
    const content = showMenu.current;
    content.classList.remove('show');
  });

  return (
    <>          
      <FaShareAlt onClick={getMaximaContact} className="header-right-button" /> 
    </>
  );
};

export default DropDown;