import React from 'react';
import Welcomeimage from '../../assets/images/maxsolo_select_message.svg'

const WelcomeLoader = () => {
    return (
        <>
            <div className='welcome'>
                <div className='header-bar'></div>
                <div className='body-copy'>  
                    <div className='header-title'><button className="minima-btn btn-fill-white-medium">Select a message to start chatting</button></div>
                    <img className="welcome-image" src={Welcomeimage} alt="Welcome" />
                </div>  
            </div>
        </>
    )
}

export default WelcomeLoader;