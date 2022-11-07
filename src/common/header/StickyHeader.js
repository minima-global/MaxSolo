import {useLayoutEffect, useState} from "react";

const StickyHeader = (offset = 0) => {
    const [scrollStatus, setScrollStatus] = useState({
        scrollDirection: null,
        scrollPos: 0,
      });
  
    const handleScroll = () => {
        if( window.pageYOffset > offset ) {
            setScrollStatus((prev) => { // to get 'previous' value of state
                return {
                    scrollDirection:
                    window.pageYOffset <= prev.scrollPos
                        ? "up"
                        : "down",
                    scrollPos: window.pageYOffset,
                  };
              });
          }
    };
    
    useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);
        return(() => {
            window.removeEventListener('scroll', handleScroll);
        });
    });
    return { scrollStatus };
}

export default StickyHeader