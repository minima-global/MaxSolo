import React, {useEffect, useRef} from 'react';

const ScrollBottom = () => {
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView();
    // divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  return <div ref={divRef}></div>;
}

export default ScrollBottom;