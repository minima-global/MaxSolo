import React from 'react';
import { ShareIcon } from '../icons/MaxSoloIcons';

const DropDown = ({ getMaximaContact }) => {

  return (
    <>          
      <div onClick={getMaximaContact} className="header-right-button" >
        <ShareIcon  />
      </div> 
    </>
  );
};

export default DropDown;