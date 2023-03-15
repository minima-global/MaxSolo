import React from 'react';
import Minimaimage from '../../assets/images/minima_logotype.svg'
import Lottie from 'react-lottie';
import animationData from '../../assets/images/maxsolo_logo.json';

const WelcomeLogo = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <>
        <div data-testid="welcome-logo" className='welcome-logo clip-animation' >  
            <div className='welcome-logo-symbol'> 
            <Lottie options={defaultOptions} height={400} width={400}/>
            </div>
            <div className='welcome-logo-minima'> 
                <img className="light-version-logo" src={Minimaimage} alt="logo" /> 
            </div>              
        </div>
        </>
    )
}

export default WelcomeLogo;