import React, { useState } from 'react';
import Avatar from 'react-avatar';

const UserProfile = ({ showUserProfile, deleteContact, deleteMessages, lastSeen, roomName, setShowUserProfile, publicRoomKey }) => {

    const [infoCopyText, setInfoCopyText] = useState('Share contact');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);
    
    const onCancelClick = () => {   
      setShowUserProfile(false);
    };

    const onConfirmDelete = () => {
      setConfirmDelete(!confirmDelete);
    }

    const onConfirmRemove = () => {
      setConfirmRemove(!confirmRemove);
    }

    const copyToClipboard = () => {
      window.MDS.cmd("maxcontacts action:search publickey:"+publicRoomKey,function(resp){
        navigator.clipboard.writeText(resp.response.contact.currentaddress);
        setInfoCopyText('Copied to clipboard!');
        setTimeout(() => {
          setInfoCopyText('Share contact');
        }, 3000); 
      });
    };

    const GoBack = () =>{
      return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      )
    }

    return (
        <div className={`maxsolo-modal-container ${showUserProfile ? 'active' : ''}`} >
            <div className='maxsolo-modal-container-button' onClick={onCancelClick}>
              <GoBack /> Back
            </div>
            <div className={`maxsolo-modal-container-content ${confirmDelete || confirmRemove ? 'hide' : ''}`}>

              <div className='close-window' onClick={onCancelClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>

              <div className='userpick'><Avatar className="maxsolo-chat-area-title-profile" name={roomName} size={74} round={true} maxInitials={2}/></div>
              <div className='main-title'>{roomName}</div>
              <div className='last-seen'>Last seen today at {lastSeen}</div>
              <div className='button'>
                <button onClick={copyToClipboard} className={`minima-btn btn-fill-blue-medium ${infoCopyText === 'Copied to clipboard!' ? 'success' : ''}`}>{infoCopyText}</button>
                <button onClick={onConfirmDelete} className="minima-btn btn-outlined-blue">Delete chat</button>
                <button onClick={onConfirmRemove} className="minima-btn btn-fill-black-medium">Remove contact</button>
              </div>
            </div>
            <div className={`maxsolo-modal-container-confirm-delete`}>
                <div className={`overlay ${confirmDelete || confirmRemove ? 'show' : ''}`}></div>
                <div className={`content ${confirmDelete || confirmRemove ? 'show' : ''}`}>                
                  <div className='copy'>{confirmDelete ? "Are you sure you want to delete your messages?" : "Are you sure you want to remove this person from contacts? \n\n This action will also delete the mesages in this chat."}</div>
                  <button onClick={() => { if(confirmDelete){ deleteMessages(); setShowUserProfile(false); onConfirmDelete();}else{ deleteContact(); setShowUserProfile(false); onConfirmRemove(); }}} className={`minima-btn btn-fill-red-medium`}>{confirmDelete ? "Delete chat" : "Remove contact"}</button>
                  <button onClick={() => { setConfirmDelete(false); setConfirmRemove(false); }} className="minima-btn btn-fill-black-medium">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;