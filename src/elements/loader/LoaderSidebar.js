import React from 'react';
import ChatIcon from '../../assets/images/maxsolo_chat_icon.svg';

const LoaderSidebar = ({welcomeAddContact}) => {

    return (
        <>
            <div className='welcome-contacts'>
                <img className="welcome-contacts-body-icon" src={ChatIcon} alt="Add contact to Maxima" />
                <div className='welcome-contacts-body-header'>Add a contact to Maxima<br /> to start chatting!</div>
                <div className='welcome-contacts-body-copy'>Looks like you don’t have any contacts right now, add a contact or share your address with another user to get started.</div>
                <button onClick={welcomeAddContact(2)} className="minima-btn btn-fill-blue-medium">Add contact</button>  
                <button onClick={welcomeAddContact(4)} className="minima-btn btn-fill-black-medium">Share my address</button>    
            </div>
        </>
    )
}

export default LoaderSidebar;