import React, { useState, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const EditProfile = ({ isSelectedTab, setSelectedTab, responseContact, restartContacts }) => {

    const [infoCopyText, setInfoCopyText] = useState('');
    const [infoNotifyText, setInfoNotifyText] = useState('');
    const setProfileRef = useRef(null);

    const copyToClipboard = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(responseContact);
      setInfoCopyText('Copied to clipboard!');
      setTimeout(() => {
        setInfoCopyText('');
      }, 3000); 
    };
 
    const setProfile = () => {
      if(setProfileRef.current.value===""){
        setSelectedTab(0);
        return;
      }else{
        var specialChars = /[^a-zA-Z0-9 ]/g;
        if (setProfileRef.current.value.match(specialChars)) {
          setInfoNotifyText('Only characters A-Z, a-z and 0-9 are allowed!');
          setTimeout(() => {
            setInfoNotifyText('');
          }, 5000); 
          return;
        }
        const setprofile = "maxima action:setname name:"+setProfileRef.current.value+"";
        window.MDS.cmd(setprofile, function(resp) {
          console.log(resp)
          if (resp.status) {
            setProfileRef.current.value="";
            restartContacts();
            setSelectedTab(0);
          }
          else{
            setInfoNotifyText('Could not update name.');
          }
        });
      }
    
    }

    const GoBack = () =>{
      return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      )
    }

    return (
        <div className={`maxsolo-sidebar-container ${isSelectedTab === 1 ? 'active' : ''}`} >
            <div className='maxsolo-sidebar-container-button' onClick={setProfile}>
              <GoBack /> Edit profile
            </div>
            <div className='maxsolo-sidebar-container-content'>
              <div className='main-title'>Display Name</div>
              <input type="text" placeholder="Typing" ref={setProfileRef} className={`${infoNotifyText ? 'error' : ''}`} />
              <div className='info-input'>{infoNotifyText}</div>
              <div className={`maxsolo-sidebar-notification info-sidebar`}>
                <div className='maxsolo-sidebar-notification-icon'>
                  <FaInfoCircle />
                </div>
                <div className='maxsolo-sidebar-notification-content'>
                  <span className='copy'>
                    Send your address to others to start chatting. Please note that your address changes roughly every 12 hours.
                  </span>
                </div>
              </div>
              <div className='maxsolo-sidebar-container-content-address'>
                <div className='maxsolo-sidebar-container-content-address-header'>
                  <div className='title'>My Address</div>
                  <div className='copy-button'onClick={copyToClipboard}>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.33398 17.9746C4.86732 17.9746 4.45898 17.8246 4.10898 17.5246C3.75898 17.2246 3.58398 16.8746 3.58398 16.4746V2.47461C3.58398 2.07461 3.75898 1.72461 4.10898 1.42461C4.45898 1.12461 4.86732 0.974609 5.33398 0.974609H18.1673C18.634 0.974609 19.0423 1.12461 19.3923 1.42461C19.7423 1.72461 19.9173 2.07461 19.9173 2.47461V16.4746C19.9173 16.8746 19.7423 17.2246 19.3923 17.5246C19.0423 17.8246 18.634 17.9746 18.1673 17.9746H5.33398ZM5.33398 16.4746H18.1673V2.47461H5.33398V16.4746ZM1.83398 20.9746C1.36732 20.9746 0.958984 20.8246 0.608984 20.5246C0.258984 20.2246 0.0839844 19.8746 0.0839844 19.4746V4.39961H1.83398V19.4746H15.659V20.9746H1.83398ZM5.33398 2.47461V16.4746V2.47461Z" fill="#317AFF"/>
                    </svg>
                  </div>
                </div>
                <div className='display-address'>
                  {responseContact}
                </div>
              </div>
              <div className='info-message'>{infoCopyText}</div>
            </div>
        </div>
    )
}

export default EditProfile;