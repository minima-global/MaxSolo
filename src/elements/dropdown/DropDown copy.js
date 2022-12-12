import React, { useRef, useState } from 'react';
import { ClickOutside } from '../../utils';

const DropDown = ({ deleteMessages, getMaximaContact, roomName }) => {

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
      <svg onClick={() => setOpen(!open)} className="header-right-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
      {open && (
        <div className={`header-dropdown ${open ? "show" : ""}`} ref={showMenu}>
          <ul>
            <li onClick={() => { deleteMessages(); toggleIsOpen();}}>Delete chat</li>
            <li onClick={() => { getMaximaContact(); toggleIsOpen();}}>Share user's address</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default DropDown;