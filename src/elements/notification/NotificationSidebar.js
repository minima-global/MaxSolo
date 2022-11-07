import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const NotificationSidebar = forwardRef((props, ref) => {

  const [isClosing, setIsClosing] = useState(false);
  const [isNotify, setIsNotify] = useState({message: "Message", type: "info"});
  const barRef = useRef();

  useImperativeHandle(ref, () => ({
    notifyMessage(message, type) {
      console.log(message, type)
      setIsNotify({message: message, type: type})
      showNotification();
    }
  }));

  const showNotification = () => {
    setIsClosing(true);
    clearTimeout(barRef.current);
    barRef.current = setTimeout(() => {
      setIsClosing(false);
    }, 3000);
  };

    return (
        <>
              <div className={`maxsolo-sidebar-notification ${isClosing ? "slideIn" : "slideOut"} ${isNotify.type === "info" ? "info" : "error"}`}>
                <div className='maxsolo-sidebar-notification-icon'>
                  {isNotify.type === "info" ? <FaInfoCircle /> : <FaTimesCircle />}
                </div>
                <div className='maxsolo-sidebar-notification-content'>
                  <span className='copy'>{isNotify.message}</span>
                </div>
              </div>
        </>
    )
})

export default NotificationSidebar;